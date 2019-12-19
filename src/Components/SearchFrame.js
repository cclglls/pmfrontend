import React from 'react';
import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import { Table } from 'antd';
var functions = require('../javascripts/functions');
var retrievename = functions.retrievename;
var formatDate = functions.formatDate;

class SearchFrame extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    searchdata: [],
    word: ''
  };

  componentDidMount() {
    this.refreshSearchFrame();
  }

  componentDidUpdate() {
    this.refreshSearchFrame();
  }

  refreshSearchFrame = () => {
    if (
      this.props.nameFromStore &&
      this.props.nameFromStore !== this.state.word
    ) {
      console.log('dans refreshSearchFrame');
      var word;
      if (this.props.nameFromStore) word = this.props.nameFromStore;
      console.log(word);
      if (word)
        fetch(`http://localhost:3000/tasks/0/0/${word}`)
          .then(response => response.json())
          .then(data => {
            const tasks = data.task;
            console.log('searchFrame data ', tasks);

            this.setState({ searchdata: tasks, word });
            this.props.searchname('');
          });
    }
  };

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    });
  };

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null
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
        filters: [
          { text: '1', value: '1' },
          { text: '2', value: '2' }
        ],
        filteredValue: filteredInfo.name || null,
        onFilter: (value, record) => record.name.includes(value),
        sorter: (a, b) => a.name.localeCompare(b.name),
        sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        ellipsis: true
      },
      {
        title: 'Desc',
        dataIndex: 'description',
        key: 'desc',
        sorter: (a, b) => a.description.localeCompare(b.description),
        sortOrder: sortedInfo.columnKey === 'description' && sortedInfo.order,
        ellipsis: true
      },
      {
        title: 'DueDate',
        dataIndex: 'duedate',
        key: 'duedate',
        filters: [
          { text: 'Years', value: 'Years' },
          { text: 'Month', value: 'Month' }
        ],
        filteredValue: filteredInfo.duedate || null,
        onFilter: (value, record) => record.duedate.includes(value),
        sorter: (a, b) => a.duedate.localeCompare(b.duedate),
        sortOrder: sortedInfo.columnKey === 'duedate' && sortedInfo.order,
        ellipsis: true
      },
      {
        title: 'Completed',
        dataIndex: 'completed',
        key: 'completed',
        sorter: (a, b) => a.completed.localeCompare(b.completed),
        sortOrder: sortedInfo.columnKey === 'completed' && sortedInfo.order,
        ellipsis: true
      },
      {
        title: 'Assigned',
        dataIndex: 'idassignee.initials',
        key: 'assigned',
        sorter: (a, b) =>
          a.idassignee.initials.localeCompare(b.idassignee.initials),
        sortOrder:
          sortedInfo.columnKey === 'idassignee.initials' && sortedInfo.order,
        ellipsis: true
      },
      {
        title: 'Project',
        dataIndex: 'idproject.name',
        key: 'project',
        sorter: (a, b) => a.idproject.name.localeCompare(b.idproject.name),
        sortOrder:
          sortedInfo.columnKey === 'idproject.name' && sortedInfo.order,
        ellipsis: true
      }
    ];
    var searchdata = [];
    var searchdataCopy = [];
    if (this.state.searchdata) {
      searchdata = this.state.searchdata;

      var duedate;
      var data;
      for (var i = 0; i < searchdata.length; i++) {
        // Formattage de la date en YYYY-MM-JJ
        duedate = formatDate(searchdata[i].duedate);

        //  Le nouvelle objet
        data = {};
        data.name = searchdata[i].name;
        data.description = searchdata[i].description;
        data.duedate = duedate;
        if (searchdata[i].dtclosure) data.completed = 'true';
        else data.completed = 'false';
        data.idassignee = {};
        data.idassignee.initials = searchdata[i].idassignee.initials;
        data.idproject = {};
        data.idproject.name = searchdata[i].idproject.name;

        // je mets dans le tableau de nouveaux objets
        searchdataCopy.push(data);
      }
    }
    //console.log('searchdata->', searchdata);
    //console.log('searchdatacopy->', searchdataCopy);

    return (
      <div>
        <Table
          columns={columns}
          dataSource={searchdataCopy}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    searchname: function(name) {
      console.log('Search Frame - mapDispatchToProps', name);
      dispatch({ type: 'searchname', name });
    }
  };
}

function mapStateToProps(state) {
  //console.log('searchFrame, mapStatetoProps->', state);
  return { nameFromStore: retrievename(state) };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchFrame);
