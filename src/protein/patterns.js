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

module.exports = patterns;