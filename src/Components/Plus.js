import React from 'react';
import '../App.css';
import { Menu, Dropdown,Icon, Button } from 'antd';

import Project from './Project'
import Conversation from './Conversation'
import NewStatus from './NewStatus'
import NewTask from './NewTask'

const menu = (
    <Menu>
      <Menu.Item>
        <div className="icone-plus">
          <Icon type="project" />
          <Project/>
        </div>
      </Menu.Item>

      <Menu.Item>
        <NewTask/>
      </Menu.Item>

      <Menu.Item>
        <Conversation/>
      </Menu.Item>

      <Menu.Item>
        <NewStatus/>
      </Menu.Item>
      
    </Menu>
  );


class Plus extends React.Component {
    render() {
        return (
            <div>
              <Dropdown overlay={menu} placement="bottomCenter">
                <Button type="link"><Icon type="plus-circle" /></Button>
            </Dropdown>
            </div>
        );
    }
}

export default Plus;
