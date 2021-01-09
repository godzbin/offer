import { Input, Modal } from 'antd';
import React, { PureComponent } from 'react';

import ListCard from '@/components/ListCard';
import Styles from './connectNetwork.less';

class connectNetwork extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      connectName: '',
      visible: false,
      list: [
        {
          name: 'VeritasData', status: true
        },
        {
          name: 'VeritasData2', status: false
        }
      ]
    }
  }

  showConnectModal = (item) => {
    if (item.status) return
    this.setState({
      connectName: item.name,
      visible: true
    })
  }

  onPasswordChange = (e) => {
    const { value } = e.target;
    this.setState({
      password: value
    })
  }

  getList = () => {
    const { list } = this.state
    return list.map((item) => {
      return {
        render: () => {
          return (
            <div className={Styles.line} onClick={() => this.showConnectModal(item)}>
              <div className={Styles.lineName}>
                <img src={require('@/assets/menuIcon/icon_wifi.png')} />
                <div>
                  <p className={item.status ? Styles.checked : ''}>{item.name}</p>
                  <p className={Styles.status}>{item.status ? '已连接' : ''}</p>
                </div>
              </div>
              {!item.status && (<div className={Styles.connectTip}>
                连接wifi
              </div>)}
            </div>
          )
        }
      }
    })
  }

  onOk = () => {
    this.setState({
      // connectName: item.name,
      visible: false
    })
  }

  onCancel = () => {
    this.setState({
      connectName: '',
      visible: false
    })
  }

  render () {
    const { visible, connectName, password } = this.state
    return (
      <div className="pageContent">
        <div className="pageHeader">网络配置</div>
        <ListCard title="WIFI列表" list={this.getList()} />
        <Modal
          title={`连接：${connectName}`}
          width={400}
          visible={visible}
          onOk={this.onOk}
          onCancel={this.onCancel}
        >
          <Input type="password" placeholder="请输入网络安全密钥" value={password} onChange={(e) => this.onPasswordChange(e)} />
        </Modal>
      </div>
    )
  }
}
export default connectNetwork