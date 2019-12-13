const formatDate = date => {
  if (date) {
    var dt = new Date(date);
    var month = dt.getMonth() + 1;
    return dt.getFullYear() + '/' + month + '/' + dt.getDate();
  } else {
    return '';
  }
};

module.exports = formatDate;
