export default function(appli = [], action) {
  if (
    action.type === 'signin' ||
    action.type === 'saveusers' ||
    action.type === 'saveprojects' ||
    action.type === 'savesections'
  ) {
    //console.log('Dans mon reducer --->', action);

    var appliCopy = [...appli];

    var index = appli.findIndex(a => a.type === action.type);

    if (index < 0) appliCopy.push(action);
    else appliCopy.splice(index, 1, action);

    //console.log('Dans mon reducer - appliCopy--->', appliCopy);

    return appliCopy;
  } else {
    return appli;
  }
}
