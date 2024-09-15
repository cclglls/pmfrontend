export default function(appli = [], action) {
  if (
    action.type === 'signin' ||
    action.type === 'saveusers' ||
    action.type === 'saveprojects' ||
    action.type === 'savesections' ||
    action.type === 'refreshtasks' ||
    action.type === 'searchname'    ||

    action.type === 'searchdata'
  ) {
    console.log("reducer content")
    console.log(action)
    var appliCopy = [...appli];

    var index = appli.findIndex(a => a.type === action.type);

    if (index < 0) appliCopy.push(action);
    else appliCopy.splice(index, 1, action);

    //console.log('appli.reducer', appliCopy);
    return appliCopy;
  } else {
    console.log("reducer marche pas")
    return appli;
  }
}
