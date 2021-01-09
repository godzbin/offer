// import ListCard from '@/components/ListCard';
import React from 'react';
import { Table } from 'antd';
// import Styles from './RunningRecord.less'

// const { Option } = Select;

class RunningRecord extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: '时间',
          dataIndex: 'time',
          align: 'center'
        },
        {
          title: '动作',
          dataIndex: 'active',
          align: 'center',
          render: (_, record) => (<span style={{ color: record.active === 'ON' ? '#2dcb68' : '' }}>{record.name}{record.active}</span>)
        },
        {
          title: '操作来源',
          dataIndex: 'origin',
          align: 'center',
          render: (_, record) => (<span style={{ color: record.origin === '异常关机' ? '#ff6c00' : '' }}>{record.origin}</span>)
        },
      ],
      data: [
        {
          time: '2020-01-01',
          name: '电源',
          active: 'Off',
          origin: '异常关机'
        },
        {
          time: '2020-01-01',
          name: '电源',
          active: 'ON',
          origin: '手动关机'
        },
        {
          time: '2020-01-01',
          name: '电源',
          active: 'Off',
          origin: '手动关机'
        }
      ]
    }
  }

  render () {
    const { columns = [], data = [] } = this.state;
    return (
      <div className="pageContent">
        <div className="pageHeader">系统日志</div>
        <Table key="name" columns={columns} dataSource={data} />
      </div>
    )
  }
}

export default RunningRecord