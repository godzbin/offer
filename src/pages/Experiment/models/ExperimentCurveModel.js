import { getData, getEquipmentInfo, getKeyList } from '../api/Curve'

export default {
	namespace: 'ExperimentCurve',
	state: {
		keyList: [],
		equipmentInfo: [],
		yConfigs: [
			{
				name: '温度',
				color: '#f00',
				min: 0,
				max: 100,
				keys: [
					'ut-1',
					'ut-2',
					'ut-3',
				]
			},
			{
				name: '温度2',
				color: '#000',
				min: 0,
				max: 100,
				keys: [
					'ut-1',
					'ut-2',
					'ut-3',
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
		}
	}
}