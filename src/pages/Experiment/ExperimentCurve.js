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
    };
    this.lineChart = ''
  }

  async componentDidMount () {
    const {
      dispatch
    } = this.props
    dispatch({
      type: 'ExperimentCurve/getList'
    })
    dispatch({
      type: 'ExperimentCurve/getEquipmentInfo'
    })
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
                background: item.color || '#ff0',
                display: 'inline-block',
                width: 15,
                height: 15
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

  // 渲染曲线实时数据
  renderLineInfo = (list) => list.map((item) => (
    <div className={styles.detailDataChild} key={item.name}>
      <p className={styles.detailDataChildTitle}>{item.name}</p>
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
      <div>{`${cItem.name}：${cItem.desc}`}</div>
    ))
  )

  // 渲染信息切换框
  renderInfoPlane = (equipmentInfo) => {
    const { infoType } = this.state
    return (
      <div>
        <div className={styles.infoSelect}>
          {equipmentInfo.map((item, index) => (
            <div className={infoType === index ? styles.active : ''} onClick={() => this.changeInfoType(index)}>{item.name}</div>
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
      ExperimentCurve: { list = [], equipmentInfo = [] }
    } = this.props
    return (
      <div>
        <div className={styles.title}>
          实时趋势
        </div>
        <div className={styles.content}>
          <div className={styles.detailChart}>
            <LineChart ref={e => { this.lineChart = e }} onchange={() => this.onChartChange()} />
          </div>
          <div className={styles.detailSelect}>
            {this.renderSelect(list)}
          </div>
        </div>
        <div className={styles.detailFooter}>
          <div className={styles.detailData}>
            {this.renderLineInfo(list)}
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