import React from 'react';
import '../App.css';
import { connect } from 'react-redux';

import { Comment, Avatar, Form, Button, List, Input } from 'antd';
import moment from 'moment';

var functions = require('../javascripts/functions');
var retrieveuser = functions.retrieveuser;

const { TextArea } = Input;
const empty = {
  emptyText: 'No comment'
};

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    locale={empty}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
    itemLayout='horizontal'
    renderItem={props => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType='submit'
        loading={submitting}
        onClick={onSubmit}
        type='primary'
      >
        Add Comment
      </Button>
    </Form.Item>
  </div>
);

class Conversation extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      comments: [],
      commentsForDb: [],
      submitting: false,
      value: ''
    };
  }

  handleSubmit = () => {
    if (!this.state.value) {
      return;
    }

    this.setState({
      submitting: true
    });

    setTimeout(() => {
      this.setState({
        submitting: false,
        value: '',
        comments: [
          {
            author: this.props.userFromStore.initials,
            avatar:
              'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: <p>{this.state.value}</p>,
            datetime: moment().fromNow(),
            idcomment: '0',
            comment: this.state.value
          },
          ...this.state.comments
        ]
      });
      var comments = [];

      if (this.state.comments) {
        for (var i = 0; i < this.state.comments.length; i++) {
          var _id = '0';
          if (this.state.comments[i].idcomment)
            _id = this.state.comments[i].idcomment;
          var comment = this.state.comments[i].comment;
          comments.push({
            _id,
            comment
          });
        }
      }
      this.setState({ commentsForDb: comments });
      this.props.handleClickParent(comments);
    }, 500);
  };

  handleChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  refreshcomments = () => {
    /*
    console.log(
      'refreshcomments',
      this.props.idconversation,
      this.state.idconversation
    );
    */
    if (this.props.idconversation !== this.state.idconversation) {
      var comments = [];
      if (this.props.comments)
        for (var i = 0; i < this.props.comments.length; i++) {
          var comment = this.props.comments[i];
          var author;
          if (this.props.userFromStore)
            author = this.props.userFromStore.initials;
          comments.push({
            author: author,
            avatar:
              'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: <p>{comment.comment}</p>,
            datetime: moment(comment.event[0].dtevent).fromNow(),
            idcomment: comment._id,
            comment: comment.comment
          });
        }

      this.setState({
        idconversation: this.props.idconversation,
        comments,
        commentsForDb: this.props.comments
      });
    }
  };

  componentDidMount() {
    //console.log('Conversation - componentDidMount');
    this.refreshcomments();
  }

  componentDidUpdate() {
    //console.log('Conversation - componentDidMount');
    this.refreshcomments();
  }

  async componentWillUnmount() {
    /* Save Conversation in DB */
    /*console.log(
      'Conversations - componentWillUnmount',
      this.props.idconversation,
      this.state
    );*/
    var comments;

    if (
      this.props.savecommentsInDb === 'true' &&
      this.state.commentsForDb &&
      this.state.commentsForDb.length > 0
    )
      comments = this.state.commentsForDb;

    if (comments) {
      var body = {
        comment: comments
      };

      try {
        var response = await fetch(
          `http://localhost:3000/conversations/conversation/${this.props.idconversation}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          }
        );

        console.log('response', response);
      } catch (error) {
        console.log(error);
      }
    }
  }

  render() {
    const { comments, submitting, value } = this.state;

    return (
      <div>
        {<CommentList comments={comments} />}
        <Comment
          avatar={
            <Avatar
              src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
              alt='avatar'
            />
          }
          content={
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={value}
            />
          }
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  //console.log('Conversation - mapStateToProps : ', state.appli);

  return { userFromStore: retrieveuser(state) };
}

export default connect(mapStateToProps, null)(Conversation);
