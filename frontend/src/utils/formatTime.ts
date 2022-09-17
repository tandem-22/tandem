export const formatTime = (date: Date) => {
  var hours = date.getHours();
  let minutes = date.getMinutes();
  var suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  // @ts-ignore
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + suffix;
  return strTime;
};
