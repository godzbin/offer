// import moment from 'moment';
import {
  getHistoryData,
  getKeyName,
  getSetting,
  getYSetting,
  setYSetting,
} from '../api/ExperimentHistoryApi';

// 将数据提前合并为图表需要的数据
function setYAxisSettingData (state) {
  const { yAxisSetting, data } = state;
  return yAxisSetting.map(item => {
    const { bindKey = [] } = item;
    return {
      ...item,
      bindKeyData: bindKey.reduce((result, key) => {
        const line = data.find(dataItem => dataItem.key === key);
        if (line)
          result.push({
            ...line,
            itemKey: line.key,
          });
        return result;
      }, []),
    };
  });
}
// 将数据转换为图表需要的格式
function exchangeDataToChart (result = [], list = [], names = []) {
  list.forEach(({ createTime, data = [] }) => {
    const valueList = JSON.parse(data);
    valueList.forEach(node => {
      const { name } = names.find(item => item.key === node.key);
      const index = result.findIndex(item => item.key === node.key);
      const dataValue = {
        name: createTime,
        value: [createTime, node.value],
      };
      if (index > -1) {
        result[index].data.push(dataValue);
      } else {
        result.push({
          name,
          key: node.key,
          data: [dataValue],
        });
      }
    });
  });
  return result;
}

export default {
  namespace: 'experimentHistory',

  state: {
    // y轴配置数据
    yAxisSetting: [
      {
        id: 1,
        name: '温度',
        showAxis: true,
        showName: true,
        max: 100,
        min: 0,
        color: '#f00',
        bindKey: [
          // 'AirAEnteringDB',
          // 'AirAEnteringWB',
          // 'AirALeavingDB',
          // 'AirALeavingWB',
          // 'AirBEnteringDB',
          // 'AirBEnteringWB',
        ],
      },
    ],
    // 当前试验所有数据
    data: [],
    // 编辑缓存的y轴数据
    editAxis: {},
    // 当前试验的配置
    setting: [],
    // 实时数据的创建时间，通过该时间向后请求数据
    createTime: '',
    // 指标名称的列表
    names: [],
  },

  effects: {
    // 初始化获取配置及数据
    *init ({ payload, callback }, { put, take }) {
      yield put({ type: 'getSetting', payload: payload.id });
      yield take('getSetting/@@end');
      yield put({ type: 'getHistoryData', payload });
      yield take('getHistoryData/@@end');
      if (callback) callback();
    },
    // 获取历史数据
    *getHistoryData ({ payload, callback }, { put, call }) {
      const [names, data] = yield [call(getKeyName, payload), call(getHistoryData, payload)];
      yield put({
        type: 'setHistoryData',
        payload: {
          names,
          data,
        },
      });
      if (callback) callback();
    },
    // 获取实时数据
    *getLiveData ({ payload, callback }, { call }) {
      const data = yield call(getHistoryData, payload);
      if (callback) callback(data);
    },
    // 修改Y轴绑定的Key值
    *changeBindKey ({ payload }, { put }) {
      yield put({
        type: 'setBindKey',
        payload,
      });
    },
    // 通过ID获取y轴数据
    *getAxisDataById ({ payload }, { select, put }) {
      const data = yield select(state => state.experimentHistory.yAxisSetting);
      yield put({
        type: 'setEditAxisData',
        payload: data.find(item => item.id === payload),
      });
    },
    // 获取配置信息
    *getSetting (_, { call, put }) {
      const { data, createTime } = yield call(getSetting);
      yield put({
        type: 'setSetting',
        payload: data,
      });
      yield put({
        type: 'setCreateTime',
        payload: createTime,
      });
      return data;
    },
    /**
     * 获取Y轴配置
     * @param {*} payload: 试验ID
     * @param {*} param1
     */
    *getYSetting ({ payload }, { call, put }) {
      const data = yield call(getYSetting, payload);
      yield put({
        type: 'setYSetting',
        payload: data,
      });
      return data;
    },
    /**
     * 更新Y轴数据
     * @param {} param0 ：所有y轴配置 {id, data}
     * @param {*} param1
     */
    *updateYSetting ({ payload }, { call, put }) {
      yield call(setYSetting, payload);
      yield put({
        type: 'getYSetting',
        payload: payload.id,
      });
    },
  },

  reducers: {
    // 设置Y轴到state
    /**
     * 设置Y轴到state
     * @param {*} state
     * @param {*}  payload {}
     */
    setYSetting (state, { payload }) {
      console.log(payload)
      // const yAxisSettingNew = setYAxisSettingData({
      //   data: state.data,
      //   yAxisSetting: JSON.parse(JSON.stringify(payload)),
      // });
      // console.log(yAxisSettingNew)
      // return {
      //   ...state,
      //   yAxisSetting: yAxisSettingNew,
      // };
    },
    setHistoryData (state, { payload }) {
      const {
        data: { list = [] },
        names,
      } = payload;
      const { yAxisSetting } = state;
      const result = exchangeDataToChart([], list, names);
      const yAxisSettingNew = setYAxisSettingData({
        data: result,
        yAxisSetting: JSON.parse(JSON.stringify(yAxisSetting)),
      });
      return {
        ...state,
        data: result,
        names,
        yAxisSetting: yAxisSettingNew,
      };
    },
    removeAxisDataById (state, { payload }) {
      const { yAxisSetting } = state;
      const newYAisSetting = yAxisSetting.filter(item => item.id !== payload);
      return {
        ...state,
        yAxisSetting: newYAisSetting,
      };
    },
    appendData (state, { payload }) {
      const { list = [] } = payload;
      const { names } = state;
      const result = state.data;
      return {
        ...state,
        data: exchangeDataToChart(result, list, names),
      };
    },
    setBindKey (state, { payload }) {
      const { yAxisSetting, data } = state;
      const { id, bindKey = [] } = payload;
      const lineIndex = yAxisSetting.findIndex(yAxis => yAxis.id === id);
      yAxisSetting[lineIndex] = Object.assign({}, yAxisSetting[lineIndex], {
        bindKey,
      });
      const yAxisSettingNew = setYAxisSettingData({ data, yAxisSetting });
      // return {
      //   ...state,
      //   yAxisSetting: yAxisSettingNew
      // }
      return {
        ...state,
        yAxisSetting: yAxisSettingNew,
      };
    },
    setEditAxisData (state, { payload }) {
      return Object.assign({}, state, {
        editAxis: payload,
      });
    },
    updateEditAxis (state, { payload }) {
      return Object.assign({}, state, {
        editAxis: Object.assign({}, state.editAxis, payload),
      });
    },
    updateAxis (state, { payload }) {
      const { yAxisSetting } = state;
      const axisIndex = yAxisSetting.findIndex(yAxis => yAxis.id === payload.id);
      yAxisSetting[axisIndex] = Object.assign({}, state.yAxisSetting[axisIndex], payload);
      return {
        ...state,
        yAxisSetting,
      };
    },
    addAxis (state, { payload }) {
      const { yAxisSetting } = state;
      yAxisSetting.push(
        Object.assign(
          {
            bindKey: [],
          },
          payload,
          { id: new Date().getTime() }
        )
      );
      return {
        ...state,
        yAxisSetting,
      };
    },
    setSetting (state, { payload }) {
      return Object.assign({}, state, {
        setting: payload,
      });
    },
    setCreateTime (state, { payload }) {
      return {
        ...state,
        createTime: payload,
      };
    },
  },
};
