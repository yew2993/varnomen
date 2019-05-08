const {nuc,locus} = require("./constants")
const {position, interval} = require("./oldLocation")

const mutation = `
  (?<wt_nuc>                 ${nuc})?
  (?<count_change_mut_type>  (del|ins|dup|inv))?
  (?<count_change_sequence>  ${nuc}+|${locus}(_${locus})?)?
  (?<new_nuc_mut_type>       (ins|>))?
  (?<new_nuc_sequence>       ${nuc}+|${locus}(_${locus})?)?
`;

const deletion_insertion = `
  ${interval}
  (?<mutation_type> del)
  (?<deleted_sequence>  ${nuc}+|${locus})?
  ins(?<inserted_sequence>  ${nuc}+|${locus})
`;

const insertion = `
  ${interval}
  (?<mutation_type> ins)
  (?<mutation_sequence> (
    ${nuc}+|${locus}(_${locus})?(inv)?
  ))
`;
// (?<pos> ${locus})_(?<pos_end> ${locus})

const substitution = `${position}(?<wt> ${nuc})>(?<mut> ${nuc})`;
const deletion = `${interval}del(?<deleted_sequence> (${nuc}*|${locus}))?`;
const duplication = `${interval}dup(?<duplicated_sequence> (${nuc}*|${locus}))?`;
const inversion = `${interval}inv(${nuc}*|${locus})?`;

module.exports = {
  mutation,
  deletion_insertion,
  insertion,
  substitution,
  deletion,
  duplication,
  inversion,
}