import React, { Component } from 'react';
import { Modal, Card, Row, Col, Table, Button, Checkbox, Transfer } from 'antd';
import { connect } from 'dva';
import styles from '../ModalStyle';
import EditAxisModal from './EditAxisModal';

@connect(({ experimentHistory, loading }) => ({
  experimentHistory,
  loading: loading.models.experimentHistory,
}))
class AxisModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectLine: {},
      selectId: '',
      columns: [
        {
          title: '名称可见',
          dataIndex: 'showName',
          align: 'center',
          width: 90,
          render: (val, record) => {
            return <Checkbox defaultChecked={val} onChange={() => this.onShowNameChange(record)} />;
          },
        },
        {
          title: '坐标可见',
          dataIndex: 'showAxis',
          align: 'center',
          width: 90,
          render: (val, record) => {
            return <Checkbox defaultChecked={val} onChange={() => this.onShowAxisChange(record)} />;
          },
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
          render: (val, record) => {
            return (
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
            );
          },
        },
      ],
      editAxisModalVisible: false,
      editAxisId: '',
    };
  }

  onCancel = () => {
    const { onCancel, dispatch, editId } = this.props;
    dispatch({
      type: 'experimentHistory/getYSetting',
      payload: editId,
    });
    if (onCancel) onCancel();
  };

  onOk = async () => {
    const { onCancel } = this.props;
    if (onCancel) onCancel();
  };

  onUpdateSetting = async () => {
    const {
      dispatch,
      editId,
      experimentHistory: { yAxisSetting },
    } = this.props;
    await dispatch({
      type: 'experimentHistory/updateYSetting',
      payload: { id: editId, data: yAxisSetting },
    });
  };

  onEditOk = async () => {
    await this.onUpdateSetting();
    this.setState({
      editAxisModalVisible: false,
    });
  };

  onEditCancel = () => {
    this.onUpdateSetting();
    this.setState({
      editAxisModalVisible: false,
    });
  };

  onShowNameChange = async record => {
    const { id, showName } = record;
    const { dispatch } = this.props;
    await dispatch({
      type: 'experimentHistory/updateAxis',
      payload: Object.assign(
        {},
        {
          id,
          showName: !showName,
        }
      ),
    });
    await this.onUpdateSetting();
  };

  onShowAxisChange = async record => {
    const { id, showAxis } = record;
    const { dispatch } = this.props;
    await dispatch({
      type: 'experimentHistory/updateAxis',
      payload: Object.assign(
        {},
        {
          id,
          showAxis: !showAxis,
        }
      ),
    });
    await this.onUpdateSetting();
  };

  addAxis = () => {
    this.setState({
      editAxisModalVisible: true,
      editAxisId: '',
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'experimentHistory/updateEditAxis',
      payload: {
        name: '',
        max: '',
        min: '',
        color: '#000',
      },
    });
  };

  editAxis = editId => {
    this.setState({
      editAxisModalVisible: true,
      editAxisId: editId,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'experimentHistory/getAxisDataById',
      payload: editId,
    });
  };

  editDataBind = record => {
    this.setState({
      selectLine: record,
      selectId: record.id,
    });
  };

  removeAxis = async editId => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'experimentHistory/removeAxisDataById',
      payload: editId,
    });
    this.onUpdateSetting();
  };

  renderAddAxisButton = () => {
    return (
      <Button type="primary" onClick={this.addAxis}>
        增加坐标轴
      </Button>
    );
  };

  renderTypeList = () => {
    const { selectId } = this.state;
    const {
      experimentHistory: { yAxisSetting },
    } = this.props;
    const selectLine = yAxisSetting.find(({ id }) => selectId === id);
    // const { selectLine } = this.state;
    const {
      experimentHistory: { data },
    } = this.props;
    const { bindKey = [] } = selectLine;
    const bindKeyCheckList = data.reduce((result, item) => {
      // if (item.name.indexOf(searchText) > -1) {
      result.push({
        key: item.key,
        title: item.name,
      });
      // }
      return result;
    }, []);
    // return (<Checkbox.Group value={bindKey} onChange={this.onChange}>{bindKeyCheckList}</Checkbox.Group>)

    return (
      <Transfer
        dataSource={bindKeyCheckList}
        titles={['未绑定', '已绑定']}
        targetKeys={bindKey}
        onChange={this.onChange}
        showSearch
        render={item => item.title}
        listStyle={{
          width: 200,
          height: 300,
        }}
      />
    );
  };

  onChange = async params => {
    const { dispatch } = this.props;
    const { selectLine } = this.state;
    await dispatch({
      type: 'experimentHistory/changeBindKey',
      payload: {
        id: selectLine.id,
        bindKey: params,
      },
    });
    this.onUpdateSetting();
  };

  render() {
    const { visible } = this.props;
    const { columns, editAxisModalVisible, editAxisId, selectId } = this.state;
    const {
      experimentHistory: { yAxisSetting },
    } = this.props;
    const selectLine = yAxisSetting.find(({ id }) => selectId === id) || {};
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
                rowKey="id"
                columns={columns}
                dataSource={yAxisSetting}
                pagination={false}
                scroll={{ y: 390 }}
              />
            </Card>
          </Col>
          <Col span={11}>
            {selectLine.id && (
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
          editId={editAxisId}
          visible={editAxisModalVisible}
          onOk={this.onEditOk}
          onCancel={this.onEditCancel}
        />
      </Modal>
    );
  }
}
export default AxisModal;
