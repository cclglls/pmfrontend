import React, { Component } from 'react';
import '../App.css';
import { Card } from 'antd';

class List extends Component {
  constructor() {
    super();
    this.state = {
      sections: []
    };
  }

  componentDidMount() {
    console.log(
      'List - componentDidMount: props de ma page List --> ',
      this.props.match.params
    );

    fetch(`http://localhost:3000/workspace/5de236e8f407761f2c36d06f`)
      .then(response => response.json())
      .then(data => {
        console.log('Dans mon fetch: Get Sections-->', data);
        this.setState({ sections: data.section });
      });
  }

  render() {
    var sections = this.state.sections;
    //console.log('sections', sections);

    var sectionList = [];
    var taskList;
    var tasks;
    if (sections) {
      for (var i = 0; i < sections.length; i++) {
        tasks = sections[i].task;
        taskList = [];
        for (var j = 0; j < tasks.length; j++) {
          taskList.push(
            <Card style={{ marginTop: 16 }} type='inner' key={tasks[j]._id}>
              {tasks[j].name}
            </Card>
          );
        }
        sectionList.push(
          <Card title={sections[i].name} key={sections[i]._id}>
            {taskList}
          </Card>
        );
      }
    } else {
      sectionList.push(
        <Card title='Section title'>
          <Card style={{ marginTop: 16 }} type='inner'>
            Task name
          </Card>
        </Card>
      );
    }

    //console.log('SectionList ---->', sectionList);

    return <div>{sectionList}</div>;
  }
}

export default List;
