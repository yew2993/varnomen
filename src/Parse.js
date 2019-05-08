const xre = require("xregexp");
const Protein = require("./protein");
const cDNA = require("./cdna");
const prefix = xre(`\^
  (?<type> (c|g|p))
  \\\.
  (?<term> \.\+)
`,"x");

module.exports = function parse(mut) {
  const mol = getMoleculeType(expression)
  if (!mol) return null;
  else return mol.parse(expression)
}

function getMoleculeType(expression) {
  const parsed = xre.exec(expression, prefix);
  if (!parsed || !parsed.type) return null;
  switch (parsed.type) {
    case "c": return cDNA;
    case "p": return Protein;
  }
  return null;
}