export default function(appli = [], action) {
  if (
    action.type === 'signin' ||
    action.type === 'saveusers' ||
    action.type === 'saveprojects' ||
    action.type === 'savesections'
  ) {
    console.log('Dans mon reducer --->', action);
    var appliCopy = [...appli];
    appliCopy.push(action);
    return appliCopy;
  } else {
    return appli;
  }
}
