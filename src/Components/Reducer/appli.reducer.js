export default function(appli = [], action) {
  if (
    action.type === 'signin' ||
    action.type === 'saveusers' ||
    action.type === 'saveprojects' ||
    action.type === 'savesections' ||
    action.type === 'refreshtasks' ||
    action.type === 'searchname'
  ) {
    var appliCopy = [...appli];

    var index = appli.findIndex(a => a.type === action.type);

    if (index < 0) appliCopy.push(action);
    else appliCopy.splice(index, 1, action);

    //console.log('appli.reducer', appliCopy);

    return appliCopy;
  } else {
    return appli;
  }
}
