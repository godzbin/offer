import { Button, Card, Checkbox, Col, Modal, Popconfirm, Row, Table, Transfer } from 'antd';
import React, { Component } from 'react';

import EditAxisModal from './EditAxisModal2';
import styles from '../ModalStyle';

class AxisModal extends Component {

  columns = [
    {
      title: '名称可见',
      dataIndex: 'showName',
      align: 'center',
      width: 90,
      render: (val, record) => (<Checkbox defaultChecked={val} onChange={() => this.onShowNameChange(record)} />),
    },
    {
      title: '坐标可见',
      dataIndex: 'showAxis',
      align: 'center',
      width: 90,
      render: (val, record) => (<Checkbox defaultChecked={val} onChange={() => this.onShowAxisChange(record)} />),
    },
    {
      title: '坐标名称',
      dataIndex: 'name',
      width: 100,
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 280,
      render: (val, record) => (
        <div>
          <Button type="link" onClick={() => this.editAxis(record)}>
            修改
          </Button>
          <Button type="link" onClick={e => this.editDataBind(record, e)}>
            修改坐标数值
          </Button>
          <Popconfirm
            title="你确定要删除这个配置吗？"
            onConfirm={e => this.removeAxis(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              style={{ color: '#f00' }}
            >
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  constructor(props) {
    super(props);
    this.state = {
      selectLine: {},
      editAxisModalVisible: false,
      editAxisId: '',
    };
    this.editAxisModal = ''
  };

  onCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) onCancel()
  }

  onOk = () => {
    this.onCancel()
  }

  editAxis = (record) => {
    console.log(this.editAxisModal)
    this.editAxisModal.setFormData({ ...record })
    this.setState({
      editAxisModalVisible: true
    })
  }

  editDataBind = (record = {}) => {
    this.setState({
      selectLine: record
    });
  }

  onTransferChange = (params = []) => {
    const { selectLine = {} } = this.state;
    const { onChange } = this.props;
    selectLine.bindKey = params;
    if (onChange) onChange({ ...selectLine })
  }

  renderTypeList = () => {
    const { selectLine = {} } = this.state
    const { keyList = [] } = this.props
    return (
      <Transfer
        dataSource={keyList}
        titles={['未绑定', '已绑定']}
        targetKeys={selectLine.bindKey || []}
        onChange={this.onTransferChange}
        showSearch
        render={item => item.name}
        listStyle={{
          width: 200,
          height: 300,
        }}
      />
    )
  }

  removeAxis = (record) => {
    const { removeAxis } = this.props
    if (removeAxis) removeAxis(record)
  }

  onShowAxisChange = (record) => {
    const { onChange } = this.props;
    if (onChange) onChange({ ...record, showAxis: !record.showAxis })
  }

  onShowNameChange = (record) => {
    const { onChange } = this.props;
    if (onChange) onChange({ ...record, showName: !record.showName })
  }

  renderAddAxisButton = () => (
    <Button type="primary" onClick={this.addAxis}>
      增加坐标轴
    </Button>
  )

  addAxis = () => {
    this.editAxisModal.setFormData({
      name: '',
      min: '',
      max: '',
      color: '#999',
      showAxis: true,
      showName: true,
      bindKey: []
    })
    this.setState({
      editAxisModalVisible: true
    })
  }

  onEditOk = params => {
    const { onChange } = this.props;
    if (onChange) onChange({ ...params })
    this.setState({
      editAxisModalVisible: false
    })
  }

  onEditCancel = () => {
    this.setState({
      editAxisModalVisible: false
    })
  }

  render () {
    const { selectLine, editAxisId, editAxisModalVisible } = this.state
    const { visible, yConfigs } = this.props
    return (
      <Modal
        title="数据轴设置"
        width={1100}
        visible={visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <Row gutter={10}>
          <Col span={13}>
            <Card
              title="自定义坐标轴"
              extra={this.renderAddAxisButton()}
              headStyle={styles.headerStyle}
              bodyStyle={styles.bodyStyle}
            >
              <Table
                rowKey="key"
                columns={this.columns}
                dataSource={yConfigs}
                pagination={false}
                scroll={{ y: 390 }}
              />
            </Card>
          </Col>
          <Col span={11}>
            {selectLine.key && (
              <Card
                title={`坐标数值绑定-${selectLine.name}`}
                headStyle={styles.headerStyle}
                bodyStyle={styles.bodyStyleToRight}
              >
                {this.renderTypeList()}
              </Card>
            )}
          </Col>
        </Row>
        <EditAxisModal
          ref={e => { this.editAxisModal = e }}
          editId={editAxisId}
          visible={editAxisModalVisible}
          onOk={this.onEditOk}
          onCancel={this.onEditCancel}
        />
      </Modal>
    )
  }

}
export default AxisModal