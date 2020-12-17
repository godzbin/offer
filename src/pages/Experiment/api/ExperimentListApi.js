import { stringify } from 'qs';
import request from '@/utils/request';

export default function searchList(param) {
  let params = param;
  if (!params) {
    params = {};
    params.pageSize = 20;
    params.pageNum = 1;
  } else {
    if (params.pageSize == null || params.pageSize < 1) params.pageSize = 20;

    if (params.currentPage == null || params.currentPage < 1) params.pageNum = 1;
    else params.pageNum = params.currentPage;
  }

  console.info(request(`/admin/experiment?${stringify(params)}`));

  return request(`/admin/experiment?${stringify(params)}`);
}
