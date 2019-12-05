import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { connect } from 'react-redux';

import List from './List';
import Calendar from './MyCalendar';
import Conversations from './Conversations';
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
        this.props.saveusers(data.user);
      });
    fetch(`http://localhost:3000/projects/`)
      .then(response => response.json())
      .then(data => {
        //console.log('Dans mon fetch: Get Projects-->', data);
        this.setState({ projects: data.project });
        this.props.saveprojects(data.project);
      });
    document.getElementById('myTasks').click();
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
            <div className='logo'>
              <img
                src='/images/PeeM_Logo.png'
                alt='Logo'
                width='30'
                height='30'
              />
            </div>

            <Menu
              theme='dark'
              mode='horizontal'
              defaultSelectedKeys={['1']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key='1'>
                <Link to='/HomePage/List'>
                  <Icon type='unordered-list' />
                  <span>List</span>
                </Link>
              </Menu.Item>
              <Menu.Item key='2'>
                <Link to='/HomePage/Calendar'>
                  <Icon type='calendar' />
                  <span>Calendar</span>
                </Link>
              </Menu.Item>
              <Menu.Item key='3'>
                <Link to='/HomePage/Conversation'>
                  <Icon type='message' />
                  <span>Conversation</span>
                </Link>
              </Menu.Item>
              <Menu.Item key='4'>
                <Link to='/HomePage/Progress'>
                  <Icon type='area-chart' />
                  <span>Progress</span>
                </Link>
              </Menu.Item>
              <SubMenu
                key='5'
                title={<Icon type='plus-circle' style={{ fontSize: '18px' }} />}
              >
                <Menu.Item key='6'>Project</Menu.Item>
                <Menu.Item key='7'>Task</Menu.Item>
                <Menu.Item key='8'>Conversation</Menu.Item>
                <Menu.Item key='9'>Status</Menu.Item>
              </SubMenu>
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
                  <Link id='myTasks' to={linkUserLogged}>
                    <Icon type='dashboard' />
                    <span>My tasks</span>
                  </Link>
                </Menu.Item>
                <SubMenu
                  key='sub1'
                  title={
                    <span>
                      <Icon type='project' />
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
                    component={Conversations}
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

function mapDispatchToProps(dispatch) {
  return {
    saveusers: function(users) {
      console.log('Nav - mapDispatchToProps - Users', users);
      dispatch({ type: 'saveusers', users });
    },
    saveprojects: function(projects) {
      console.log('Nav - mapDispatchToProps - Projects', projects);
      dispatch({ type: 'saveprojects', projects });
    }
  };
}

function mapStateToProps(state) {
  console.log('Nav reducer : ', state.appli);

  return { appliFromStore: state.appli };
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
