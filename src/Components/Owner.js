import React from 'react';
import '../App.css';
import { Select } from 'antd';
import { connect } from 'react-redux';

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

    var users;
    var appli = this.props.appliFromStore;

    if (appli) {
      for (var i = 0; i < appli.length; i++) {
        if (appli[i].type === 'saveusers') {
          users = appli[i].users;
        }
      }
    }

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
    return (
      <Select
        defaultValue={this.props.initials}
        showSearch
        style={{ width: 100 }}
        placeholder='Select a person'
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

  return { appliFromStore: state.appli };
}

export default connect(mapStateToProps, null)(Owner);
