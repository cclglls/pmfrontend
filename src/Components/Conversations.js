import React from 'react';
import '../App.css';
import { Card } from 'antd';
import { connect } from 'react-redux';
import Conversation from './Conversation';
import UpdateConv from './UpdateConv';
var functions = require('../javascripts/functions');
var retrieveidproject = functions.retrieveidproject;

var imgSrc = "/images/chat.png"

class Conversations extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      conversations: []
    };
  }

  refreshConversation = () => {
    var idproject = this.props.idprojectFromStore;

    if (idproject && idproject !== '0' && idproject !== this.state.idproject) {
      fetch(`http://localhost:3000/conversations/${idproject}/0`)
        .then(response => response.json())
        .then(data => {
          this.setState({ conversations: data.conversation, idproject });
        });
    }
  };

  handleConversation = value => {};

  handleName = (idconversation, name) => {
    /* A ecrire */
    var newconversations = this.state.conversations.map(conversation => {
      if (conversation._id === idconversation) {
        conversation.name = name;
      }
      return conversation;
    });
    this.setState({ conversations: newconversations });
  };

  componentDidMount() {
    //console.log('Conversation - componentDidMount');
    this.refreshConversation();
  }

  componentDidUpdate() {
    //console.log('Conversation - componentDidUpdate');
    this.refreshConversation();
  }

 

  render() {
    var conversationList = [];
    var title = [];

    for (var i = 0; i < this.state.conversations.length; i++) {
      var conversation = this.state.conversations[i];

      title = [
        <div style={{display: 'flex', flexDirection: 'row',alignItems: 'center'}}>
          <img src={imgSrc} width="20" height="20" alt="status"/>
          <p style={{margin: 10}}>{conversation.name}</p>
        </div>
       ]

      conversationList.push(
        <div key={i} style={{ background: '#ECECEC', padding: '30px' }}>
          <Card
            title={title}
            bordered={false}
            style={{ width: 600 }}
          >
            <UpdateConv
              handleClickParent={this.handleName}
              idconversation={conversation._id}
            />
            <Conversation
              idconversation={conversation._id}
              savecommentsInDb='true'
              comments={conversation.comment}
              handleClickParent={this.handleConversation}
            />
          </Card>
        </div>
      );
    }

    if (conversationList.length === 0) {
      if (this.state.idproject)
        conversationList.push(<h1 key='0'>No conversation available</h1>);
      else
        conversationList.push(
          <h1 key='0' style={{ color: 'red' }}>
            Select a project ...
          </h1>
        );
    }

    return <div>{conversationList}</div>;
  }
}

function mapStateToProps(state) {
  //console.log('Conversation - mapStateToProps : ', state.appli);

  return { idprojectFromStore: retrieveidproject(state) };
}

export default connect(mapStateToProps, null)(Conversations);
