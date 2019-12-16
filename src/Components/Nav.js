import React, { Component } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { connect } from 'react-redux';

import List from './List';
import Calendar from './MyCalendar';
import Conversations from './Conversations';
import NewConversation from './NewConversation';
import SearchButton from './SearchButton';
import Project from './Project';
import NewTask from './NewTask';
import Progress from './Progress';
import NewStatus from './NewStatus';
import Search from './Search';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

var functions = require('../javascripts/functions');
var retrieveuser = functions.retrieveuser;
var retrieveprojects = functions.retrieveprojects;

const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;

async function datatest() {
  //console.log(' **** datatest deb ******');
  try {
    var response = await fetch(`http://localhost:3000/users`);
    var data = await response.json();
    var user = data.user;
    //console.log('user', user[0]);
    var userId = user[0]._id;

    response = await fetch(`http://localhost:3000/projects`);
    data = await response.json();
    //console.log('*****data projects******', data);
    if (data.project.length !== 0) return true;

    /* create one project */
    var body = {
      name: 'Project 1',
      description: 'Project 1',
      dtdeb: '2019-12-01',
      duedate: '2019-12-20',
      idowner: userId,
      iduser: userId
    };

    response = await fetch('http://localhost:3000/projects/project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    data = await response.json();
    //console.log('***** data project ******', data);
    var project = data.project;

    /* create tasks linked to the project */
    for (var i = 1; i < 6; i++) {
      body = {
        name: project.name + ' - Task ' + i,
        description: project.name + ' - Task ' + i,
        dtdeb: '2019-12-01',
        duedate: '2019-12-0' + i,
        idassignee: userId,
        idproject: project._id,
        iduser: userId
      };

      response = await fetch('http://localhost:3000/tasks/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      data = await response.json();
      //console.log('***** data task ******', data);
    }

    /* Create conversations on the project */
    for (i = 1; i < 3; i++) {
      var z = 'First comment on: ' + project.name + ' - Conversation ' + i;
      body = {
        name: project.name + ' - Conversation ' + i,
        type: 'conversation',
        idproject: project._id,
        comment: [{ _id: '0', comment: z }],
        iduser: userId
      };

      response = await fetch(
        'http://localhost:3000/conversations/conversation',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }
      );

      data = await response.json();
      //console.log('***** data conversation ******', data);
    }

    /* create status on the project */
    for (i = 4; i < 6; i++) {
      z = 'First comment on: ' + project.name + ' - Status ' + i;
      body = {
        dtstatus: '2019-12-0' + i,
        status: 'On track',
        type: 'status',
        idproject: project._id,
        comment: [{ _id: '0', comment: z }],
        iduser: userId
      };

      response = await fetch('http://localhost:3000/status/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      data = await response.json();
      //console.log('***** data status ******', data);
    }

    //console.log(' **** datatest fin ******');
    return { res: true, msg: 'BD created' };
  } catch (error) {
    console.log(error);
    return { res: false, msg: error };
  }
}

class Nav extends Component {
  constructor() {
    super();
    this.state = {
      collapsed: false,
      users: [],
      projects: [],
      breadcrumb: <Breadcrumb style={{ margin: '16px 8px' }}></Breadcrumb>
    };
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  onClick = e => {
    //console.log('e.target', e.target.id);

    var context;

    var idproject;
    if (e.target.id.indexOf('Project') >= 0) {
      context = 'Project';
      idproject = e.target.id.slice(8);
    }

    var iduser;
    if (e.target.id.indexOf('User') >= 0) {
      context = 'User';
      iduser = e.target.id.slice(5);
    }

    if (e.target.id.indexOf('myTasks') >= 0) {
      context = 'myTasks';
    }

    if (e.target.id.indexOf('Search') >= 0) {
      context = 'Search';
    }

    var breadcrumb;
    if (idproject) {
      breadcrumb = (
        <div className='project'>
          <Breadcrumb style={{ margin: '16px 0px' }}>
            <Breadcrumb.Item>{context}</Breadcrumb.Item>
            <Breadcrumb.Item>{e.target.textContent}</Breadcrumb.Item>
          </Breadcrumb>
          <Project text='...' idproject={idproject} />
        </div>
      );
    } else if (iduser) {
      breadcrumb = (
        <Breadcrumb style={{ margin: '16px 0px' }}>
          <Breadcrumb.Item>{context}</Breadcrumb.Item>
          <Breadcrumb.Item>{e.target.textContent}</Breadcrumb.Item>
        </Breadcrumb>
      );
    } else {
      breadcrumb = (
        <Breadcrumb style={{ margin: '16px 0px' }}>
          <Breadcrumb.Item>{context}</Breadcrumb.Item>
        </Breadcrumb>
      );
    }

    this.setState({ breadcrumb });

    if (context === 'Search') document.getElementById('Search').click();
    else document.getElementById('List').click();
  };

  componentDidMount() {
    //console.log('Nav - componentDidMount');

    datatest();

    fetch(`http://localhost:3000/users/`)
      .then(response => response.json())
      .then(data => {
        this.setState({ users: data.user });
        this.props.saveusers(data.user);
      });
    fetch(`http://localhost:3000/projects/`)
      .then(response => response.json())
      .then(data => {
        this.setState({ projects: data.project });
        this.props.saveprojects(data.project);
      });
    document.getElementById('myTasks').click();
  }

  componentDidUpdate() {
    var projects = this.props.projectsFromStore;
    if (projects && projects !== this.state.projects)
      this.setState({ projects });
  }

  render() {
    var projects = this.state.projects;

    var projectList = [];
    for (var i = 0; i < projects.length; i++) {
      projectList.push(
        <Menu.Item key={projects[i]._id}>
          <Link
            onClick={this.onClick}
            id={`Project ${projects[i]._id}`}
            to={`/HomePage/List/${projects[i]._id}`}
          >
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
          <Link
            onClick={this.onClick}
            id={`User ${users[i]._id}`}
            to={`/HomePage/List/0/${users[i]._id}`}
          >
            {users[i].initials}
          </Link>
        </Menu.Item>
      );
    }

    var linkUserLogged = '/HomePage/List/';
    if (this.props.userFromStore)
      linkUserLogged = `/HomePage/List/0/${this.props.userFromStore._id}`;

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
                <Link id='List' to='#'>
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
              <Menu.Item key='searchButton'>
                <Link id='Search' to='/HomePage/Search'>
                  <SearchButton handleClickParent={this.onClick} />
                </Link>
              </Menu.Item>
              <SubMenu key='5' title={<Icon type='plus-circle' />}>
                <Menu.Item key='6'>
                  <div className='icone-plus'>
                    <Icon type='project' />
                    <Project text='Project' />
                  </div>
                </Menu.Item>
                <Menu.Item key='7'>
                  <div className='icone-plus'>
                    <Icon type='dashboard' />
                    <NewTask text='Task' />
                  </div>
                </Menu.Item>
                <Menu.Item key='8'>
                  <div className='icone-plus'>
                    <Icon type='message' />
                    <NewConversation />
                  </div>
                </Menu.Item>
                <Menu.Item key='9'>
                  <div className='icone-plus'>
                    <Icon type='area-chart' />
                    <NewStatus />
                  </div>
                </Menu.Item>
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
                  <Link onClick={this.onClick} id='myTasks' to={linkUserLogged}>
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
                <span>{this.state.breadcrumb}</span>
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
                  <Route path='/HomePage/Search' component={Search} />
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
      //console.log('Nav - mapDispatchToProps - Users', users);
      dispatch({ type: 'saveusers', users });
    },
    saveprojects: function(projects) {
      //console.log('Nav - mapDispatchToProps - Projects', projects);
      dispatch({ type: 'saveprojects', projects });
    }
  };
}

function mapStateToProps(state) {
  //console.log('Nav reducer : ', state.appli);

  return {
    projectsFromStore: retrieveprojects(state),
    userFromStore: retrieveuser(state)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
