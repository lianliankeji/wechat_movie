//时间戳转成日期

export const timeformat = (timestamp,types) => {
  var now = new Date(timestamp);
  
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();

  if (types == "YYYY/MM/DD") {
    return year + "/" + month + "/" + date;  
  }

  if (types == "YYYY/MM/DD HH:MM:SS") {
    return year + "/" + month + "/" + date + "   " + hour + ":" + minute + ":" + second;  
  }
  
}