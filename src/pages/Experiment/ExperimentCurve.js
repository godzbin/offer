import React, { PureComponent } from 'react';

import { Checkbox } from 'antd';
import LineChart from './components/LineChart2'
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
      chartInfoList: []
    };
    this.lineChart = ''
    this.intervalIndex = ''
  }

  async componentDidMount () {
    const {
      dispatch,
      ExperimentCurve: { dataList }
    } = this.props
    dispatch({
      type: 'ExperimentCurve/getKeyList'
    })
    dispatch({
      type: 'ExperimentCurve/getEquipmentInfo'
    })
    clearInterval(this.intervalIndex)
    this.intervalIndex = setInterval(async () => {
      try {
        await dispatch({
          type: 'ExperimentCurve/getData'
        })
        const chart = this.lineChart.getChart()
        if (chart) {
          const option = chart.getOption()
          option.series = dataList.map((item) => ({
            type: 'line',
            name: item.key,
            smooth: true,
            data: item.value.map((cItem) => ({
              name: cItem.time,
              value: [cItem.time, cItem.value]
            }))
          }))
          chart.setOption(option)
          this.setChartInfoList()
        }
      } catch (e) {
        console.log(e.message)
      }
    }, 2000)
  }

  componentWillUnmount () {
    clearInterval(this.intervalIndex)
  }

  setChartInfoList () {
    const {
      ExperimentCurve: { dataList = [], keyList = [] }
    } = this.props
    const chart = this.lineChart.getChart()
    if (chart) {
      this.setState({
        chartInfoList: keyList.map((item, index) => {
          const color = chart.getModel().getSeriesByIndex(index).getData().getVisual('color')
          const data = dataList.find((dItem) => dItem.key === item.key) || {}
          return {
            ...item,
            color,
            value: data.value ? data.value[data.value.length - 1].value.toFixed(2) : 0
          }
        })
      })
    }
  }

  // 渲染选择列表 
  renderSelect = (list) => (
    <div>
      <Checkbox>
        全选
      </Checkbox>
      {/* <CheckboxGroup options={list} /> */}
      {list.map((item) => (
        <div key={item.key} style={{ paddingTop: 10 }}>
          <Checkbox>
            <span
              style={{
                background: this.getColor(item.key) || '#ddd',
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


  // 
  changeInfoType = (type) => {
    this.setState({
      infoType: type
    })
  }

  getColor = (key) => {
    const { chartInfoList } = this.state
    const data = chartInfoList.find((item) => item.key === key) || {}
    return data.color
  }

  // 渲染曲线实时数据
  renderLineInfo = (list) => list.map((item) => (
    <div className={styles.detailDataChild} key={item.name}>
      <p className={styles.detailDataChildTitle}>
        <span
          style={{
            backgroundColor: item.color,
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
        <p className={styles.detailDataChildContentValue}>{item.value || '0'} <span className={styles.detailDataChildContentUnit}>{item.unit}</span></p>
      </div>
    </div>
  ))

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