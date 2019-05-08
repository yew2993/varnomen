let Parse = require("./Parse");
let Build = require("./Build");
module.exports = function (mut) {
  return Parse(mut).then(Build)
}