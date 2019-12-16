import React from 'react';
import '../App.css';
import { Select } from 'antd';
import { connect } from 'react-redux';

var functions = require('../javascripts/functions');
var retrieveprojects = functions.retrieveprojects;

const { Option } = Select;

function onBlur(e) {
  console.log('blur');
}

function onSearch(val) {
  console.log('search:', val);
}

class ProjectSelector extends React.Component {
  constructor(props) {
    super();
    this.state = {
      projects: []
    };
    this.onChange = this.onChange.bind(this);
  }

  // fonction qui à attribuer les projets
  onChange(value, e) {
    this.props.handleClickParent(value, e.key);
  }

  componentDidMount() {
    //console.log('ProjectSelector - componentDidMount');

    if (this.props.projectsFromStore) {
      this.setState({
        projects: this.props.projectsFromStore
      });
    }
  }

  render() {
    var projects = this.state.projects;
    var optionList = [];
    for (var i = 0; i < projects.length; i++) {
      optionList.push(
        <Option key={projects[i]._id} value={projects[i].name}>
          {projects[i].name}
        </Option>
      );
    }

    var style = { width: 300 };
    if (this.props.error && this.props.error.indexOf('Project') >= 0)
      style.border = '1px solid #FF524F';

    return (
      <Select
        value={this.props.projectname}
        showSearch
        style={style}
        placeholder='Select a project'
        optionFilterProp='children'
        onChange={this.onChange}
        onBlur={onBlur}
        onSearch={onSearch}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {optionList}
      </Select>
    );
  }
}

function mapStateToProps(state) {
  //console.log('Project - mapStateToProps : ', state.appli);

  return { projectsFromStore: retrieveprojects(state) };
}

export default connect(mapStateToProps, null)(ProjectSelector);
