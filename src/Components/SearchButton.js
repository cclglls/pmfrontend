import React, { Component } from 'react';
import '../App.css';
import { Input, Button } from 'antd';
import { Redirect } from 'react-router-dom';

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
  HandleSearch() {
    console.log('clic bouton search détécté');
    console.log('state ---> ', this.state);
    this.setState({ clicked: true });
  }

  renderRedirect = () => {
    if (this.state.clicked) {
      this.setState({ clicked: false });
      return <Redirect to='/HomePage/Search' />;
    }
  };

  render() {
    console.log('Search - render');

    return (
      <div>
        <Input
          onChange={e => this.setState({ search: e.target.value })}
          placeholder='Search'
          style={{ width: '150px', marginRight: '1em' }}
        />
        <Button onClick={this.HandleSearch} type='link' icon='search' />
        {this.renderRedirect()}
      </div>
    );
  }
}

export default SearchButton;
