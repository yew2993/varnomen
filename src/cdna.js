let xre = require("xregexp");

const prefix = "c\.";
const nuc = "[ACGT]"
const locus = "[0-9]{0,4}";
const positionPrefix = "[*-]";
const positionSuffix = "[+-]";
const position = `
  (?<pos_prefix>   ${positionPrefix})?
  (?<pos>          ${locus})
  (?<pos_suffix>   ${positionSuffix}${locus})? 
`; // If both pos_prefix and pos_suffix - bad (NOT NECESSARILY - SEE HMBS MUTS)

const positionEnd = position.replace(/\?\<pos/g, "?<pos_end");

const deletion_insertion = `
  ${position}
  (_${positionEnd})?
  del
  (?<deleted_sequence>  ${nuc}+|${locus})?
  ins
  (?<inserted_sequence>  ${nuc}+|${locus})
`;

const insertion = `
  (?<pos> ${locus})
  _
  (?<pos_end> ${locus})
  ins
  (?<inserted_sequence> (
    ${nuc}+
    |
    ${locus}(_${locus})?(inv)?
  ))
`;

const substitution = `
  ${position}
  (?<wt>  ${nuc})
  >
  (?<mut> ${nuc})
`;

const deletion = `
  (?<position> ${position})
  (_${positionEnd})?
  del
  (?<deleted_sequence> (${nuc}*|${locus}))?
`;

const duplication = `
  (?<position> ${position})
  (_${positionEnd})?
  dup
  (?<duplicated_sequence> (${nuc}*|${locus}))?
`;

const inversion = `
  ${position}
  (_${positionEnd})?
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

function parse(mut) {
  return Object.entries(patterns).reduce((acc, [name, pattern]) => {
    let value = xre.exec(mut, pattern);
    return value ? acc.concat({name, value}) : acc;
  }, [])
}

const is = (function () {
  return Object.entries(patterns).reduce((acc, [name, pattern]) => {
    return Object.assign(acc, {[name]: term => xre.test(term, pattern)});
  }, {})
})();

function validate(mut) {
  return Object.values(patterns).find(pattern => xre.test(mut, pattern))
}

function cleanMut(mut) {
  let {name, parsed} = getPattern(mut);
  if (!name) return mut;

  let {input, deleted_sequence, duplicated_sequence} = parsed;
  if (["deletion", "deletion_insertion"].includes(name) && deleted_sequence) mut = mut.replace(deleted_sequence, "");
  if (["duplication"].includes(name) && duplicated_sequence) mut = mut.replace(duplicated_sequence, "");
  return mut;
}

function getPattern(mut) {
  for (let [name, pattern] of Object.entries(patterns)) {
    if (xre.test(mut, pattern)) {
      return {name, parsed: xre.exec(mut, pattern)}
    }
  }
  return {name: null, parsed: null};
}

function getType(mut) {
  let {name, parsed} = getPattern(mut);
  if (!name) return null;
  
  let {pos_prefix, pos_suffix, pos_end, pos_end_suffix} = parsed;
  if (name === "deletion_insertion") name = "deletion-insertion"
  if (pos_prefix === "*") return `3' UTR ${name}`;
  else if (pos_prefix === "-") return `5' UTR ${name}`;
  else if (pos_suffix || pos_end_suffix) return intronicType(name, parsed) 
  else return `cDNA ${name}`;
}

module.exports = {is, parse, getType, cleanMut, validate, name: "cdna"};

/*
  VARIABLES:
    pos
    pos_end
    pos_offset
    pos_end_offset
*/
function intronicType(name, {pos, pos_suffix, pos_end, pos_end_suffix}) {
  if (pos_suffix) {
    if (!pos_end_suffix) return "Splice-site";
    // where pos === pos_end
      // if (expression === c.(pos-a)_(pos_end-b)) a > b
      // if (expression === c.(pos+a)_(pos_end+b)) b > a
      // if (Math.abs(a) < consensusSite || Math.abs(b) < consensusSite)
    

    return `${+(pos_suffix.slice(1)) <= 2 || +(pos_end_suffix.slice(1)) <= 2 ? "Splice-site" : "Intronic"} ${name}`
  }
  if (pos_end) {
    if (!pos_end_suffix) `Intronic ${name}`;
    else {
      return `${+(pos_suffix.slice(1)) <= 2 || +(pos_end_suffix.slice(1)) <= 2 ? "Splice-site" : "Intronic"} ${name}`
    }
  }
  else return `${+(pos_suffix.slice(1)) <= 2 || +(pos_end_suffix.slice(1)) <= 2 ? "Splice-site" : "Intronic"} ${name}`
}