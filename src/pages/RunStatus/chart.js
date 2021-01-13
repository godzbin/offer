import React, { } from 'react';
import ReactEcharts from 'echarts-for-react';
import defaultOptions from './echartConfig'

class Chart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.echartsInstance = '';
    // this.yWidth = 65;
    // this.dataZoomWidth = 10;
  }

  getChart () {
    return this.echartsInstance ? this.echartsInstance.getEchartsInstance() : false;
  }

  getOption = (data) => {
    const chart = this.getChart()
    const options = chart ? chart.getOption() : defaultOptions;
    options.series = [
      {
        name: 'CPU',
        type: 'line',
        smooth: true,
        data: data.map((item) => ({
          name: item.time,
          value: [item.time, item.CPU]
        }))
      }, {
        name: '内存',
        type: 'line',
        smooth: true,
        data: data.map((item) => ({
          name: item.time,
          value: [item.time, item.memory]
        }))
      }
    ]
    return options
  }

  render () {
    const { data } = this.props
    return (
      <div style={{ height: 600, width: '100%' }}>
        <ReactEcharts
          ref={e => {
            this.echartsInstance = e;
          }}
          theme="dark"
          style={{ height: `100%`, width: '100%' }}
          option={this.getOption(data)}
        />
      </div>
    )
  }
}

export default Chart;