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

  async componentDidMount () {
    const {
      dispatch
    } = this.props
    console.log(1)
    dispatch({
      type: 'ExperimentCurve/getList'
    })
  }

  // 选择列表 
  renderSelect = (list) => {
    // const list = this.getList();
    return (
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
              > </span>
              {item.name}
            </Checkbox>
          </div>
        ))}
      </div>
    )
  }

  // 
  renderLineInfo = (list) => {
    // const list = this.getList()
    return list.map((item) => (
      <div className={styles.detailDataChild} key={item.name}>
        <p className={styles.detailDataChildTitle}>{item.name}</p>
        <div className={styles.detailDataChildContent}>
          <p className={styles.detailDataChildContentValue}>{item.value || '0'} <span className={styles.detailDataChildContentUnit}>{item.unit}</span></p>
        </div>
      </div>
    ))
  }

  render () {
    const {
      ExperimentCurve: { list }
    } = this.props
    return (
      <div>
        <div className={styles.title}>
          实时趋势
        </div>
        <div className={styles.content}>
          <div className={styles.detailChart}>
            <LineChart />
          </div>
          <div className={styles.detailSelect}>
            {this.renderSelect(list)}
          </div>
        </div>
        <div className={styles.detailFooter}>
          <div className={styles.detailData}>
            {this.renderLineInfo(list)}
          </div>
          <div className={styles.detailInfo}></div>
        </div>
      </div >
    )
  }
}
export default Curve