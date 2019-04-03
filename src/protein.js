let xre = require("xregexp");

const prefix = "p\.";
const position = "[0-9]{0,4}";
const one = "[ACDEFGHIKLMNPQRSTVWXY]";
const three = `(
  Ala|Cys|Asp|Glu|Phe|
  Gly|His|Ile|Lys|Leu|
  Met|Asn|Pro|Gln|Arg|
  Ser|Thr|Val|Trp|Tyr
)`;
const amino_acid = `${one}|${three}`
const termination = "([X*]|Ter)";
const termTokens = ["X","*","Ter"];
const unknown = "\\\?"
const silent = "="

const refStart = `
  (?<wt>        ${amino_acid})
  (?<position>  ${position})
`;
const refEnd = `
  _
  (?<wt_end>        ${amino_acid})
  (?<position_end>  ${position})
`;
const residueOrInterval = `${refStart}(${refEnd})?`;
const interval = `${refStart}${refEnd}`;

const substitution = `
  ${refStart}
  (
    (?<missense>  ${amino_acid}|${termination}|${unknown}|${silent})
  )
`;
const duplication = `
  ${residueOrInterval}
  dup
`;
const deletion = `
  ${residueOrInterval}
  del
`;
const insertion =  `
  ${interval}
  ins
  (?<inserted_sequence>  (${amino_acid}+${termination}?|[0-9]{0,4}))
`;

const deletionInsertion =  `
  ${residueOrInterval}
  del
  (?<deleted_sequence>    ${amino_acid}+)?
  ins
  (?<inserted_sequence>   ${amino_acid}+${termination}?)
`;

const frameshift = `
  ${refStart}
  (?<mut>       ${amino_acid}|${silent})?
  fs
  (
    ${termination}
    (?<terminal_position>  ${position}|\\\?)?
  )?
`;

const deletionsInsertions =  `
  ${residueOrInterval}
  (
    (?<type1> (ins|del|dup|delins))
    (?<seq1>  (${amino_acid}+${termination}?|[0-9]{0,4}))?
    (?<type2> ins)?
    (?<seq2>  (${amino_acid}+${termination}?|[0-9]{0,4}))?
  )
`;

const protein = term => `\^
  ${prefix}
  (?<parens_open> \\\()?
  ${term}
  (?<parens_close> \\\))?
\$`;

const patterns = {
  substitution: xre(protein(substitution), "x"),
  duplication: xre(protein(duplication), "x"),
  deletion: xre(protein(deletion), "x"),
  insertion: xre(protein(insertion), "x"),
  deletion_insertion: xre(protein(deletionInsertion), "x"),
  frameshift: xre(protein(frameshift), "x"),
  // deletionsInsertions: xre(protein(deletionsInsertions), "x"),
}

const is = (function () {
  return Object.entries(patterns).reduce((acc, [name, pattern]) => {
    return Object.assign(acc, {[name]: term => xre.test(term, pattern)});
  }, {})
})();

function parse(mut) {
  return Object.entries(patterns).reduce((acc, [name, pattern]) => {
    let value = xre.exec(mut, pattern);
    return value ? acc.concat({name, value: {...value}}) : acc;
  }, [])
}

function capitalize(str) {
  return `${str.slice(0,1).toUpperCase()}${str.slice(1)}` 
}

function getType(mut) {
  for (let [name, pattern] of Object.entries(patterns)) {
    if (xre.test(mut, pattern)) {
      let result = xre.exec(mut, pattern);
      let {missense, parens_open, parens_close} = result;
      if (name === "deletion_insertion") name = "deletion-insertion"
      else if (name === "substitution") name = getSubstitutionType(missense)
      
      if (!parens_open !== !parens_close) return null;
      else if (parens_open) name = `Predicted ${name}`
      else name = capitalize(name);
      
      return name;
    }
  }
  return null;
}

function getSubstitutionType(missense) {
  if (termTokens.includes(missense)) return "nonsense";
  else if (missense === "=") return "silent substitution";
  else if (missense === "?") return "unknown";
  else return "missense";
}

function validate(mut) {
  return Object.values(patterns).find(pattern => xre.test(mut, pattern))
}

module.exports = {is, parse, getType, validate, name: "protein"};




// is.nonsense = term => {
//   let result = xre.exec(term, patterns.substitution);
//   if (!result) return false;
//   if (result.mut) return termination.includes(result.mut)
//   if (result.predicted_mut) return termination.includes(result.predicted_mut)
//   else return false;
// }
// is.missense = term => is.substitution(term) && !"*X".includes(term.slice(term.length-1));
