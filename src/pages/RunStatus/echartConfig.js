export default {
	theme: 'dark',
	tooltip: {
		trigger: 'axis',
		showContent: true,
	},
	backgroundColor: 'transparent',
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
		// width: '90%',
		show: true,
		top: 0,
		textStyle: {
			color: '#666'
		}
	},
	yAxis: [{
		axisLine: {
			lineStyle: {
				color: '#44484d',
			},
		},
		axisLabel: {
			color: '#44484d',
			padding: [15, 0, 0, 0],
			textStyle: {
				color: "#44484d"
			},
			align: 'center',
		}
	}],
	xAxis: [
		{
			type: 'time',
			splitNumber: 20,
			splitLine: {
				show: true,
				lineStyle: {
					type: 'dashed',
					color: '#999'
				}
			},
			axisLine: {
				lineStyle: {
					color: '#44484d',
				},
			},
			axisTick: {
				// interval: 0,
			},
			axisLabel: {
				color: '#44484d',
				textStyle: {
					color: "#44484d"
				},
				align: 'center',
				formatter: (value) => {
					const date = new Date(value)
					function valueForTen (val) {
						if (val > 9) {
							return val
						}
						return `0${val}`
					}
					return `${valueForTen(date.getHours())}:${valueForTen(date.getMinutes())}:${valueForTen(date.getSeconds())}`
				},
				showMinLabel: false,
				showMaxLabel: false
			},
			axisPointer: {
				label: {
					formatter: ({ value }) => {
						const date = new Date(value)
						function valueForTen (val) {
							if (val > 9) {
								return val
							}
							return `0${val}`
						}
						return `${valueForTen(date.getHours())}:${valueForTen(date.getMinutes())}:${valueForTen(date.getSeconds())}`
					},
				}
			},
			boundaryGap: ['1%', '10%']
		},
	],
	// backgroundColor: '#000',
	grid: [{
		show: true,
		left: 50,
		right: 4,
		bottom: 50,
		top: 30,
		backgroundColor: '#3a3f44',
		borderColor: '#3a3f44'
	}],
	// yAxis: [
	// 	{
	// 		name: '',
	// 		axisLine: {},
	// 		position: 'left'
	// 	},
	// ],
	// dataZoom: [
	// 	{
	// 		show: true,
	// 		id: `xAxis0`,
	// 		filterMode: 'none',
	// 		xAxisIndex: 0,
	// 		height: 20,
	// 		bottom: 10,
	// 		backgroundColor: '#d7d7d7',
	// 		borderColor: 'rgba(0,0,0,0.15)',
	// 		borderWidth: 10,
	// 		dataBackground: {
	// 			lineStyle: {},
	// 		},
	// 		fillerColor: 'rgba(56,88,116,0.9)',
	// 		handleStyle: {
	// 			opacity: 0
	// 		}
	// 	},
	// 	{
	// 		type: 'inside',
	// 		id: 'inside_yAxis0',
	// 		filterMode: 'none',
	// 		xAxisIndex: 0
	// 	},
	// ],
	series: [],
}
