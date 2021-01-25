import { addYSetting, getData, getEquipmentInfo, getKeyList, getYSettings, removeYSetting, updateYSetting } from '../api/Curve'

export default {
	namespace: 'ExperimentCurve',
	state: {
		keyList: [],
		equipmentInfo: [],
		yConfigs: [
			// {
			// 	key: 1,
			// 	name: '温度123456',
			// 	color: '#f00',
			// 	min: 0,
			// 	max: 100,
			// 	bindKey: [
			// 		'ut-1',
			// 		'ut-2'
			// 	]
			// },
			// {
			// 	key: 2,
			// 	name: '温度2',
			// 	color: '#000',
			// 	min: 0,
			// 	max: 100,
			// 	bindKey: [
			// 		'ut-3'
			// 	]
			// }
		],
		dataList: []
	},
	effects: {
		*getKeyList ({ callback }, { call, put }) {
			try {
				const data = yield call(getKeyList);
				yield put({
					type: 'setKeyList',
					payload: data
				})
			} catch (e) {
				console.log(e)
				if (callback) callback(e)
			}
		},
		*getData (_, { call, put }) {
			const data = yield call(getData)
			yield put({
				type: 'setDataList',
				payload: data
			})
		},
		*getEquipmentInfo (_, { call, put }) {
			const data = yield call(getEquipmentInfo);
			yield put({
				type: 'setEquipmentInfo',
				payload: data
			})
		},
		*getYSettings (_, { call, put }) {
			const data = yield call(getYSettings);
			yield put({ type: 'setYSettings', payload: data })
		},
		*changeYConfig ({ payload }, { call }) {
			yield call(updateYSetting, payload);
			// yield put({ type: 'setYSetting', payload })
		},
		*addYConfig ({ payload }, { call }) {
			yield call(addYSetting, payload)
		},
		*removeYSetting ({ payload }, { call }) {
			yield call(removeYSetting, payload)
		}
	},
	reducers: {
		setKeyList (state, { payload }) {
			return {
				...state,
				keyList: payload
			}
		},
		setEquipmentInfo (state, { payload }) {
			return { ...state, equipmentInfo: payload }
		},
		setDataList (state, { payload = [] }) {
			const { dataList } = state
			const time = new Date()
			//  保留 半个小时数据
			const maxLength = 60 * 60 * 0.5 / 5
			payload.forEach((item) => {
				const keyData = dataList.find((dItem) => dItem.key === item.key)
				if (keyData) {
					const { value = [] } = keyData
					value.push({
						time,
						value: item.value
					})
					if (value.length > maxLength) {
						value.shift()
					}
				} else {
					dataList.push({
						key: item.key,
						value: [{ time, value: item.value }]
					})
				}
			})
			return { ...state, dataList }
		},
		setYSettings (state, { payload }) {
			// const yConfigs = Object.keys(payload).map((item) => {
			// 	const data = JSON.parse(payload[item])
			// 	data[0].name = item
			// 	return data[0]
			// })
			return { ...state, yConfigs: payload }
		},
		setYSetting (state, { payload }) {
			const { yConfigs } = state
			const index = yConfigs.findIndex((item) => item.key === payload.key)
			yConfigs[index] = payload
			return {
				...state,
				yConfigs
			}
		}
	}
}