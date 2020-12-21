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
		bottom: 60,
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
			backgroundColor: '#2a2b31',
			dataBackground: {
				lineStyle: {},
				// areaStyle: {
				// 	color: 'rgb(0,0,0)',
				// 	opacity: 0.8
				// }
			},
			fillerColor: 'rgba(56,88,116,0.9)',
			handleStyle: {
				opacity: 0
			}
			// handleIcon: 'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5C17.6,3.5,6.8,14.4,6.8,27.6c0,13.3,10.8,24.1,24.101,24.1C44.2,51.7,55,40.9,55,27.6C54.9,14.4,44.1,3.5,30.9,3.5z M36.9,35.8c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H36c0.5,0,0.9,0.4,0.9,1V35.8z M27.8,35.8 c0,0.601-0.4,1-0.9,1h-1.3c-0.5,0-0.9-0.399-0.9-1V19.5c0-0.6,0.4-1,0.9-1H27c0.5,0,0.9,0.4,0.9,1L27.8,35.8L27.8,35.8z'
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
