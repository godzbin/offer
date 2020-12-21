import { getList } from '../api/Curve'

export default {
	namespace: 'ExperimentCurve',
	state: {
		list: []
	},
	effects: {
		*getList (_, { call, put }) {
			console.log(11111)
			const data = yield call(getList);
			yield put({
				type: 'setList',
				payload: data
			})
		}
	},
	reducers: {
		setList (state, { payload }) {
			return {
				state,
				list: payload
			}
		}
	}
}