import React, { PureComponent } from 'react';

import ListCard from '@/components/ListCard';

class BaseInfo extends PureComponent {
  render () {
    const list = [
      { name: '产品名称', value: 'GM10' },
      { name: '产品设备标识别', value: 'BC418D500-20201223-1' },
      { name: '固件版本', value: 'V1' },
      { name: '设备标签', value: 'GM10-1' },
      { name: '型号', value: 'V1' },
      { name: 'Web应用程序版本', value: '无' },
      { name: '处理器', value: 'AMD Ryzen 5 2500U Radeon Vege Mobile Gfx2.00GHZ' },
      { name: '机带RAM', value: '16.0GB' },
      { name: '硬件大小', value: '500G' },
      { name: '生产时间', value: '2020/12/23' },
      { name: '顺序号', value: '1' }
    ]
    return (
      <div className="pageContent">
        <div className="pageHeader">基础信息</div>
        <ListCard title="基础信息" list={list} />
      </div>
    )
  }
}
export default BaseInfo