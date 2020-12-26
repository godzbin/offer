import { Button, Card, Checkbox, Col, Modal, Row, Table, Transfer } from 'antd';
import React, { Component } from 'react';

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
          <Button type="link" onClick={e => this.editAxis(record.id, e)}>
            修改
          </Button>
          <Button type="link" onClick={e => this.editDataBind(record, e)}>
            修改坐标数值
          </Button>
          <Button
            type="link"
            style={{ color: '#f00' }}
            onClick={e => this.removeAxis(record.id, e)}
          >
            删除
          </Button>
        </div>
      ),
    },
  ]

  constructor(props) {
    super(props);
    this.state = {
      selectLine: {},
      selectId: '',
      editAxisModalVisible: false,
      editAxisId: '',
    };
  };

  onCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) onCancel()
  }

  onOk = () => {
    this.onCancel()
  }

  editAxis = () => {
  }

  editDataBind = (record) => {
    this.setState({
      selectLine: record
      // selectId: record.id,
    });
  }

  onTransferChange = (params) => {
    const { selectLine } = this.state;
    const { onChange } = this.props;
    selectLine.bindKey = params;
    if (onChange) onChange({ ...selectLine })
  }

  renderTypeList = () => {
    const { selectLine } = this.state
    const { keyList } = this.props
    return (
      <Transfer
        dataSource={keyList}
        titles={['未绑定', '已绑定']}
        targetKeys={selectLine.bindKey}
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

  removeAxis = () => {

  }

  onShowAxisChange = () => {

  }

  onShowNameChange = () => {

  }

  renderAddAxisButton = () => (
    <Button type="primary" onClick={this.addAxis}>
      增加坐标轴
    </Button>
  )

  render () {
    const { selectLine } = this.state
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
      </Modal>
    )
  }

}
export default AxisModal