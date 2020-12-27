import { Form, Input, InputNumber, Modal, Popover } from 'antd';
import React, { Component } from 'react';

import { SketchPicker } from 'react-color';

class EditAxisModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {}
      // color: '#1890FF',
    };
    this.form = ''
  }

  setFormData = (data) => {
    this.setState({
      formData: data
    })
  }

  onInputChange = (value, key) => {
    console.log(value)
    const { formData } = this.state
    formData[key] = value;
    this.setState({
      formData
    })
  }

  onOk = () => {
    console.log(this.form)
    this.form.validateFields((err, values) => {
      if (!err) {
        const { formData } = this.state
        const { onOk } = this.props
        if (onOk) onOk(formData)
      }
    });
  }

  render () {
    const {
      visible,
      onCancel
    } = this.props;
    const { formData } = this.state;
    const title = `${formData.key ? '修改' : '添加'}坐标轴`;
    return (
      <Modal title={title} visible={visible} onCancel={() => onCancel()} onOk={this.onOk}>
        <DataForm ref={e => { this.form = e }} formData={formData} onInputChange={(value, key) => this.onInputChange(value, key)} />
      </Modal>
    )
  }
}

@Form.create()
class DataForm extends Component {
  render () {
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    const { formData, onInputChange, form: { getFieldDecorator } } = this.props;
    return (
      <Form ref={e => { this.form = e }} {...layout}>
        <Form.Item
          label="坐标名称"
          name="name"
        >
          {getFieldDecorator('name', {
            initialValue: formData.name,
            rules: [{ required: true, message: '请填写坐标名称' }],
          })
            (<Input
              // value={formData.name}
              onChange={e => {
                const { value } = e.target;
                onInputChange(value, 'name');
              }}
            />)}
        </Form.Item>
        <Form.Item label="最大值" name="max">
          <InputNumber
            value={formData.max}
            onChange={value => {
              onInputChange(value, 'max');
            }}
          />
        </Form.Item>
        <Form.Item label="最小值" name="min">
          <InputNumber
            value={formData.min}
            onChange={value => {
              onInputChange(value, 'min');
            }}
          />
        </Form.Item>
        <Form.Item label="坐标颜色" name="color">
          <Popover
            content={
              <SketchPicker color={formData.color} onChangeComplete={({ hex }) => onInputChange(hex, 'color')} />
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
    )
  }
}

export default EditAxisModal