import React, { PureComponent } from 'react';

import AxisModal from './components/AxisModal2'
import { Checkbox } from 'antd';
import LineChart from './components/LineChart2';
import { connect } from 'dva';
import styles from './History.less';

@connect(({ ExperimentCurve, loading }) => ({
  ExperimentCurve,
  loading: loading.models.ExperimentCurve,
}))
class Curve extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      infoType: 0,
      chartInfoList: [],
      checkedList: [],
      axisModalVisible: false,
      dataZoomSelect: false, // 刷选状态
      isShowTooltip: true,
      isShowSelect: true
    };
    this.lineChart = ''
    this.intervalIndex = ''
    this.intervalTime = 5000
  }

  async componentDidMount () {
    const {
      dispatch
    } = this.props
    await dispatch({
      type: 'ExperimentCurve/getKeyList'
    })
    this.selectAllKey()
    await dispatch({
      type: 'ExperimentCurve/getEquipmentInfo'
    })
    await dispatch({
      type: 'ExperimentCurve/getYSettings'
    })
    this.setChartData()
    this.setChartDataInterval()
  }

  componentWillUnmount () {
    clearInterval(this.intervalIndex)
  }

  // 循环获取实时数据 
  setChartDataInterval = () => {
    clearInterval(this.intervalIndex)
    this.intervalIndex = setInterval(async () => {
      try {
        await this.setChartData()
      } catch (e) {
        console.log(e.message)
      }
    }, this.intervalTime)
  }

  // 获取实时数据
  setChartData = async () => {
    const {
      dispatch
    } = this.props
    await dispatch({
      type: 'ExperimentCurve/getData'
    })
    this.renderChart()
  }

  // 设置实时数据图表数据
  setChartInfoList () {
    const {
      ExperimentCurve: { dataList = [], keyList = [] }
    } = this.props
    const chart = this.lineChart.getChart()
    if (chart) {
      this.setState({
        // chartInfoList: yConfigs.reduce((result, { bindKey = [] }) => {
        //   bindKey.forEach((bItem) => {
        //     const keyObj = keyList.find((kItem) => kItem.key === bItem)
        //     const data = dataList.find((dItem) => dItem.key === bItem) || {}
        //     const series = chart.getModel().getSeriesByName(bItem)
        //     const color = series.length ? series[0].getData().getVisual('color') : '#999'
        //     result.push({
        //       ...keyObj,
        //       color,
        //       value: data.value ? data.value[data.value.length - 1].value.toFixed(2) : 0
        //     })
        //   })
        //   return result
        // }, [])
        chartInfoList: dataList.map((item) => {
          const series = chart.getModel().getSeriesByName(item.key)
          const color = series.length ? series[0].getData().getVisual('color') : '#999'
          const data = keyList.find((dItem) => dItem.key === item.key) || {}
          return {
            ...item,
            value: item.value[0].value,
            color,
            unit: data.unit
          }
        })
      })
    }
  }

  renderChart = (isRestore = false) => {
    const {
      ExperimentCurve: { dataList, yConfigs }
    } = this.props
    const chart = this.lineChart.getChart()
    if (chart) {
      const option = chart.getOption()
      // const yConfigsFilter = yConfigs.filter((item) => item.showAxis)
      option.series = yConfigs.reduce((result, { bindKey = [] }, index) => {
        bindKey.forEach((bItem) => {
          const { key = '', value = [] } = dataList.find((dItem) => dItem.key === bItem) || {}
          if (key) {
            result.push({
              id: `${index}-${key}`,
              yAxisIndex: index,
              type: 'line',
              name: key,
              smooth: true,
              data: value.map((cItem) => ({
                name: cItem.time,
                value: [cItem.time, cItem.value]
              }))
            })
          }
        })
        return result;
      }, [])
      chart.setOption(option, isRestore)
      this.setChartInfoList()
    }
  }


  // 
  selectAllKey = () => {
    const {
      ExperimentCurve: { keyList }
    } = this.props

    this.setState({
      checkedList: keyList.map((item) => item.key)
    })
  }

  // 切换 设备信息、项目信息
  changeInfoType = (type) => {
    this.setState({
      infoType: type
    })
  }

  checkedKey = (key) => {
    const { checkedList } = this.state
    const index = checkedList.findIndex((item) => item === key)
    if (index > -1) {
      checkedList.splice(index, 1)
    } else {
      checkedList.push(key)
    }
    this.setState({
      checkedList
    })
    this.forceUpdate()
    this.changeChartSelected(key)
  }

  checkedAll = () => {
    let result = []
    const { checkedList = [], chartInfoList } = this.state
    if (checkedList.length !== chartInfoList.length) {
      result = chartInfoList.map(item => item.key)
    }
    this.setState({
      checkedList: result
    })
    this.changeChartSelectedAll(!!result.length)
    this.forceUpdate()
  }

  changeChartSelected = (key) => {
    const chart = this.lineChart.getChart()
    chart.dispatchAction({
      type: 'legendToggleSelect',
      name: key
    })
  }

  changeChartSelectedAll = (isSelectAll) => {
    const chart = this.lineChart.getChart()
    chart.dispatchAction({
      type: 'legendAllSelect'
    })
    if (!isSelectAll) {
      chart.dispatchAction({
        type: 'legendInverseSelect'
      })
    }
  }

  // 渲染选择列表 
  renderSelect = (list) => {
    const { checkedList = [], chartInfoList } = this.state
    return (
      <div className={styles.detailSelect}>
        <div className={styles.selectAll}>
          <Checkbox checked={checkedList.length === chartInfoList.length} onClick={() => this.checkedAll()}>
            全选
          </Checkbox>
        </div>
        <div className={styles.selectContent}>
          {list.map((item) => (
            <div key={item.key} style={{ paddingBottom: 10 }}>
              <Checkbox
                checked={checkedList.includes(item.key)}
                onClick={() => this.checkedKey(item.key)}
                style={{
                  fontSize: 18,
                  color: checkedList.includes(item.key) ? '#fff' : '#999'
                }}
              >
                <span
                  style={{
                    background: this.getColorByKey(item.key) || '#ddd',
                    display: 'inline-block',
                    width: 10,
                    height: 10,
                    marginTop: 5,
                    marginRight: 5
                  }}
                />
                {item.name}
              </Checkbox>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 获取key颜色
  getColorByKey = (key) => {
    const { chartInfoList, checkedList } = this.state
    const data = chartInfoList.find((item) => item.key === key) || {}
    if (checkedList.includes(key)) {
      return data.color
    }
    return '#ccc'
  }

  // 渲染曲线实时数据
  renderLineInfo = (list) => list.map((item) => (
    <div className={styles.detailDataChild} key={item.key}>
      <p className={styles.detailDataChildTitle}>
        <span
          style={{
            border: `4px solid ${this.getColorByKey(item.key)}`,
            display: 'inline-block',
            width: 15,
            height: 15,
            borderRadius: '100%',
            marginRight: 5
          }}
        />
        {item.key}
      </p>
      <div className={styles.detailDataChildContent}>
        <p className={styles.detailDataChildContentValue} style={{ color: this.getColorByKey(item.key) }}>
          {item.value.toFixed(2) || '0'}
        </p>
      </div>
      <span className={styles.detailDataChildContentUnit}>{item.unit}</span>
    </div>
  ))

  // 当图表改变时
  onChartChange = () => {
  }

  // 渲染信息切换框中数据
  renderInfo = ({ info = [] }) => (
    info.map((cItem) => (
      <div key={cItem.name}>{`${cItem.name}：${cItem.desc}`}</div>
    ))
  )

  // 渲染信息切换框
  renderInfoPlane = (equipmentInfo) => {
    const { infoType } = this.state
    return (
      <div>
        <div className={styles.infoSelect}>
          {equipmentInfo.map((item, index) => (
            <div className={infoType === index ? styles.active : ''} onClick={() => this.changeInfoType(index)} key={item.name}>{item.name}</div>
          ))}
        </div>
        <div className={styles.detailInfoContent}>
          {this.renderInfo(equipmentInfo[infoType] || {})}
        </div>
      </div>
    )
  }

  toggleDataZoomSelect = () => {
    const { dataZoomSelect } = this.state
    const chart = this.lineChart.getChart()
    // 开启框选缩放事件
    this.setState({
      dataZoomSelect: !dataZoomSelect
    })
    chart.dispatchAction({
      type: 'takeGlobalCursor',
      key: 'dataZoomSelect',
      // 启动或关闭
      dataZoomSelectActive: !dataZoomSelect,
    });
  }

  onCancelAxisModal = () => {
    this.setState({
      axisModalVisible: false
    })
  }

  showAxisModal = () => {
    this.setState({
      axisModalVisible: true
    })
  }

  toggleTooltip = () => {
    const { isShowTooltip } = this.state
    this.setState({
      isShowTooltip: !isShowTooltip
    })
  }

  restore = () => {
    const chart = this.lineChart.getChart()
    chart.dispatchAction({
      type: 'restore'
    })
  }

  onConfigChange = async (yConfig) => {
    const { dispatch } = this.props
    if (yConfig.key) {
      await dispatch({
        type: 'ExperimentCurve/changeYConfig',
        payload: yConfig
      })
    } else {
      await dispatch({
        type: 'ExperimentCurve/addYConfig',
        payload: yConfig
      })
    }
    await dispatch({
      type: 'ExperimentCurve/getYSettings'
    })
    this.restoreChart()
  }

  restoreChart = () => {
    // setTimeout(() => {
    //   this.lineChart.getChart().setOption(this.lineChart.getOption(), true)
    // }, 2000)
  }

  async removeAxis (yConfig) {
    const { dispatch } = this.props
    await dispatch({
      type: 'ExperimentCurve/removeYSetting',
      payload: yConfig
    })
    await dispatch({
      type: 'ExperimentCurve/getYSettings'
    })
  }

  render () {
    const {
      ExperimentCurve: { keyList = [], equipmentInfo = [], yConfigs = [] }
    } = this.props
    const { chartInfoList, axisModalVisible, dataZoomSelect, isShowTooltip, isShowSelect } = this.state
    return (
      <div>
        <div className="pageContent">
          <div className='pageHeader'>
            实时趋势
          </div>
          <div
            className={styles.detailChart}
            style={
              { marginRight: isShowSelect ? 195 : 20 }
            }
          >
            <div className={styles.tools}>
              <div className={dataZoomSelect ? styles.toolsActive : ''} onClick={() => this.toggleDataZoomSelect()}>
                <img src={require('@/assets/toolsIcon/icon_toolbar_enlarge.png')} alt="" title="放大" />
              </div>
              <div onClick={() => this.restore()}>
                <img src={require('@/assets/toolsIcon/icon_toolbar_reduction.png')} alt="" title="撤回" />
              </div>
              <div onClick={() => this.showAxisModal()}>
                <img src={require('@/assets/toolsIcon/icon_toolbar_setting.png')} alt="" title="配置" />
              </div>
              <div className={isShowTooltip ? styles.toolsActive : ''} onClick={() => this.toggleTooltip()}>
                <img src={require('@/assets/toolsIcon/icon_toolbar_tips.png')} alt="" title="提示" />
              </div>
            </div>
            <LineChart ref={e => { this.lineChart = e }} onchange={() => this.onChartChange()} yConfigs={yConfigs} isShowTooltip={isShowTooltip} />
          </div>
          <div
            className={styles.showSelect}
            style={
              {
                right: isShowSelect ? 190 : 20,
                textIndent: isShowSelect ? 3 : -8
              }
            }
            onClick={() => {
              this.setState({
                isShowSelect: !isShowSelect
              })
            }}
          >
            {isShowSelect ? '》' : '《'}
          </div>
          {isShowSelect && this.renderSelect(keyList)}
        </div>
        <div className={styles.detailFooter}>
          <div className={styles.detailData}>
            <img className={styles.detailDataMore} src={require('@/assets/toolsIcon/icon_enlarge.png')} title="更多" alt="" />
            {this.renderLineInfo(chartInfoList)}
          </div>
          <div className={styles.detailInfo}>
            {this.renderInfoPlane(equipmentInfo)}
          </div>
        </div>
        <AxisModal
          visible={axisModalVisible}
          removeAxis={(yConfig) => this.removeAxis(yConfig)}
          onCancel={this.onCancelAxisModal}
          yConfigs={yConfigs}
          keyList={keyList}
          onChange={(params) => this.onConfigChange(params)}
        />
      </div >
    )
  }
}
export default Curve