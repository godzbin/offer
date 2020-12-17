import React, { Component } from 'react';
import { Modal, Form, Input, Popover, InputNumber } from 'antd';
import { SketchPicker } from 'react-color';
import { connect } from 'dva';

@connect(({ experimentHistory, loading }) => ({
  experimentHistory,
  loading: loading.models.experimentHistory,
}))
class EditAxisModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // color: '#1890FF',
    };
  }

  onCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) onCancel();
  };

  onOk = async () => {
    const {
      dispatch,
      editId,
      onOk,
      experimentHistory: { editAxis },
    } = this.props;
    if (editAxis.name) {
      await dispatch({
        type: editId ? 'experimentHistory/updateAxis' : 'experimentHistory/addAxis',
        payload: Object.assign({}, editAxis),
      });
      onOk();
    } else {
      console.log(editAxis);
    }
  };

  onInputChange = (value, name) => {
    // const { value } = e.target;
    // console.log(changedValues, allValues);
    const { dispatch } = this.props;
    dispatch({
      type: 'experimentHistory/updateEditAxis',
      payload: {
        [name]: value,
      },
    });
  };

  handleChangeComplete = color => {
    // this.setState({
    //   color: color.hex,
    // });
    const { dispatch } = this.props;
    dispatch({
      type: 'experimentHistory/updateEditAxis',
      payload: {
        color: color.hex,
      },
    });
  };

  render() {
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const {
      visible,
      editId,
      experimentHistory: { editAxis },
    } = this.props;
    // const { color } = this.state;
    const title = `${editId ? '修改' : '添加'}坐标轴`;
    // const from = this.getData()
    const formData = editAxis;
    return (
      <Modal title={title} visible={visible} onCancel={this.onCancel} onOk={this.onOk}>
        <Form {...layout}>
          <Form.Item
            label="坐标名称"
            name="name"
            rules={[{ required: true, message: '请填写坐标名称' }]}
          >
            <Input
              value={formData.name}
              onChange={e => {
                const { value } = e.target;
                this.onInputChange(value, 'name');
              }}
            />
          </Form.Item>
          <Form.Item label="最大值" name="max">
            <InputNumber
              value={formData.max}
              onChange={value => {
                this.onInputChange(value, 'max');
              }}
            />
          </Form.Item>
          <Form.Item label="最小值" name="min">
            <InputNumber
              value={formData.min}
              onChange={value => {
                this.onInputChange(value, 'min');
              }}
            />
          </Form.Item>
          {/* <Form.Item
            label="小数点位数"
            name=""
            rules={[{ required: true, message: '请填写坐标名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="起点位置"
            name="username"
            rules={[{ required: true, message: '请填写坐标名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="终点位置"
            name="username"
            rules={[{ required: true, message: '请填写坐标名称' }]}
          > */}
          {/* <Input /> */}
          {/* </Form.Item> */}
          {/* <Form.Item
            label="刻度数量"
            name="username"
            rules={[{ required: true, message: '请填写坐标名称' }]}
          >
            <Input />
          </Form.Item> */}
          <Form.Item label="坐标颜色" name="color">
            <Popover
              content={
                <SketchPicker color={formData.color} onChangeComplete={this.handleChangeComplete} />
              }
              title="选择颜色"
            >
              <i
                style={{
                  width: '30px',
                  height: '20px',
                  display: 'inline-block',
                  background: formData.color,
                }}
              />
            </Popover>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default EditAxisModal;
