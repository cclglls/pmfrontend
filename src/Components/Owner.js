import React from 'react';
import '../App.css';
import { Select } from 'antd';
import { connect } from 'react-redux';

var functions = require('../javascripts/functions');
var retrieveusers = functions.retrieveusers;

const { Option } = Select;

// fonction qui gere la valeur saisie dans champ ATTENTION value en dur pour le moment
function onSearch(val) {
  console.log('search:', val);
}

class Owner extends React.Component {
  constructor(props) {
    super();
    this.state = {
      users: []
    };
    this.onChange = this.onChange.bind(this);
  }

  // fonction qui gere le noms du responsable du projet
  onChange(value, e) {
    this.props.handleClickParent(value, e.key);
  }

  componentDidMount() {
    //console.log('Owner - componentDidMount');

    var users = this.props.usersFromStore;

    if (users) {
      this.setState({
        users
      });
    }
  }

  render() {
    var users = this.state.users;
    var optionList = [];
    for (var i = 0; i < users.length; i++) {
      optionList.push(
        <Option key={users[i]._id} value={users[i].initials}>
          {users[i].initials}
        </Option>
      );
    }
    var style = { width: 100 };
    if (
      this.props.error &&
      (this.props.error.indexOf('Owner') >= 0 ||
        this.props.error.indexOf('Assignee') >= 0)
    )
      style.border = '1px solid #FF524F';

    return (
      <Select
        value={this.props.initials}
        showSearch
        style={style}
        placeholder='Select a user'
        optionFilterProp='children'
        onChange={this.onChange}
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
  //console.log('Owner - mapStateToProps : ', state.appli);

  return { usersFromStore: retrieveusers(state) };
}

export default connect(mapStateToProps, null)(Owner);
