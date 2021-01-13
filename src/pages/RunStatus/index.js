import Chart from './chart'
import ListCard from '@/components/ListCard';
import React from 'react';
import { WaterWave } from '@/components/Charts';
import styles from './index.less'

class RunStatus extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.intervalIndex = ''
  }

  componentDidMount () {
    // setTimeout(() => {
    //   this.getData()
    // }, 1000)
    this.intervalIndex = setInterval(() => {
      this.getData()
    }, 5000)
  }

  componentWillUnmount () {
    clearInterval(this.intervalIndex)
  }

  getData () {
    const { data } = this.state
    const date = new Date()
    const newData = [...data]
    newData.push({
      time: date,
      CPU: (Math.random() * 100).toFixed(2),
      memory: (Math.random() * 100).toFixed(2),
      hardDisk: (Math.random() * 100).toFixed(2)
    })
    if (newData.length > 10) newData.shift()
    this.setState({
      data: newData
    })
    // this.forceUpdate()
  }

  render () {
    const { data } = this.state
    const now = data[data.length - 1] || {
      CPU: 0,
      memory: 0,
      hardDisk: 0
    }
    console.log(now)
    return (
      <div className="pageContent">
        <div className="pageHeader">运行状态</div>
        <div style={{ backgroundColor: '#fff' }}>
          <ListCard title={(<p style={{ height: 30 }} />)} />
          <div style={{ marginTop: '-30px' }}>
            <Chart data={data} />
          </div>
        </div>
        <div className={styles.statusList}>
          <div>
            <p>设备运行状态</p>
            <WaterWave
              color="#67b4d8"
              height={180}
              title='空闲CPU'
              percent={now.CPU || 0}
            />
          </div>
          <div>
            <p>设备运行状态</p>
            <WaterWave
              color="#f2a368"
              height={180}
              title='空闲内存'
              percent={now.memory || 0}
            />
          </div>
          <div>
            <p>设备运行状态</p>
            <WaterWave
              color="#67b4d8"
              height={180}
              title='空闲磁盘'
              percent={now.hardDisk || 0}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default RunStatus