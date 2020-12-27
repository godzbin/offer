import React, { Component } from 'react';

import ReactEcharts from 'echarts-for-react'
import defaultOptions from './echartConfig'
import { hexToRgba } from '@/utils/utils';

class LineChart2 extends Component {
  constructor(props) {
    super(props);
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
    const yConfigsFilter = yConfigs.filter((item) => item.showAxis)
    options.tooltip = {
      trigger: 'axis',
      showContent: isShowTooltip,
    };
    if (yConfigs.length) {
      options.yAxis = yConfigs.map((item, index) => ({
        show: item.showAxis,
        name: item.showName ? item.name : '',
        min: item.min,
        max: item.max,
        axisLine: {
          lineStyle: {
            color: item.color,
          }
        },
        axisTick: {
          lineStyle: {
            color: item.color
          }
        },
        axisLabel: {
          color: item.color,
          padding: [10, 0, 0, 0]
        },
        nameLocation: 'middle',
        nameTextStyle: {
          color: item.color,
          // align: 'left'
          verticalAlign: 'bottom',
          padding: [0, 0, 20, 0]
        },
        splitLine: {
          show: !index,
          lineStyle: {
            type: 'dashed',
            color: '#44484d'
          }
        },
        offset: yConfigsFilter.findIndex((f) => f.key === item.key) * this.yWidth + this.dataZoomWidth,
        position: 'left'
      }))
      options.grid = [{
        ...options.grid[0],
        left: yConfigsFilter.length * this.yWidth
      }]
      const { dataZoom = [] } = options
      options.dataZoom = yConfigs.reduce((result, item, index) => {
        const itemZoom = result.find((zoom) => item.name === zoom.id)
        if (itemZoom) {
          itemZoom.backgroundColor = item.color
        } else {
          result.push({
            id: `${item.name}`,
            yAxisIndex: index,
            type: 'inside',
            filterMode: 'none',
          }, {
            show: item.showAxis,
            width: this.dataZoomWidth,
            id: `yAxis-${item.name}`,
            yAxisIndex: index,
            left: this.yWidth * (yConfigsFilter.length - yConfigsFilter.findIndex((f) => f.key === item.key)) - this.dataZoomWidth,
            fillerColor: hexToRgba(item.color, 0.2),
            // show: true,
            filterMode: 'none',
            height: '93%',
            showDataShadow: false,
          })
        }
        return result
      }, [dataZoom[0], dataZoom[1]])
    } else {
      options.yAxis = defaultOptions.yAxis
      options.grid = [{
        ...options.grid[0],
        left: 0
      }]
      options.dataZoom = defaultOptions.dataZoom
    }
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