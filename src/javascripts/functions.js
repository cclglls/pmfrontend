const formatDate = date => {
  if (date) {
    var dt = new Date(date);
    var month = dt.getMonth() + 1;
    var z = dt.getFullYear() + '-' + month + '-';
    if (dt.getDate() < 10) z = z + '0' + dt.getDate();
    else z = z + dt.getDate();
    return z;
  } else {
    return '';
  }
};

const retrievetaskList = state => {
  var finalData;
  var taskList;
  if (state.appli) {
    var action = state.appli.find(action => action.type === 'savesections');
    if (action) finalData = action.finalData;
  }
  if (finalData) taskList = finalData.taskList;
  return taskList;
};

const retrieveuser = state => {
  var user;
  if (state.appli) {
    var action = state.appli.find(action => action.type === 'signin');
    if (action) user = action.user;
  }
  return user;
};

const retrieveusers = state => {
  var users;
  if (state.appli) {
    var action = state.appli.find(action => action.type === 'saveusers');
    if (action) users = action.users;
  }
  return users;
};

const retrieveidproject = state => {
  var idproject;
  if (state.appli) {
    var action = state.appli.find(action => action.type === 'savesections');
    if (action) idproject = action.finalData.idproject;
  }
  return idproject;
};

const retrieveprojects = state => {
  var projects;
  if (state.appli) {
    var action = state.appli.find(action => action.type === 'saveprojects');
    if (action) projects = action.projects;
  }
  return projects;
};

const retrieverefreshTasks = state => {
  var refreshTasks = false;
  if (state.appli) {
    var action = state.appli.find(action => action.type === 'refreshtasks');
    if (action) {
      refreshTasks = action.refreshTasks;
    }
  }
  return refreshTasks;
};

module.exports = {
  formatDate,
  retrievetaskList,
  retrieveuser,
  retrieveusers,
  retrieveidproject,
  retrieveprojects,
  retrieverefreshTasks
};
