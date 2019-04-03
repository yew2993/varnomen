let xre = require("xregexp");
let protein = require("./protein"),
  cdna = require("./cdna")

let prefix = xre(`\^
  (?<type> (c|g|p))
  \\\.
  (?<term> \.\+)
`,"x")

function moleculeType(expression) {
  let parsed = xre.exec(expression, prefix);
  if (!parsed || !parsed.type) return null;
  switch (parsed.type) {
    case "c": return cdna;
    case "p": return protein;
  }
}
// let proteinTypes = ["nonsense", "missense", "silent", "frameshift", "deletion-insertion", "deletion"];
let proteinTypes = /(nonsense|missense|silent|frameshift|deletion-insertion|deletion)/i;

function mutationType(expression) {
  if (typeof expression === "string") {
    let mol = moleculeType(expression)
    if (!mol) return null;
    else return mol.getType(expression);
  }
  else if (expression && (expression.cdna || expression.amino_acid)) {
    let cdnaType = cdna.getType(expression.cdna);
    let proteinType = protein.getType(expression.amino_acid);
    let keepProteinType = proteinTypes.test(proteinType);
    if (keepProteinType) {
      return proteinType;
    }
    else if (cdnaType === "cDNA substitution" && expression.mutation_type === "Splicing") {
      return `${expression.mutation_type} ${cdnaType}`
    } 
    else return cdnaType;
  }
}

function cleanMut(expression) {
  if (typeof expression === "string") {
    let mol = moleculeType(expression)
    if (!mol) return null;
    else return mol.cleanMut(expression);
  }
  else if (expression) {
    if (expression.cdna) expression.cdna = cdna.cleanMut(expression.cdna);
    // if (expression.amino_acid) expression.amino_acid = protein.cleanMut(expression.amino_acid);
}
  return expression;
}

function parse(expression) {
  let mol = moleculeType(expression)
  if (!mol) return null;
  else return mol.parse(expression)
}

function is(molecule) {
  return expression => molecule.is(expression);
}

function validate(expression) {
  if (typeof expression === "string") {
    let mol = moleculeType(expression)
    if (!mol) return null;
    else return mol.validate(expression);
  }
  else if (expression) {
    if (!expression.cdna || !cdna.validate(expression.cdna)) throw new Error("Varnomen.validate: cDNA must be included");
    if (!["", undefined, null].includes(expression.amino_acid) && !protein.validate(expression.amino_acid)) throw new Error("Varnomen.validate: amino acid is included");
    return true;
  }
  else throw new Error("Invalid entry.")
}

module.exports = {
  parse,
  mutationType,
  protein,
  cdna,
  cleanMut,
  validate
  // isProtein: is(protein),
  // isCdna: is(cdna)
}