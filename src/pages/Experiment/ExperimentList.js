import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage } from 'umi/locale';

import { Card, Form } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import returnParams from '@/utils/StandardTableUtils';

import Link from 'umi/link';
import styles from '../global-list.less';

// const FormItem = Form.Item;

@connect(({ experiment, loading }) => ({
  experiment,
  loading: loading.models.experiment,
}))
@Form.create()
class LabList extends PureComponent {
  state = {
    selectedRows: [],
  };

  columns = [
    {
      title: formatMessage({ id: 'list.header.epm.name' }),
      dataIndex: 'name',
    },
    {
      title: formatMessage({ id: 'list.header.epm.client.id' }),
      dataIndex: 'clientId',
    },
    {
      title: formatMessage({ id: 'list.header.epm.lab.name' }),
      dataIndex: 'labName',
    },
    {
      title: formatMessage({ id: 'list.header.epm.start.time' }),
      dataIndex: 'startTime',
      sorter: false,
      render: val => (val ? <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span> : ''),
    },
    {
      title: formatMessage({ id: 'list.header.epm.end.time' }),
      dataIndex: 'endTime',
      sorter: false,
      render: val => (val ? <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span> : ''),
    },
    {
      title: formatMessage({ id: 'list.header.handle' }),
      render: (text, record) => {
        return (
          // <div>
          //   {
          //     record.startTime && !record.endTime  ?  <Link to={`./emp-list/detail/${record.id}/2`}> {formatMessage({ id: 'list.epm.live' })}</Link> : null
          //   }
          //   {
          //     record.endTime  ?  <Link to={`./emp-list/detail/${record.id}/1`}> {formatMessage({ id: 'list.epm.history' })} </Link> : null
          //   }
          // </div>
          <div>
            <Link to={`./emp-list/detail/${record.id}/2`}>
              {formatMessage({ id: 'list.epm.live' })}
            </Link>
            &nbsp;&nbsp;
            <Link to={`./emp-list/detail/${record.id}/1`}>
              {formatMessage({ id: 'list.epm.history' })}
            </Link>
          </div>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'experiment/searchList',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'experiment/searchList',
      payload: returnParams(pagination, filtersArg, sorter, Object),
    });
  };

  render() {
    const {
      experiment: { data },
      loading,
    } = this.props;

    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns.map(item => ({ ...item, ellipsis: true, align: 'center' }))}
              onChange={this.handleStandardTableChange}
              isShowAlert={false}
              isShowSelectionColumn={false}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default LabList;
