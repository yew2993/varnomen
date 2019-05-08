const xre = require("xregexp");
const {
  prefix,
  nuc,
  locus,
  positionPrefix,
  positionSuffix,
} = require("./constants");

const position = `
  (?<pos_prefix>   ${positionPrefix})?
  (?<pos>          ${locus})
  (?<pos_suffix>   ${positionSuffix}${locus})? 
`; // If both pos_prefix and pos_suffix - bad (NOT NECESSARILY - SEE HMBS MUTS)

const positionEnd = position.replace(/\?\<pos/g, "?<pos_end");

const deletion_insertion = `
  ${position}(_${positionEnd})?
  del(?<deleted_sequence>  ${nuc}+|${locus})?
  ins(?<inserted_sequence>  ${nuc}+|${locus})
`;

const insertion = `
  ${position}(_${positionEnd})?
  ins
  (?<inserted_sequence> (
    ${nuc}+|${locus}(_${locus})?(inv)?
  ))
`;
// (?<pos> ${locus})_(?<pos_end> ${locus})

const substitution = `
  ${position}
  (?<wt>  ${nuc})
  >
  (?<mut> ${nuc})
`;

const deletion = `
  ${position}(_${positionEnd})?
  del
  (?<deleted_sequence> (${nuc}*|${locus}))?
`;

const duplication = `
  ${position}(_${positionEnd})?
  dup
  (?<duplicated_sequence> (${nuc}*|${locus}))?
`;

const inversion = `
  ${position}(_${positionEnd})?
  inv(${nuc}*|${locus})?
`;

const cdna = term => `\^${prefix}${term}\$`;

const patterns = {
  substitution: xre(cdna(substitution), "x"),
  deletion: xre(cdna(deletion), "x"),
  duplication: xre(cdna(duplication), "x"),
  insertion: xre(cdna(insertion), "x"),
  inversion: xre(cdna(inversion), "x"),
  deletion_insertion: xre(cdna(deletion_insertion), "x"),
}

module.exports = patterns;