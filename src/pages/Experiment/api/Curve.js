import request from '@/utils/request';

export async function getList () {
  const {
    data = []
  } = await request(`/curve/dict`);
  return data;
};

export async function getData () {
  const {
    data = []
  } = await request(`/curve`);
  return data;
};

// 获取设备信息
export async function getEquipmentInfo () {
  const {
    data = []
  } = await request(`/curve/message`);
  return data;
};

