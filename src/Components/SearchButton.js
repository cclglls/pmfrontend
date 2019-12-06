import React, { Component } from 'react';
import '../App.css';
import { Input, Button} from 'antd';



class SearchButton extends Component {

    constructor(props){
        super(props)
        this.HandleSearch = this.HandleSearch.bind(this)
        this.state = {
        search: '',
        }
    }

    //fonction qui gere le clic sur le bouton loupe
    HandleSearch() {
        console.log("clic bouton search détécté")
        console.log("state ---> ", this.state.search)
    }

    render() {
        return (
            <div>
                <Input
                    onChange={(e) => this.setState({search: e.target.value})}
                    placeholder="Search"
                    style={{width : "150px", marginRight : "1em"}}
                   
                />
   
                <Button  onClick={this.HandleSearch} type="link" icon="search" />
                
                
            </div>
        );
    }
}

export default SearchButton;



   