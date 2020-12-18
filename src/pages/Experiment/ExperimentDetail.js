import { Card, Checkbox, Col, Row, Table, Tabs } from 'antd';
import React, { PureComponent } from 'react';

import AlarmSettingModal from './components/AlarmSettingModal';
import AxisModal from './components/AxisModal';
import LineChart from './components/LineChart';
import StatisticsList from './components/StatisticsList';
import TimeAxisModal from './components/TimeAxisModal';
// import { ChartCard } from '@/components/Charts';
import { connect } from 'dva';
import moment from 'moment';
import numeral from 'numeral';
// import { chain } from 'mathjs'
import styles from './History.less';

const CheckboxGroup = Checkbox.Group;

const { TabPane } = Tabs;
const columns = [
  {
    title: '试验编号',
    dataIndex: 'TestSN',
    key: 'TestSN',
  },
  {
    title: '试验名称',
    dataIndex: 'TestName',
    key: 'TestName',
  },
  {
    title: '试验类型',
    dataIndex: 'TestType',
    key: 'TestType',
  },
  // {
  //   title: '试验类型',
  //   dataIndex: 'TestType',
  //   key: 'TestType',
  // },
  // {
  //   title: '试验标准',
  //   // dataIndex: 'TestStyle',
  //   // key: 'TestStyle',
  // },
  {
    title: '采样间隔',
    dataIndex: 'SamplingInterval',
    key: 'SamplingInterval',
  },
  // {
  //   title: '被测机名称',
  //   // dataIndex: 'TestStyle',
  //   // key: 'TestStyle',
  // },
  {
    title: '被测机型号',
    dataIndex: 'UUTModel',
    key: 'UUTModel',
  },
];
@connect(({ experimentHistory, loading }) => ({
  experimentHistory,
  loading: loading.models.experimentHistory,
}))
class History extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      statisticsList: [],
      timeDiff: 0,
      axisModalVisible: false,
      timeAxisModalVisible: false,
      alarmSettingVisible: false,
      // startTime: moment('2020-05-09 05:47:46'),
      appendTime: moment('2020-05-09 05:25:50'),
    };
    this.lineChart = '';
    this.timeIndex = '';
  }

  async componentDidMount () {
    clearTimeout(this.timeIndex);
    const {
      dispatch,
      match: {
        params: { id = '2', link = '1' },
      },
    } = this.props;
    await dispatch({
      type: 'experimentHistory/getYSetting',
      payload: id,
    });
    await dispatch({
      type: 'experimentHistory/getSetting',
      payload: id,
    });
    await dispatch({
      type: 'experimentHistory/getHistoryData',
      payload: { id, startTime: '' },
      callback: () => {
        setTimeout(() => {
          if (this.lineChart) this.lineChart.onChange();
          if (link === '2') {
            this.runLiveData();
          }
        }, 200);
      },
    });
  }

  componentWillUnmount () {
    clearTimeout(this.timeIndex);
  }

  async setChartData (data) {
    const { dispatch } = this.props;
    await dispatch({
      type: 'experimentHistory/appendData',
      payload: data,
    });
    if (this.lineChart) this.lineChart.onChange();
  }

  getColorList () {
    const chart = this.lineChart.getChart();
    const { _seriesIndices } = chart.getModel();
    // 获取颜色
    const colorList = _seriesIndices.map(i => {
      const series = chart.getModel().getSeriesByIndex(i);
      const { name } = series;
      const color = series.getData().getVisual('color');
      return {
        name,
        color,
        isSelect: true,
      };
    });
    return colorList;
  }

  getSum = values =>
    values.reduce(
      (mySum, value) =>
        numeral(mySum)
          .add(value)
          .value(),
      0
    );

  // 显示坐标轴设置弹窗
  showAxisModal = () => {
    this.setState({
      axisModalVisible: true,
    });
  };

  // 显示时间轴设置弹窗
  showTimeAxisModal = () => {
    this.setState({
      timeAxisModalVisible: true,
    });
  };

  // 显示报警弹窗
  showAlarmSettingModal = () => {
    this.setState({
      alarmSettingVisible: true,
    });
  };

  // 取消数轴配置窗
  onCancelAxisModal = () => {
    this.setState({
      axisModalVisible: false,
    });
  };

  // 取消时间轴配置窗
  onCancelTimeAxisModal = () => {
    this.setState({
      timeAxisModalVisible: false,
    });
  };

  // 取消报警弹窗
  onCancelAlarmSettingModal = () => {
    this.setState({
      alarmSettingVisible: false,
    });
  };

  // 根据当前datazoom数据过滤试验数据
  filterData = datazoom => {
    const xRange = datazoom.find(item => item.type === 'x');
    const colorList = this.getColorList();
    const { startValue = 0, endValue = 0 } = xRange;
    const timeDiff = endValue - startValue;
    const {
      experimentHistory: { yAxisSetting },
    } = this.props;
    const result = [];
    let lastTime = moment().format('YYYY-MM-DD HH:mm:ss');
    yAxisSetting.forEach(item => {
      if (item.showAxis) {
        const { bindKeyData = [] } = item;
        bindKeyData.forEach(bindData => {
          if (result.findIndex(resultItem => resultItem.key === bindData.key) > -1) {
            return;
          }
          const keyData = bindData.data;
          const lastData = keyData[keyData.length - 1] || { time: '', value: [] };
          const lastValue = lastData.value[1] || '--';
          // todo 判断最后的时间是否是最大的；
          lastTime = lastData.name;
          const values = keyData.reduce((list, dItem) => {
            const time = new Date(dItem.name);
            if (time >= startValue && time <= endValue) {
              list.push(dItem.value[1]);
            }
            return list;
          }, []);
          const sum = this.getSum(values);
          const avg = numeral(sum)
            .divide(values.length)
            .format('0,0.0000');
          const min = values.length ? Math.min.apply(null, values) : 0;
          const max = values.length ? Math.max.apply(null, values) : 0;
          const { color = '#999', isSelect = false } =
            colorList.find(i => i.name === bindData.name) || {};
          result.push({
            key: bindData.key,
            name: bindData.name,
            color,
            avg,
            min,
            max,
            isSelect,
            live: lastValue,
          });
        });
      }
    });
    this.setState({
      statisticsList: result,
      timeDiff,
      appendTime: lastTime,
    });
    return result;
  };

  getInfo = setting => {
    const result = {
      FacilityName: '',
      TestSN: '',
      TestName: '',
      TestType: '',
      TestTime: '',
      SamplingInterval: '',
      UUTID: '', // name: "被测机编号"
      UUTModel: '', // name: "被测机型号"
      UUTStyle: '', // name: "被测机类型"
    };
    Object.keys(result).forEach(key => {
      const node = setting.find(item => item.key === key) || { value: '' };
      result[key] = node.value;
    });
    return result;
  };

  getSettingList = setting => {
    const result = [
      'FacilityName',
      'TestSN',
      'TestName',
      'SamplingInterval',
      'TestType',
      'TestTime',
      'UUTID', // name: "被测机编号"
      'UUTModel', // name: "被测机型号"
      'UUTStyle', // name: "被测机类型" ]
    ];
    return setting.filter(({ key }) => !result.includes(key));
  };

  onSelectChange = (selectedRowKeys, selectedRows, allRows) => {
    const chart = this.lineChart.getChart();
    allRows.forEach(item => {
      const selectRow = selectedRows.find(row => row.name === item.name);
      if (selectRow) {
        // 如果之前不选中而现在选中，则选中他
        if (!selectRow.isSelect) {
          chart.dispatchAction({
            type: 'legendSelect',
            // 图例名称
            name: item.name,
          });
        }
      } else if (item.isSelect) {
        // 如果之前选中，而现在不选中，则不选中
        chart.dispatchAction({
          type: 'legendUnSelect',
          // 图例名称
          name: item.name,
        });
      }
    });
    if (this.lineChart) this.lineChart.onChange();
  };

  runLiveData = () => {
    this.timeIndex = setTimeout(() => {
      const { appendTime } = this.state;
      // this.setState({
      //   startTime: moment(startTime).add(1, 'seconds')
      // })
      const {
        dispatch,
        match: {
          params: { id = '' },
        },
      } = this.props;
      dispatch({
        type: 'experimentHistory/getLiveData',
        payload: { id, startTime: moment(appendTime).format('YYYY-MM-DD HH:mm:ss') },
        callback: data => {
          this.setChartData(data);
          this.runLiveData();
        },
      });
    }, 1000);
  };

  getList = () => Array.from({ length: 50 }, (_, index) => ({
    label: `曲线${index}`,
    value: (100 * Math.random()).toFixed(2),
    unit: 'V',
    color: '#f00'
  }))

  renderSelect = () => {
    const list = this.getList();
    return (
      <div>
        <Checkbox>
          全选
        </Checkbox>
        {/* <CheckboxGroup options={list} /> */}
        {list.map((item) => (
          <div key={item.label} style={{ paddingTop: 10 }}>
            <Checkbox>
              <span
                style={{
                  background: item.color,
                  display: 'inline-block',
                  width: 15,
                  height: 15
                }}
              > </span>
              {item.label}
            </Checkbox>
          </div>
        ))}
      </div>
    )
  }

  renderLineInfo = () => {
    const list = this.getList()
    return list.map((item) => (
      <div className={styles.detailDataChild} key={item.label}>
        <h3 className={styles.detailDataChildTitle}>{item.label}</h3>
        <div className={styles.detailDataChildContent}>
          <p className={styles.detailDataChildContentValue}>{item.value}</p>
          <span className={styles.detailDataChildContentUnit}>{item.unit}</span>
        </div>
      </div>
    ))
  }

  render () {
    const {
      // statisticsList,
      // timeDiff,
      axisModalVisible,
      timeAxisModalVisible,
      alarmSettingVisible
    } = this.state;
    const {
      experimentHistory: { yAxisSetting, data, setting },
      match: {
        params: { link = '1', id = '' },
      },
    } = this.props;
    // const info = this.getInfo(setting);
    // const settingFilter = this.getSettingList(setting);
    return (
      <div>
        <div>
          <div span={18} className={styles.detailChart}>
            <LineChart
              ref={e => {
                this.lineChart = e;
              }}
              height={508}
              data={data}
              yAxis={yAxisSetting}
              filterData={this.filterData}
              onShowYAxis={this.showAxisModal}
              onShowXAxis={this.showTimeAxisModal}
            />
          </div>
          <div className={styles.detailSelect}>
            {this.renderSelect()}
            {/* <Card bodyStyle={{ padding: 0 }}> */}
            {/* <StatisticsList
              link={link}
              data={statisticsList}
              diff={timeDiff}
              onSelectChange={this.onSelectChange}
            /> */}
            {/* </Card> */}
          </div>
          <div className={styles.detailData}>
            {this.renderLineInfo()}
          </div>
          <div className={styles.detailInfo}>
            设备信息
          </div>
        </div>
        <AxisModal visible={axisModalVisible} editId={id} onCancel={this.onCancelAxisModal} />
        <TimeAxisModal visible={timeAxisModalVisible} onCancel={this.onCancelTimeAxisModal} />
        <AlarmSettingModal
          visible={alarmSettingVisible}
          onCancel={this.onCancelAlarmSettingModal}
        />
      </div>
    );
  }
}
export default History;
