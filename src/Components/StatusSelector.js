import React from 'react';
import '../App.css';
import { Select } from 'antd';

const { Option } = Select;

class StatusSelector extends React.PureComponent {
  onChange = value => {
    this.props.handleClickParent(value);
  };

  onSearch = val => {
    console.log('search:', val);
  };

  render() {
    return (
      <Select
        value={this.props.status}
        showSearch
        style={{ width: 300 }}
        placeholder='Set a status'
        optionFilterProp='children'
        onChange={this.onChange}
        onSearch={this.onSearch}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value='On track'>On track</Option>
        <Option value='At risk'>At risk</Option>
        <Option value='Off track'>Off track</Option>
      </Select>
    );
  }
}

export default StatusSelector;
