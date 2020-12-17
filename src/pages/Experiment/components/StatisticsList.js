import React, { Component } from 'react';
import { Table } from 'antd';
import styles from '../History.less';

class StatisticsList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getDiff() {
    const { diff } = this.props;
    if (diff) {
      const diffSecond = diff / 1000;
      const second = parseInt(diffSecond % 60, 10);
      const minute = parseInt(diffSecond / 60, 10);
      return `${minute}分钟${second}秒`;
    }
    return '--';
  }

  render() {
    const { data = [], onSelectChange, link } = this.props;
    const rowSelection = {
      selectedRowKeys: data.filter(item => item.isSelect).map(item => item.key),
      hideDefaultSelections: true,
      onChange: (selectedRowKeys, selectedRows) => {
        if (onSelectChange) onSelectChange(selectedRowKeys, selectedRows, data);
      },
    };
    const columns = [
      {
        title: '测试量',
        dataIndex: 'name',
        // key: 'name',
        render: (text, row) => (
          <span style={{ color: row.color }} key={text}>
            {text}
          </span>
        ),
      },
      ...(link === '2'
        ? [
            {
              title: '实时',
              dataIndex: 'live',
            },
          ]
        : []),
      // {
      //   title: '实时',
      //   dataIndex: 'live',
      //   key: 'live',
      // },
      {
        title: '平均值',
        dataIndex: 'avg',
        // key: 'avg',
      },
      {
        title: '最小值',
        dataIndex: 'min',
        // key: 'min',
      },
      {
        title: '最大值',
        dataIndex: 'max',
        // key: 'max',
      },
    ];
    return (
      <div>
        <div className={styles.timeDiff}>
          <span>时差</span>
          <span>{this.getDiff()}</span>
        </div>
        <Table
          rowKey="key"
          pagination={false}
          columns={columns}
          dataSource={data}
          rowSelection={rowSelection}
          scroll={{ y: 400 }}
        />
      </div>
    );
  }
}

export default StatisticsList;
