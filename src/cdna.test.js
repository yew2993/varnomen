require('console.table');
let {is} = require("./cdna");

let cases = [
  {mut: "c.500G>A", expected: "substitution"},
  {mut: "c.93+1G>T", expected: "substitution"},
  {mut: "c.3921del", expected: "deletion"},
  {mut: "c.186del", expected: "deletion"},
  {mut: "c.183_186+48del", expected: "deletion"},
  {mut: "c.186+5_7del", expected: "deletion"},
  {mut: "c.185_186+5_7del", expected: null}, //fails
  {mut: "c.185_186+7del", expected: "deletion"},
  {mut: "c.1704+1del", expected: "deletion"},
  {mut: "c.1813del", expected: "deletion"},
  {mut: "c.4072-1234_5155-246del", expected: "deletion"},
  {mut: "c.(4071+1_4072-1)_(5154+1_5155-1)del", expected: "deletion"}, //fails 
  // duplications
  {mut: "c.20dup", expected: "duplication"},
  {mut: "c.20_23dup", expected: "duplication"},
  {mut: "c.260_264+48dup", expected: "duplication"},
  {mut: "c.1704+1dup", expected: "duplication"},
  {mut: "c.1813dup", expected: "duplication"},
  {mut: "c.4072-1234_5155-246dup", expected: "duplication"},
  {mut: "c.720_991dup", expected: "duplication"},
  {mut: "c.(4071+1_4072-1)_(5154+1_5155-1)dup", expected: "duplication"},
  // insertions
  {mut: "c.169_170insA", expected: "insertion"},
  {mut: "c.240_241insAGG", expected: "insertion"},
  {mut: "c.849_850ins858_895", expected: "insertion"},
  // complex insertions
  {mut: "c.419_420ins[T;401_419]", expected: "insertion"},
  {mut: "c.419_420ins[T;450_470;AGGG]", expected: "insertion"},
  // insertion of inverted duplicated copies
  {mut: "c.849_850ins850_900inv", expected: "insertion"},
  {mut: "c.900_901ins850_900inv", expected: "insertion"},
  {mut: "c.940_941ins[885_940inv;A;851_883inv]", expected: "insertion"},
  {mut: "c.940_941ins[903_940inv;851_885inv]", expected: "insertion"},
  // inversions
  {mut: "c.5657_5660inv", expected: "inversion"},
  {mut: "c.4145_4160inv", expected: "inversion"},
  // deletion-insertions
  {mut: "c.6775delinsGA", expected: "deletion_insertion"},
  {mut: "c.6775_6777delinsC", expected: "deletion_insertion"},
  {mut: "c.142_144delinsTGG", expected: "deletion_insertion"},
  {mut: "c.9002_9009delinsTTT", expected: "deletion_insertion"},
  {mut: "c.583_589delTTTTTTAinsATTTTTG", expected: "deletion_insertion"},
  // regulatory
  {mut: "c.-26-183G>A", expected: "regulatory"},

]

cases = cases.map(({mut, expected}) => {
  let row = {mut, expected, result: ""};
  for (let key in is) {
    // console.log(key)
    row[key] = is[key](mut);
  }
  row.result = row[row.expected] ? "PASS" : "FAIL"
  return row;
})
console.table(cases);