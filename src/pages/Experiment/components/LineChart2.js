import React, { Component } from 'react';

import ReactEcharts from 'echarts-for-react'
import defaultOptions from './echartConfig'
import { hexToRgba } from '@/utils/utils';

class LineChart2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowTooltip: true,
    };
    this.echartsInstance = '';
    this.yWidth = 65;
    this.dataZoomWidth = 10;
  }

  getChart () {
    return this.echartsInstance ? this.echartsInstance.getEchartsInstance() : false;
  }

  getOption = () => {
    const chart = this.getChart()
    const options = chart ? chart.getOption() : defaultOptions;
    const { yConfigs, isShowTooltip } = this.props;
    options.tooltip = {
      trigger: 'axis',
      showContent: isShowTooltip,
    };
    options.yAxis = yConfigs.map((item, index) => ({
      name: item.name,
      min: item.min,
      max: item.max,
      axisLine: {
        lineStyle: {
          color: item.color,
        },
      },
      axisLabel: {
        color: item.color,
        padding: [10, 0, 0, 0]
      },
      nameLocation: 'start',
      nameTextStyle: {
        color: item.color,
        align: 'right'
      },
      splitLine: {
        show: !index,
        lineStyle: {
          type: 'dashed',
          color: '#44484d'
        }
      },
      offset: index * this.yWidth + this.dataZoomWidth,
      position: 'left'
    }))
    options.grid = [{
      ...options.grid[0],
      left: yConfigs.length * this.yWidth
    }]
    const { dataZoom = [] } = options
    options.dataZoom = yConfigs.reduce((result, item, index) => {
      const itemZoom = result.find((zoom) => item.name === zoom.id)
      if (itemZoom) {
        itemZoom.backgroundColor = item.color
      } else {
        result.push({
          id: item.name,
          yAxisIndex: index,
          type: 'inside',
          filterMode: 'none',
        }, {
          width: this.dataZoomWidth,
          id: `yAxis${item.name}`,
          yAxisIndex: index,
          left: this.yWidth * (yConfigs.length - index) - this.dataZoomWidth,
          fillerColor: hexToRgba(item.color, 0.2),
          show: true,
          filterMode: 'none',
          height: '93%',
          showDataShadow: false,
        })
      }
      return result
    }, dataZoom)
    return options
  }

  render () {
    // const { height } = this.props;
    return (
      <div style={{ height: `100%`, width: '100%' }}>
        <ReactEcharts
          ref={e => {
            this.echartsInstance = e;
          }}
          theme="dark"
          style={{ height: `100%`, width: '100%' }}
          option={this.getOption()}
        />
      </div>
    );
  }
}

export default LineChart2