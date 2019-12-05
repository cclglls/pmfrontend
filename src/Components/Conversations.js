import React, { Component } from 'react';
import '../App.css';
import { Card } from 'antd';
import Conversation from './Conversation';

class Conversations extends Component {
  constructor() {
    super();
    this.state = {
      conversations: []
    };
  }

  componentDidMount() {
    console.log('Conversation componentDidMount');

    fetch(`http://localhost:3000/conversations`)
      .then(response => response.json())
      .then(data => {
        console.log('Dans mon fetch: Get Conversations-->', data);
        this.setState({ conversations: data.conversation });
      });
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

export default Conversations;
