export default {
	theme: 'dark',
	tooltip: {
		trigger: 'axis',
		showContent: true,
	},
	backgroundColor: '#fff',
	toolbox: {
		show: true,
		top: -100,
		feature: {
			dataZoom: {
				show: true,
			}
		}
	},
	calculable: true,
	legend: {
		type: 'scroll',
		width: '70%',
		show: false
	},
	xAxis: [
		{
			type: 'time',
			splitLine: {
				show: true,
				lineStyle: {
					type: 'dashed',
					color: '#44484d'
				}
			},
			axisLine: {
				lineStyle: {
					color: '#44484d',
				},
			},
			axisLabel: {
				inside: true,
				color: '#999',
				align: 'center',
				showMinLabel: false,
				showMaxLabel: false
			},
			boundaryGap: ['1%', '10%']
		},
	],
	// backgroundColor: '#000',
	grid: [{
		show: true,
		left: 100,
		right: 2,
		bottom: 38,
		top: 0,
		backgroundColor: '#3a3f44',
		borderColor: '#3a3f44'
	}],
	yAxis: [
		{
			name: '',
			axisLine: {},
			position: 'left'
		},
	],
	dataZoom: [
		{
			show: true,
			id: `xAxis0`,
			filterMode: 'none',
			xAxisIndex: 0,
			height: 20,
			bottom: 10,
			backgroundColor: '#d7d7d7',
			borderColor: 'rgba(0,0,0,0.15)',
			borderWidth: 10,
			dataBackground: {
				lineStyle: {},
			},
			fillerColor: 'rgba(56,88,116,0.9)',
			handleStyle: {
				opacity: 0
			}
		},
		{
			type: 'inside',
			id: 'inside_yAxis0',
			filterMode: 'none',
			xAxisIndex: 0
		},
	],
	series: [],
}
