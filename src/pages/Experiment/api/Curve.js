import request from '@/utils/request';

export async function getKeyList () {
  const {
    data = []
  } = await request(`/curve/dict`);
  return data;
};

export async function getData () {
  const {
    data = []
  } = await request(`/curve/`);
  return data;
};

// 获取设备信息
export async function getEquipmentInfo () {
  const {
    data = []
  } = await request(`/curve/message`);
  return data;
};

export async function getYSettings () {
  const { data = [] } = await request(`/curve/{key}/yaxle`)
  return data
}

export async function updateYSetting (params) {
  const { data = [] } = await request(`/curve/${params.key}/yaxle`, {
    method: 'PUT',
    body: params
  })
  return data
}

export async function addYSetting (params) {
  const { data = [] } = await request(`/curve/${params.name}/yaxle`, {
    method: 'POST',
    body: {
      ...params,
      key: params.name
    }
  })
  return data
}

export async function removeYSetting (params) {
  const { data = [] } = await request(`/curve/${params.key}/yaxle`, {
    method: 'DELETE'
  })
  return data
}

