import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../App.css';
import { Input, Button } from 'antd';

class SearchButton extends Component {
  constructor(props) {
    super(props);
    this.HandleSearch = this.HandleSearch.bind(this);
    this.state = {
      search: '',
      clicked: false
    };
  }

  //fonction qui gere le clic sur le bouton loupe
  HandleSearch(e) {
    this.props.searchname(this.state.search);
    this.setState({ clicked: true, search: '' });
    this.props.handleClickParent(e);
  }

  renderRedirect = () => {
    if (this.state.clicked) {
      this.setState({ clicked: false });
    }
  };

  render() {
    //console.log('Search - render');

    return (
      <div>
        <Input
          onChange={e => this.setState({ search: e.target.value })}
          value={this.state.search}
          placeholder='Search'
          style={{ width: '150px', marginRight: '1em' }}
        />
        <Button
          id='Search'
          onClick={this.HandleSearch}
          type='link'
          icon='search'
        />
        {this.renderRedirect()}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    searchname: function(name) {
      console.log('Search Button - mapDispatchToProps', name);
      dispatch({ type: 'searchname', name });
    }
  };
}

export default connect(null, mapDispatchToProps)(SearchButton);
