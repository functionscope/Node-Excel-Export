module.exports = {getJulian, oaDate}

function getJulian (date) {
  return Math.floor((date / 86400000) - (date.getTimezoneOffset() / 1440) + 2440587.5)
}

function oaDate (date) {
  return (date - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000)
}