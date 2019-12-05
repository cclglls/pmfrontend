const formatDate = date => {
  var dt = new Date(date);
  return dt.getDate() + '/' + dt.getMonth() + '/' + dt.getFullYear();
};

module.exports = formatDate;
