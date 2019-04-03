require('console.table');
let {is} = require("./protein")

let cases = [
  // frameshift
  {mut: "p.R97PfsX23", expected: "frameshift"},
  {mut: "p.R97Pfs*23", expected: "frameshift"},
  {mut: "p.R97fs", expected: "frameshift"},
  {mut: "p.E5Vfs*5", expected: "frameshift"},
  {mut: "p.E5fs", expected: "frameshift"},
  {mut: "p.I327Rfs*?", expected: "frameshift"},
  {mut: "p.I327fs", expected: "frameshift"},
  {mut: "p.Q151Wfs*9", expected: "frameshift"},
  {mut: "p.H150Hfs*10", expected: "frameshift"},
  {mut: "p.R167W", expected: "substitution"},
  {mut: "p.R167X", expected: "substitution"},
///////////////////////////////////////////////////////////////////
  {mut: "p.Trp24Cys", expected: "substitution"},
  {mut: "p.(Trp24Cys)", expected: "substitution"},
  {mut: "p.Trp24Ter", expected: "substitution"},
  {mut: "p.(Trp24*)", expected: "substitution"},
  {mut: "p.Cys188=", expected: "substitution"},
  {mut: "p.=188Cys", expected: ""},
  {mut: "p.?", expected: "substitution"},
  {mut: "p.Met1?", expected: "substitution"},
  {mut: "p.(Gly56Ala^Ser^Cys)", expected: "substitution"},
  {mut: "p.Val7del", expected: "deletion"},
  {mut: "p.(Val7del)", expected: "deletion"},
  {mut: "p.Lys23_Val25del", expected: "deletion"},
  {mut: "p.(Pro458_Gly460del)", expected: "deletion"},
  {mut: "p.Gly2_Met46del", expected: "deletion"},
  {mut: "p.Ala3dup", expected: "duplication"},
  {mut: "p.Ala3_Ser5dup", expected: "duplication"},
  {mut: "p.Ser6dup", expected: "duplication"},
  {mut: "p.His4_Gln5insAla", expected: "insertion"},
  {mut: "p.Lys2_Gly3insGlnSerLys", expected: "insertion"},
  {mut: "p.(Met3_His4insGlyTer)", expected: "insertion"},
  {mut: "p.Arg78_Gly79ins23", expected: "insertion"},
  {mut: "p.Cys28delinsTrpVal", expected: "deletion_insertion"},
  {mut: "p.Cys28_Lys29delinsTrp", expected: "deletion_insertion"},
  {mut: "p.(Pro578_Lys579delinsLeuTer)", expected: "deletion_insertion"},
  {mut: "p.(Glu125_Ala132delinsGlyLeuHisArgPheIleValLeu)", expected: "deletion_insertion"},
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