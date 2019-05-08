const transcript = `
  (?<transcript> [A-Z]{2}_[0-9]{5,9}\.{1,2}):\\s*
`;
const prefix = "c\.";
const nuc = "[ACGT]";
const locus = "[0-9]{0,4}";
const positionPrefix = "[*-]";
const positionSuffix = "[+-]";
const openParens = "\\\(";
const closeParens = "\\\)";
const position = `
  (?<prefix>   ${positionPrefix})?
  (?<pos>      ${locus})
  (?<suffix>   ${positionSuffix}${locus})? 
`;

module.exports = {
  position,
  prefix,
  nuc,
  locus,
  positionPrefix,
  positionSuffix,
  openParens,
  closeParens,
  transcript
};