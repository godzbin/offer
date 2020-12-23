export default {
	theme: 'dark',
	tooltip: {
		trigger: 'axis',
		showContent: true,
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
					color: '#3a3f44',
				},
			},
			axisLabel: {
				inside: true,
				// backgroundColor: '#3a3f44',
				color: '#fff',
				// width: '100%',
				// padding: [10, 100]
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
		top: 40,
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
			backgroundColor: '#2a2b31',
			borderColor: '#2a2b31',
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
