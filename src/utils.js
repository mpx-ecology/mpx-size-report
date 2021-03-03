

exports.defaultTitle = function () {
  const time = new Date();
  const year = time.getFullYear();
  const month = MONTHS[time.getMonth()];
  const day = time.getDate();
  const hour = `0${time.getHours()}`.slice(-2);
  const minute = `0${time.getMinutes()}`.slice(-2);

  const currentTime = `${day} ${month} ${year} at ${hour}:${minute}`;

  return `${process.env.npm_package_name || 'Mpx Size Report'} [${currentTime}]`;
};
