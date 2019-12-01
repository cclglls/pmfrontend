import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { connect } from 'react-redux';

import List from './List';
import Calendar from './MyCalendar';
import Conversation from './Conversation';
import Progress from './Progress';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;

class Nav extends Component {
  constructor() {
    super();
    this.state = {
      collapsed: false,
      users: [],
      projects: []
    };
  }

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  componentDidMount() {
    console.log('componentDidMount');

    fetch(`http://localhost:3000/users/`)
      .then(response => response.json())
      .then(data => {
        //console.log('Dans mon fetch: Get Users-->', data);
        this.setState({ users: data.user });
      });
    fetch(`http://localhost:3000/projects/`)
      .then(response => response.json())
      .then(data => {
        //console.log('Dans mon fetch: Get Projects-->', data);
        this.setState({ projects: data.project });
      });
  }

  render() {
    var projects = this.state.projects;

    var projectList = [];
    for (var i = 0; i < projects.length; i++) {
      projectList.push(
        <Menu.Item key={projects[i]._id}>
          <Link to={`/HomePage/List/${projects[i]._id}`}>
            {projects[i].name}
          </Link>
        </Menu.Item>
      );
    }

    var users = this.state.users;
    var userList = [];
    for (i = 0; i < users.length; i++) {
      userList.push(
        <Menu.Item key={users[i]._id}>
          <Link to={`/HomePage/List/0/${users[i]._id}`}>
            {users[i].initials}
          </Link>
        </Menu.Item>
      );
    }

    var linkUserLogged = '/HomePage/List/';
    if (this.props.appliFromStore) {
      if (this.props.appliFromStore[0]) {
        linkUserLogged = `/HomePage/List/0/${this.props.appliFromStore[0].user._id}`;
      }
    }

    return (
      <Router basename='/'>
        <Layout>
          <Header className='header'>
            <div className='logo' />
            <Menu
              theme='dark'
              mode='horizontal'
              defaultSelectedKeys={['1']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key='1'>
                <Link to='/HomePage/List'>List</Link>
              </Menu.Item>
              <Menu.Item key='2'>
                <Link to='/HomePage/Calendar'>Calendar</Link>
              </Menu.Item>
              <Menu.Item key='3'>
                <Link to='/HomePage/Conversation'>Conversation</Link>
              </Menu.Item>
              <Menu.Item key='4'>
                <Link to='/HomePage/Progress'>Progress</Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Layout style={{ minHeight: '100vh' }}>
            <Sider
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse}
            >
              <div className='logo' />
              <Menu theme='dark' defaultSelectedKeys={['1']} mode='inline'>
                <Menu.Item key='1'>
                  <Link to={linkUserLogged}>
                    <Icon type='desktop' />
                    <span>My tasks</span>
                  </Link>
                </Menu.Item>
                <SubMenu
                  key='sub1'
                  title={
                    <span>
                      <Icon type='team' />
                      <span>Project</span>
                    </span>
                  }
                >
                  {projectList}
                </SubMenu>
                <SubMenu
                  key='sub2'
                  title={
                    <span>
                      <Icon type='user' />
                      <span>User</span>
                    </span>
                  }
                >
                  {userList}
                </SubMenu>
              </Menu>
            </Sider>
            <Layout>
              <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>User</Breadcrumb.Item>
                  <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <Switch>
                  <Route path='/HomePage/List' exact component={List} />
                  <Route
                    path='/HomePage/List/:idproject'
                    exact
                    component={List}
                  />
                  <Route
                    path='/HomePage/List/:idproject/:iduser'
                    component={List}
                  />
                  <Route path='/HomePage/Calendar' component={Calendar} />
                  <Route
                    path='/HomePage/Conversation'
                    component={Conversation}
                  />
                  <Route path='/HomePage/Progress' component={Progress} />
                </Switch>
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                PeeM ©2019 Created by Cecile and Gilles
              </Footer>
            </Layout>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  console.log('je recois de mon reducer : ', state.appli);

  return { appliFromStore: state.appli };
}

export default connect(mapStateToProps, null)(Nav);