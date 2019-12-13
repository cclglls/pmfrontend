import React from 'react';
import '../App.css';
import { Card } from 'antd';
import { connect } from 'react-redux';
import Conversation from './Conversation';

class Conversations extends React.PureComponent {
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
      fetch(`http://localhost:3000/conversations/${idproject}`)
        .then(response => response.json())
        .then(data => {
          this.setState({ conversations: data.conversation, idproject });
        });
    }
  };

  handleConversation = value => {};

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

    for (var i = 0; i < this.state.conversations.length; i++) {
      var conversation = this.state.conversations[i];

      conversationList.push(
        <div key={i} style={{ background: '#ECECEC', padding: '30px' }}>
          <Card
            title={conversation.name}
            bordered={false}
            style={{ width: 600 }}
          >
            <Conversation
              idconversation={conversation._id}
              comments={conversation.comment}
              handleClickParent={this.handleConversation}
            />
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
  //console.log('Conversation - mapStateToProps : ', state.appli);

  return { appliFromStore: state.appli };
}

export default connect(mapStateToProps, null)(Conversations);
