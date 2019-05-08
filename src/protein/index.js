const xre = require("xregexp");
const patterns = require("./patterns");
const patternEntries = Object.entries(patterns);
const terminalTokens = ["X","*","Ter"];

const is = patternEntries.reduce((acc, [name, pattern]) => (
  Object.assign(acc, {[name]: term => xre.test(term, pattern)})
), {});

function parse(mut) {
  return patternEntries.reduce((acc, [name, pattern]) => {
    let value = xre.exec(mut, pattern);
    return value ? acc.concat({name, value: {...value}}) : acc;
  }, [])
}

function capitalize(str) {
  return `${str.slice(0,1).toUpperCase()}${str.slice(1)}` 
}

function getType(mut) {
  
  for (let [name, pattern] of patternEntries) {
    let result = xre.exec(mut, pattern);
    if (result) {
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
  if (terminalTokens.includes(missense)) return "nonsense";
  else if (missense === "=") return "silent substitution";
  else if (missense === "?") return "unknown";
  else return "missense";
}

function validate(mut) {
  return patternEntries.find(([name, pattern]) => xre.test(mut, pattern))
}

module.exports = {is, parse, getType, validate, name: "protein"};