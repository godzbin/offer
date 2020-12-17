import React, { Component } from 'react';
import { Modal, Row, Col, List, Button, Radio, Card, Table } from 'antd';
import styles from './Modal.less';
import ModalStyles from '../ModalStyle';

class AlarmSettingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: Array.from({ length: 40 }, (_, index) => {
        return {
          id: index + 1,
          name: `报警${index}`,
        };
      }),
      columns: [
        {
          title: '被测变量',
        },
        {
          title: '条件',
        },
        {
          title: '警戒值',
        },
        {
          title: '单位',
        },
        {
          title: '操作',
        },
      ],
    };
  }

  onCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) onCancel();
  };

  onOk = () => {
    this.onCancel();
  };

  render() {
    const { visible } = this.props;
    const { data, columns } = this.state;
    const alarmColor = ['#f14744', '#3598db'];
    const alarmColorStyle = {
      display: 'inline-block',
      width: '50px',
      height: '20px',
      verticalAlign: 'middle',
    };
    return (
      <Modal
        width={800}
        title="报警设置"
        visible={visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <Row gutter={10}>
          <Col span={6}>
            <div className={styles.settingHeader}>
              <Button type="primary">新增报警项</Button>
            </div>
            <List
              className={styles.scrollList}
              bordered
              dataSource={data}
              renderItem={item => (
                <List.Item className={styles.scrollListItme}>
                  <span>{item.name}</span>
                  <Button type="link" style={{ color: alarmColor[0] }}>
                    删除
                  </Button>
                </List.Item>
              )}
            />
            <div>
              <p>报警颜色</p>
              <Radio.Group name="radiogroup" defaultValue={1}>
                <Radio value={alarmColor[0]}>
                  <i style={{ ...alarmColorStyle, background: alarmColor[0] }} />
                </Radio>
                <Radio value={alarmColor[1]}>
                  <i style={{ ...alarmColorStyle, background: alarmColor[1] }} />
                </Radio>
              </Radio.Group>
            </div>
            <div>
              <p>报警方式</p>
              <Radio.Group name="radiogroup" defaultValue={1}>
                <Radio value={alarmColor[0]}>闪烁</Radio>
                <Radio value={alarmColor[1]}>蜂鸣</Radio>
              </Radio.Group>
            </div>
          </Col>
          <Col span={18}>
            <Card title="报警条件" bodyStyle={ModalStyles.bodyStyle}>
              <Table rowKey="id" columns={columns} dataSource={[]} />
            </Card>
          </Col>
        </Row>
      </Modal>
    );
  }
}
export default AlarmSettingModal;
