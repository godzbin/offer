import React, { Component } from 'react';

import ReactEcharts from 'echarts-for-react';
// import { Chart } from 'bizcharts';
import { hexToRgba } from '@/utils/utils';
import icon from './icon';

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowTooltip: true,
    };
    this.echartsInstance = '';
    this.yWidth = 65;
    this.dataZoomWidth = 15;
  }

  componentDidMount() {
    const chart = this.getChart();
    console.log(chart);
    if (!chart || chart) {
      return;
    }
    // 开启框选缩放事件
    chart.dispatchAction({
      type: 'takeGlobalCursor',
      key: 'dataZoomSelect',
      // 启动或关闭
      dataZoomSelectActive: true,
    });
    // 防抖
    function debounce(fn, wait) {
      let timer = null;
      return () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        timer = setTimeout(() => {
          fn();
        }, wait);
      };
    }
    chart.on('datazoom', param => {
      debounce(() => this.onChange(param), 150)();
    });
    chart.dispatchAction({
      type: 'dataZoom',
      // 可选，dataZoom 组件的 index，多个 dataZoom 组件时有用，默认为 0
      dataZoomIndex: 0,
      // 开始位置的百分比，0 - 100
      start: 95,
      // 结束位置的百分比，0 - 100
      end: 100,
    });
    chart.on('legendselectchanged', () => {
      this.onChange();
    });
  }

  // 每次更新数据时，刷新echart
  shouldComponentUpdate() {
    setTimeout(() => {
      this.resetChartOption();
    }, 100);
    return false;
  }

  getChart() {
    console.log(this.echartsInstance);
    return this.echartsInstance ? this.echartsInstance.getEchartsInstance() : false;
  }

  // 获取数据筛选轴的位置
  getDataZoom(options, item, length, index) {
    return [
      {
        ...options.dataZoom.find(y => y.id === `yAxis${item.id}`),
        width: this.dataZoomWidth,
        id: `yAxis${item.id}`,
        yAxisIndex: index,
        left: this.yWidth * (length - index) - this.dataZoomWidth,
        fillerColor: hexToRgba(item.color, 0.2),
        show: true,
        filterMode: 'none',
        height: '72%',
        showDataShadow: false,
      },
      {
        ...options.dataZoom.find(y => y.id === `yAxis${item.id}`),
        id: `inside_yAxis${item.id}`,
        yAxisIndex: index,
        type: 'inside',
        filterMode: 'none',
      },
    ];
  }

  /**
   * @param {} param
   */
  onChange = () => {
    const chart = this.getChart();
    if (!chart) return;
    const { dataZoom } = chart.getOption();
    const currDatazoom = dataZoom.reduce((result, item) => {
      if (item.type !== 'inside') {
        const id = item.id.replace(/[^\d]/g, '');
        const type = item.id.indexOf('xAxis') > -1 ? 'x' : 'y';
        result.push({
          id,
          type,
          start: item.start,
          end: item.end,
          startValue: item.startValue,
          endValue: item.endValue,
        });
      }
      return result;
    }, []);
    const { filterData } = this.props;
    if (filterData) filterData(currDatazoom);
  };

  getShowYAxis = () => {
    const { yAxis = [] } = this.props;
    return yAxis.filter(item => item.showAxis);
  };

  setShowTooltip = () => {
    const { isShowTooltip } = this.state;
    this.setState({
      isShowTooltip: !isShowTooltip,
    });
    this.setTooltipOption();
  };

  setTooltipOption = () => {
    const { isShowTooltip } = this.state;
    const chart = this.getChart();
    const toolbox = this.getToolbox();
    chart.setOption({
      toolbox,
      tooltip: {
        trigger: 'axis',
        showContent: isShowTooltip,
      },
    });
  };

  getToolbox() {
    const {
      onShowYAxis,
      // onShowXAxis
    } = this.props;
    const { isShowTooltip } = this.state;

    return {
      show: true,
      feature: {
        dataZoom: {
          show: true,
        },
        myTool1: {
          show: true,
          title: '数值轴设置',
          icon: icon.myTool1,
          onclick: () => {
            if (onShowYAxis) onShowYAxis();
          },
        },
        // myTool2: {
        //   show: true,
        //   title: '时间轴设置',
        //   icon: icon.myTool2,
        //   onclick: () => {
        //     if (onShowXAxis) onShowXAxis();
        //   },
        // },
        myTool3: {
          show: true,
          title: '显示提示',
          iconStyle: {
            borderColor: isShowTooltip ? '#3f97c5' : '#666',
          },
          icon: icon.myTool3,
          onclick: () => {
            this.setShowTooltip();
          },
        },
      },
    };
  }

  getOption() {
    // const { data } = this.props;
    const { isShowTooltip } = this.state;
    const yAxis = this.getShowYAxis();
    return {
      tooltip: {
        trigger: 'axis',
        showContent: isShowTooltip,
      },
      toolbox: this.getToolbox(),
      calculable: true,
      legend: {
        type: 'scroll',
        width: '70%',
      },
      xAxis: [
        {
          type: 'time',
        },
      ],
      grid: {
        left: yAxis.length * this.yWidth,
        right: 30,
        bottom: 80,
      },
      yAxis: [
        {
          name: '',
          axisLine: {},
          position: 'left',
        },
      ],
      dataZoom: [
        {
          show: true,
          id: `xAxis0`,
          filterMode: 'none',
          xAxisIndex: 0,
        },
        {
          type: 'inside',
          id: 'inside_yAxis0',
          filterMode: 'none',
          xAxisIndex: 0,
        },
      ],
      series: [],
    };
  }

  resetChartOption() {
    const chart = this.getChart();
    if (chart) {
      const yAxis = this.getShowYAxis();
      const yAxisLength = yAxis.length;
      const options = chart.getOption();
      const [xZoom = {}, xInZoom = {}] = options.dataZoom;
      const dataZoom = yAxis.reduce(
        (result, item, index) => {
          return result.concat(this.getDataZoom(options, item, yAxisLength, index));
        },
        [xZoom, xInZoom]
      );
      const series = yAxis.reduce((result, { bindKeyData = [] }, index) => {
        return result.concat(
          bindKeyData.map(item => {
            return {
              ...item,
              type: 'line',
              showSymbol: false,
              yAxisIndex: index,
              hoverAnimation: false,
            };
          })
        );
      }, []);
      // if (options.series.length !== series.length) {
      chart.setOption(
        {
          ...options,
          dataZoom,
          grid: {
            left: yAxis.length * this.yWidth,
            right: 30,
            bottom: 80,
          },
          yAxis: yAxis.length
            ? yAxis.map((item, index) => {
                return {
                  name: item.showName ? item.name : '',
                  min: item.min,
                  max: item.max,
                  axisLine: {
                    lineStyle: {
                      color: item.color,
                    },
                  },
                  splitLine: {
                    show: !index,
                  },
                  offset: index * this.yWidth + this.dataZoomWidth,
                  position: 'left',
                };
              })
            : {
                name: '',
                axisLine: {},
                position: 'left',
              },
          series,
        },
        true
      );
      // }
    }
  }

  render() {
    const { height } = this.props;
    return (
      <div>
        {/* <Chart
          ref={e => { 
          console.log(e)
          this.echartsInstance = e;
          }}
          style={{ height: `${height}px`, width: '100%' }}
          option={this.getOption()}
        /> */}
        {/* {JSON.stringify(currDatazoom)} */}
        <ReactEcharts
          ref={e => {
            console.log(e, 111);
            this.echartsInstance = e;
          }}
          style={{ height: `${height}px`, width: '100%' }}
          option={this.getOption()}
        />
      </div>
    );
  }
}
export default LineChart;
