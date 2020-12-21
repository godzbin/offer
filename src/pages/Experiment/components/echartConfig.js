export default {
	tooltip: {
		trigger: 'axis',
		showContent: true,
	},
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
	// backgroundColor: '#000',
	grid: {
		show: true,
		left: 100,
		right: 0,
		bottom: 80,
		top: 0,
		backgroundColor: '#3a3f44'
	},
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
		},
		{
			type: 'inside',
			id: 'inside_yAxis0',
			filterMode: 'none',
			xAxisIndex: 0,
		},
	],
	series: [],
}
