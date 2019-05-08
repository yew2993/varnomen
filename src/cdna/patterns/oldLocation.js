const {
  locus,
  positionPrefix,
  positionSuffix,
  openParens,
  closeParens
} = require("./constants");

const raw = {
  transcript: `[A-Z]{2}_[0-9]{5,9}\.{1,2}:\\s*`,
  position: `(${positionPrefix})?${locus}(${positionSuffix}${locus})?`,
  get interval() {return `(${openParens})?${this.position}(_${this.position})?(${closeParens})?`}
}

const position = `
  (?<pos_prefix>   ${positionPrefix})?
  (?<pos>          ${locus})
  (?<pos_suffix>   ${positionSuffix}${locus})? 
`; // If both pos_prefix and pos_suffix - bad (NOT NECESSARILY - SEE HMBS MUTS)
const positionEnd = position.replace(/\?\<pos/g, "?<pos_end");
const interval = `
  (?<open_parens>  ${openParens})?
  ${position}(_${positionEnd})?
  (?<close_parens> ${closeParens})?
`;
const posFull = `
  ${interval}
  (_${interval.replace(/parens\>/g, "second_parens>").replace(/\(\?\<pos/g, "(?<second_pos")})?
`;

module.exports = {
  raw,
  position,
  interval,
  posFull
}