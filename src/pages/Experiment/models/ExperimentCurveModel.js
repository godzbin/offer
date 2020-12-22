import { getEquipmentInfo, getList } from '../api/Curve'

export default {
	namespace: 'ExperimentCurve',
	state: {
		list: [],
		equipmentInfo: [],
		yConfigs: [
			{
				name: '',
				color: '',
				min: '',
				max: '',
				keys: [
					'ut-1',
					'ut-2',
					'ut-3',
				]
			}
		]
	},
	effects: {
		*getList (_, { call, put }) {
			const data = yield call(getList);
			yield put({
				type: 'setList',
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
		setList (state, { payload }) {
			return {
				...state,
				list: payload
			}
		},
		setEquipmentInfo (state, { payload }) {
			return { ...state, equipmentInfo: payload }
		}
	}
}