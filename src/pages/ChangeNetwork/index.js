import React, { PureComponent } from 'react';

import ListCard from '@/components/ListCard';
import { Radio } from 'antd'
import { connect } from 'dva';

@connect(({ experiment, loading }) => ({
  experiment,
  loading: loading.models.experiment,
}))
class ChangeNetwork extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      autoIP: true
    }
  }

  onChange = (value) => {
    this.setState({
      autoIP: value.target.value
    })
  }

  isCheckedAutoIp = () => {
    return (
      <Radio.Group onChange={this.onChange} value={this.state.autoIP}>
        <Radio value={true}>ON</Radio>
        <Radio value={false}>OFF</Radio>
      </Radio.Group>
    )
  }

  render () {
    const autoList = [
      {
        name: '自动获取IP地址', value: this.isCheckedAutoIp()
      }
    ]
    const list = [
      { name: '网关名称', value: 'enp1s0' },
      { name: 'IP地址', value: '192.168.1.10' },
      { name: 'IP网关', value: '192.168.1.1' },
      { name: '子网掩码', value: '255.255.255.0' }
    ];
    return (<div className="pageContent">
      <div className="pageHeader">更改网络配置</div>
      <div>
        <ListCard style={{ marginBottom: 20 }} title="以太网IP地址设定" list={autoList} />
        <ListCard style={{ marginBottom: 20 }} title="以太网IP地址设定" list={list} />
        <ListCard title="以太网IP地址设定" list={list} />
      </div>
    </div>)
  }
}
export default ChangeNetwork