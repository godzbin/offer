import searchList from '@/pages/Experiment/api/ExperimentListApi';

export default {
  namespace: 'experiment',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *searchList({ payload }, { call, put }) {
      const response = yield call(searchList, payload);
      const { data } = response;

      response.list = data.list;
      response.pagination = {
        total: data.total,
        pageSize: data.pageSize,
        current: data.pageNum,
      };

      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
