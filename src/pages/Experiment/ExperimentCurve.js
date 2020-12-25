import React, { PureComponent } from 'react';

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
      checkedList: []
    };
    this.lineChart = ''
    this.intervalIndex = ''
  }

  async componentDidMount () {
    const {
      dispatch
    } = this.props
    await dispatch({
      type: 'ExperimentCurve/getKeyList'
    })
    this.selectAllKey()
    dispatch({
      type: 'ExperimentCurve/getEquipmentInfo'
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
    }, 60000)
  }

  // 获取实时数据
  setChartData = async () => {
    const {
      dispatch,
      ExperimentCurve: { dataList, yConfigs }
    } = this.props
    await dispatch({
      type: 'ExperimentCurve/getData'
    })
    const chart = this.lineChart.getChart()
    if (chart) {
      const option = chart.getOption()
      option.series = yConfigs.reduce((result, item, index) => {
        item.bindKey.forEach((bItem) => {
          const data = dataList.find((dItem) => dItem.key === bItem)
          result.push({
            id: `${index}-${data.key}`,
            yAxisIndex: index,
            type: 'line',
            name: data.key,
            smooth: true,
            data: data.value.map((cItem) => ({
              name: cItem.time,
              value: [cItem.time, cItem.value]
            }))
          })
        })
        return result;
      }, [])
      // option.series = dataList.map((item) => ({
      //   type: 'line',
      //   name: item.key,
      //   smooth: true,
      //   data: item.value.map((cItem) => ({
      //     name: cItem.time,
      //     value: [cItem.time, cItem.value]
      //   }))
      // }))
      chart.setOption(option)
      this.setChartInfoList()
    }
  }

  // 设置实时数据图表数据
  setChartInfoList () {
    const {
      ExperimentCurve: { dataList = [], keyList = [], yConfigs }
    } = this.props
    const chart = this.lineChart.getChart()
    if (chart) {
      this.setState({
        chartInfoList: yConfigs.reduce((result, item) => {
          item.bindKey.forEach((bItem) => {
            const keyObj = keyList.find((kItem) => kItem.key === bItem)
            const data = dataList.find((dItem) => dItem.key === bItem) || {}
            const color = chart.getModel().getSeriesByName(bItem)[0].getData().getVisual('color')
            result.push({
              ...keyObj,
              color,
              value: data.value ? data.value[data.value.length - 1].value.toFixed(2) : 0
            })
          })
          return result
        }, [])
      })
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
      <div>
        <Checkbox checked={checkedList.length === chartInfoList.length} onClick={() => this.checkedAll()}>
          全选
        </Checkbox>
        {/* <CheckboxGroup options={list} /> */}
        {list.map((item) => (
          <div key={item.key} style={{ paddingTop: 10 }}>
            <Checkbox checked={checkedList.includes(item.key)} onClick={() => this.checkedKey(item.key)}>
              <span
                style={{
                  background: this.getColorByKey(item.key) || '#ddd',
                  display: 'inline-block',
                  width: 15,
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
    <div className={styles.detailDataChild} key={item.name}>
      <p className={styles.detailDataChildTitle}>
        <span
          style={{
            backgroundColor: this.getColorByKey(item.key),
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: '100%',
            marginRight: 5
          }}
        />
        {item.name}
      </p>
      <div className={styles.detailDataChildContent}>
        <p className={styles.detailDataChildContentValue}>
          {item.value || '0'}
          <span className={styles.detailDataChildContentUnit}>{item.unit}</span>
        </p>
      </div>
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

  render () {
    const {
      ExperimentCurve: { keyList = [], equipmentInfo = [], yConfigs = [] }
    } = this.props
    const { chartInfoList } = this.state
    return (
      <div>
        <div className={styles.title}>
          实时趋势
        </div>
        <div className={styles.content}>
          <div className={styles.detailChart}>
            <LineChart ref={e => { this.lineChart = e }} onchange={() => this.onChartChange()} yConfigs={yConfigs} />
          </div>
          <div className={styles.detailSelect}>
            {this.renderSelect(keyList)}
          </div>
        </div>
        <div className={styles.detailFooter}>
          <div className={styles.detailData}>
            {this.renderLineInfo(chartInfoList)}
          </div>
          <div className={styles.detailInfo}>
            {this.renderInfoPlane(equipmentInfo)}
          </div>
        </div>
      </div>
    )
  }
}
export default Curve