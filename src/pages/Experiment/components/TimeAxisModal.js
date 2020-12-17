import React, { Component } from 'react';
import {
  Modal,
  Form,
  // DatePicker,
  TimePicker,
  // Popover
} from 'antd';
// import { SketchPicker } from 'react-color';
import moment from 'moment';

class TimeAxisModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // color: '#00f',
    };
  }

  onCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) onCancel();
  };

  onOk = () => {
    this.onCancel();
  };

  // handleChangeComplete = color => {
  //   this.setState({
  //     // color: color.hex,
  //   });
  // };

  render() {
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const { visible } = this.props;
    // const { color } = this.state;
    const format = 'HH:mm';
    const timeValue = '00:01';
    return (
      <Modal title="时间轴设置" visible={visible} onOk={this.onOk} onCancel={this.onCancel}>
        <Form {...layout}>
          {/* <Form.Item
            label="最小值"
            name="username"
            rules={[{ required: true, message: '请填写坐标名称' }]}
          >
            <DatePicker />
            <TimePicker format={format} />
          </Form.Item> */}
          <Form.Item
            label="间隔"
            name="username"
            rules={[{ required: true, message: '请填写坐标名称' }]}
          >
            <TimePicker format={format} value={moment(timeValue, 'hh:mm')} inputReadOnly />
          </Form.Item>
          {/* <Form.Item
            label="颜色"
            name="username"
            rules={[{ required: true, message: '请填写坐标名称' }]}
          >
            <Popover
              content={<SketchPicker color={color} onChangeComplete={this.handleChangeComplete} />}
              title="选择颜色"
            >
              <i
                style={{
                  width: '30px',
                  height: '20px',
                  display: 'inline-block',
                  background: color,
                }}
              />
            </Popover>
          </Form.Item> */}
        </Form>
      </Modal>
    );
  }
}
export default TimeAxisModal;
