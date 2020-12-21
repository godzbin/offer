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

export async function getInfo () {
  const {
    data = []
  } = await request(`/curve/message`);
  return data;
};

