import React, { Component } from 'react';

import ReactEcharts from 'echarts-for-react'
import echartConfig from './echartConfig'

class LineChart2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowTooltip: true,
    };
    this.echartsInstance = '';
    this.yWidth = 65;
    this.dataZoomWidth = 15;
  }

  getOption = () => {
    return echartConfig
  }

  render () {
    // const { height } = this.props;
    return (
      <div style={{ height: `100%`, width: '100%' }}>
        <ReactEcharts
          ref={e => {
            this.echartsInstance = e;
          }}
          style={{ height: `100%`, width: '100%' }}
          option={this.getOption()}
        />
      </div>
    );
  }
}

export default LineChart2