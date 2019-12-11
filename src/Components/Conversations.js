import React, { Component } from 'react';
import '../App.css';
import { Card } from 'antd';
import { connect } from 'react-redux';
import Conversation from './Conversation';

class Conversations extends Component {
  constructor() {
    super();
    this.state = {
      conversations: []
    };
  }

  refreshConversation = () => {
    var idproject;
    if (this.props.appliFromStore) {
      var action = this.props.appliFromStore.find(
        action => action.type === 'savesections'
      );
      idproject = action.finalData.idproject;
    }

    if (idproject && idproject !== '0' && idproject !== this.state.idproject) {
      console.log('idproject', idproject);

      fetch(`http://localhost:3000/conversations/${idproject}`)
        .then(response => response.json())
        .then(data => {
          console.log('Dans mon fetch: Get Conversations-->', data);
          this.setState({ conversations: data.conversation, idproject });
        });
    }
  };

  componentDidMount() {
    console.log('Conversation componentDidMount');
    this.refreshConversation();
  }

  componentDidUpdate() {
    console.log('Conversation componentDidUpdate');
    this.refreshConversation();
  }

  render() {
    var conversationList = [];

    console.log('Conversation render');

    for (var i = 0; i < this.state.conversations.length; i++) {
      var conversation = this.state.conversations[i];

      console.log('comments', conversation.comment);

      conversationList.push(
        <div key={i} style={{ background: '#ECECEC', padding: '30px' }}>
          <Card
            title={conversation.name}
            bordered={false}
            style={{ width: 600 }}
          >
            <Conversation comments={conversation.comment} />
          </Card>
        </div>
      );
    }

    if (conversationList.length === 0) {
      conversationList.push(<h1 key='0'>No conversation available</h1>);
    }

    return <div>{conversationList}</div>;
  }
}

function mapStateToProps(state) {
  console.log('Conversation reducer : ', state.appli);

  return { appliFromStore: state.appli };
}

export default connect(mapStateToProps, null)(Conversations);
