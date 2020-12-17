import request from '@/utils/request';

export async function getKeyName({ id }) {
  const {
    data: { data = '' },
  } = await request(`/admin/experiment/${id}/dict`);
  const json = JSON.parse(data);
  return json;
}
export async function getHistoryData({ id, startTime = '' }) {
  const { data } = await request(`/admin/experiment/${id}/data?startTime=${startTime}`);
  return data;
}

export async function getSetting(id) {
  const {
    createTime,
    data: { data = '' },
  } = await request(`/admin/experiment/${id}/setting`);
  const json = JSON.parse(data);
  return { createTime, data: json };
}

export async function getYSetting(id) {
  const { data = '[]' } = await request(`/admin/experiment/${id}/config`);
  const json = JSON.parse(data || '[]');
  return json;
}

export async function setYSetting({ id, data }) {
  return request(`/admin/experiment/${id}/config`, {
    method: 'PUT',
    body: data.map(item => ({
      bindKey: item.bindKey,
      color: item.color,
      id: item.id,
      max: item.max,
      min: item.min,
      name: item.name,
      showAxis: item.showAxis,
      showName: item.showName,
    })),
  });
}
// export async function getHistoryDict (id) {
//   const { data } = await request(`/admin/experiment/${id}/dict`);
//   return data;
// }
