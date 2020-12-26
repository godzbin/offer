import { getData, getEquipmentInfo, getKeyList, getYSettings } from '../api/Curve'

export default {
	namespace: 'ExperimentCurve',
	state: {
		keyList: [],
		equipmentInfo: [],
		yConfigs: [
			{
				key: 1,
				name: '温度',
				color: '#f00',
				min: 0,
				max: 100,
				bindKey: [
					'ut-1',
					'ut-2'
				]
			},
			{
				key: 2,
				name: '温度2',
				color: '#000',
				min: 0,
				max: 100,
				bindKey: [
					'ut-3'
				]
			}
		],
		dataList: []
	},
	effects: {
		*getKeyList (_, { call, put }) {
			const data = yield call(getKeyList);
			yield put({
				type: 'setKeyList',
				payload: data
			})
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
		*changeYConfig ({ payload }, { put }) {
			// const data = yield call(updateYSetting);
			console.log(payload)
			yield put({ type: 'setYSetting', payload })
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
			payload.forEach((item) => {
				const keyData = dataList.find((dItem) => dItem.key === item.key)
				if (keyData) {
					const { value = [] } = keyData
					value.push({
						time: new Date(),
						value: item.value
					})
				} else {
					dataList.push({
						key: item.key,
						value: [{ time: new Date(), value: item.value }]
					})
				}
			})
			return { ...state, dataList }
		},
		setYSettings (state, { payload }) {
			const yConfigs = Object.keys(payload).map((item) => {
				const data = JSON.parse(payload[item])
				data[0].name = item
				return data[0]
			})
			return { ...state, yConfigs }
		},
		setYSetting (state, { payload }) {
			const { yConfigs } = state
			console.log(payload)
			const index = yConfigs.findIndex((item) => item.key === payload.key)
			yConfigs[index] = payload
			return {
				...state,
				yConfigs
			}
		}
	}
}