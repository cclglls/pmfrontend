
import React from 'react';
import 'antd/dist/antd.css';

import { Table, Button } from 'antd';

const data = [
  {
    key: '1',
    name: 'Launch timeline',
    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    dueDate: '2019-12-13',
    completed: 'true',
    assigned: 'Cécile',
    project: 'project-3'
  },
  {
    key: '2',
    name: 'Create new page',
    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    dueDate: '2019-12-15',
    completed: 'true',
    assigned: 'Gilles',
    project: 'project-1'
  },
  {
    key: '3',
    name: 'Branding guidelines',
    desc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    dueDate: '2019-12-16',
    completed: 'false',
    assigned: 'Anna',
    project: 'project-2'
  },
  
];

class SearchFrame extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
  };

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };

  setDescSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'desc',
      },
    });
  };

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        filters: [{ text: 'Joe', value: 'Joe' }, { text: 'Jim', value: 'Jim' }],
        filteredValue: filteredInfo.name || null,
        onFilter: (value, record) => record.name.includes(value),
        sorter: (a, b) => a.name.length - b.name.length,
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: 'Desc',
        dataIndex: 'desc',
        key: 'desc',
        sorter: (a, b) => a.desc - b.desc,
        sortOrder: sortedInfo.columnKey === 'desc' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: 'DueDate',
        dataIndex: 'dueDate',
        key: 'dueDate',
        filters: [{ text: 'Years', value: 'Years' }, { text: 'Month', value: 'Month' }],
        filteredValue: filteredInfo.DueDate || null,
        onFilter: (value, record) => record.DueDate.includes(value),
        sorter: (a, b) => a.DueDate - b.DueDate,
        sortOrder: sortedInfo.columnKey === 'dueDate' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: 'Completed',
        dataIndex: 'completed',
        key: 'completed',
        sorter: (a, b) => a.completed.length - b.completed.length,
        sortOrder: sortedInfo.columnKey === 'completed' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: 'Assigned',
        dataIndex: 'assigned',
        key: 'assigned',
        sorter: (a, b) => a.assigned.length - b.assigned.length,
        sortOrder: sortedInfo.columnKey === 'assigned' && sortedInfo.order,
        ellipsis: true,
      },
      {
        title: 'Project',
        dataIndex: 'project',
        key: 'project',
        sorter: (a, b) => a.project.length - b.project.length,
        sortOrder: sortedInfo.columnKey === 'project' && sortedInfo.order,
        ellipsis: true,
      }
    ];
    return (
      <div>
        <div className="table-operations">
          <Button onClick={this.setDescSort}>Sort Desc</Button>
          <Button onClick={this.clearFilters}>Clear filters</Button>
          <Button onClick={this.clearAll}>Clear filters and sorters</Button>
        </div>
        <Table columns={columns} dataSource={data} onChange={this.handleChange} />
      </div>
    );
  }
}

export default SearchFrame;
          