const formatDate = date => {
  var dt = new Date(date);
  var month = dt.getMonth() + 1;
  return dt.getDate() + '/' + month + '/' + dt.getFullYear();
};

module.exports = formatDate;
