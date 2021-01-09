import ListCard from '@/components/ListCard';
import React from 'react';
import { Select } from 'antd';
import Styles from './RunningRecord.less'

const { Option } = Select;

class RunningRecord extends React.PureComponent {

  handleChange = () => {

  }

  renderTitle = () => {
    return (
      <div>
        日志级别：
        <Select defaultValue="Info" style={{ width: 120, marginRight: 30 }} onChange={this.handleChange}>
          <Option value="Info">Info</Option>
          <Option value="Error">Error</Option>
        </Select>
        选择相关串口（网口）：
        <Select defaultValue="COM-1" style={{ width: 120 }} onChange={this.handleChange}>
          <Option value="COM-1">COM-1</Option>
          <Option value="COM-2">COM-2</Option>
        </Select>
      </div>
    )
  }

  render () {
    return (
      <div className="pageContent">
        <div className="pageHeader">运行记录</div>
        <ListCard title={this.renderTitle()} />
        <div className={Styles.recordContent}>
          <pre>
            {decodeURIComponent(escape(atob(require('./RunningRecord.txt').replace('data:text/plain;base64,', ''))))}
          </pre>
        </div>
      </div>
    )
  }
}

export default RunningRecord