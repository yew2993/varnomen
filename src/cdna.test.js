require('console.table');
let cDNA = require("./cdna"), {is} = cDNA;
let cases = require("./testData");

console.table(checkExpectedTypes(cases));
// console.table(checkNucleotideCounts(cases));
// console.table(breakItDown(cases))
// console.table(posFull(cases))

function checkExpectedTypes(cases) {
  return cases.map(({mut, expectedType}) => {
    let row = {mut, expectedType, result: ""};
    for (let key in is) {
      row[key] = is[key](mut);
    }
    row.result = row[row.expectedType] ? "PASS" : "fail"
    return row;
  })
}

function checkNucleotideCounts(cases) {
  return cases.map(({mut, expectedCount}) => ({mut, expectedCount, nucs: cDNA.countNucleotides(mut)}))
}

function breakItDown(cases) {
  return cases.map(({mut}, index) => {
    let {position, mutation} = cDNA.parse(mut, {patternName: "template"});
    let {
      pos_prefix, pos, pos_suffix,
      pos_end_prefix, pos_end, pos_end_suffix
    } = cDNA.parse(position, {patternName: "interval"});
    let {
      wt_nuc,count_change_mut_type,count_change_sequence,
      new_nuc_mut_type,new_nuc_sequence
    } = cDNA.parse(mutation, {patternName: "mutation"});
    return {
      mut,
      Mut: mutation,
      Pos: position,
      Prfx1: pos_prefix,
      Pos1: pos,
      Sffx1: pos_suffix,
      Prfx2: pos_end_prefix,
      Pos2: pos_end,
      Sffx2: pos_end_suffix,
      WT: wt_nuc,
      MutType1: count_change_mut_type,
      MutSeq1: count_change_sequence,
      MutType2: new_nuc_mut_type,
      MutSeq2: new_nuc_sequence,
      nucs: cDNA.countNucleotides(mut)
    }
  })
}
function posFull(cases) {
  return cases.map(({mut}) => {
    let {position} = cDNA.parse(mut, {patternName: "template"});
    let {
      open_parens, 
      pos_prefix, pos, pos_suffix, 
      pos_end_prefix, pos_end, pos_end_suffix,
      close_parens,
      open_second_parens, 
      second_pos_prefix, second_pos, second_pos_suffix,
      second_pos_end_prefix, second_pos_end, second_pos_end_suffix,
      close_second_parens
    } = cDNA.parse(position, {patternName: "posFull"});
    return {
      Pos: position,
      "1(": open_parens,
      Prfx1: pos_prefix,
      Pos1: pos,
      Sffx1: pos_suffix,
      Prfx2: pos_end_prefix,
      Pos2: pos_end,
      Sffx2: pos_end_suffix,
      ")2": close_parens,
      "3(": open_second_parens,
      Sec_Prfx1: second_pos_prefix,
      Sec_Pos1: second_pos,
      Sec_Sffx1: second_pos_suffix,
      Sec_Prfx2: second_pos_end_prefix,
      Sec_Pos2: second_pos_end,
      Sec_Sffx2: second_pos_end_suffix,
      ")4": close_second_parens,
    }
  })
}

// {
//   i1_p1_open,
//   i1_p1_prefix,
//   i1_p1_pos,
//   i1_p1_suffix,
//   i1_p1_close,
//   i1_p2_open,
//   i1_p2_prefix,
//   i1_p2_pos,
//   i1_p2_suffix,
//   i1_p2_close,
//   i2_p1_open,
//   i2_p1_prefix,
//   i2_p1_pos,
//   i2_p1_suffix,
//   i2_p1_close,
//   i2_p1_open,
//   i2_p1_prefix,
//   i2_p1_pos,
//   i2_p1_suffix,
//   i2_p1_close,
// }