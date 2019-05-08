const xre = require("xregexp");
const validate = require("./validate")

const {
  position, openParens, closeParens
} = require("./constants")

function getOpenCaptureGroupRegex(prefix="") {
  if (typeof prefix !== "string") throw new Error("Error in getOpenCaptureGroupRegex: parameter must be a string or omitted.")
  return new RegExp(`\\(\\?\\<${prefix}`, "g");
}
const openCaptureGroup = getOpenCaptureGroupRegex();
const openCaptureGroupInterval = getOpenCaptureGroupRegex("i_")

const interval = `
  (?<i_open>   ${openParens})?
  ${position.replace(openCaptureGroup, "(?<i_p1_")}
  (_${position.replace(openCaptureGroup, "(?<i_p2_")})?
  (?<i_close>  ${closeParens})?
`;

const fullPosition = `
  ${interval.replace(openCaptureGroupInterval, "(?<i1_")}
  (_${interval.replace(openCaptureGroupInterval, "(?<i2_")})?
`

const patterns = {
  fullPosition: xre(fullPosition, "x")
}

module.exports = {parse};

function parse(mut, options = {}) {
  let captureGroups = xre.exec(mut, patterns.fullPosition);
  let structuredGroups = structureCaptureGroups(captureGroups);

  if (options.debug) return {mut, valid: validate(structuredGroups), parsed: structuredGroups}
  else if (validate(structuredGroups)) return structuredGroups;
  else return false;
}

function structureCaptureGroups(obj) {
  return Object.entries(obj).reduce((acc, [name, value]) => {
    if (name.indexOf("_") < 0 || value === undefined) return acc;
    name = name.split("_");
    // if (Number.isInteger(+value)) value = +value;
  
    if (value === "(") acc[name[0]] = {open_parens: true};
    else if (value === ")") acc[name[0]].close_parens = true;
    else if (name.length === 3) {
      if (!acc[name[0]]) acc[name[0]] = {[name[1]]: {[name[2]]: value}};
      else if (!acc[name[0]][name[1]]) acc[name[0]][name[1]] = {[name[2]]: value};
      else if (!acc[name[0]][name[1]][name[2]]) acc[name[0]][name[1]][name[2]] = value;
    }
    return acc;
  }, {})
}