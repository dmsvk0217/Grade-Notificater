function printAPILog(name) {
  console.log("[%s] %s", getTime(), name);
}

function getTime() {
  var today = new Date();

  var hours = ("0" + today.getHours()).slice(-2);
  var minutes = ("0" + today.getMinutes()).slice(-2);
  var seconds = ("0" + today.getSeconds()).slice(-2);
  var timeString = hours + ":" + minutes + ":" + seconds;

  return timeString;
}

exports.printAPILog = printAPILog;
exports.getTime = getTime;
