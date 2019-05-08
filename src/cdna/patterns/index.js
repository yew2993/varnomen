const xre = require("xregexp");
const {prefix, transcript} = require("./constants")
const {
  mutation,
  deletion_insertion,
  insertion,
  substitution,
  deletion,
  duplication,
  inversion,
} = require("./mutations");

const {
  raw, interval, posFull,
} = require("./oldLocation")

const template = `
  (?<position>   (${raw.interval}(_${raw.interval})?)+)
  (?<mutation>  .*)
`;

const cdna = term => `\^\(${transcript}\)\?\(${prefix}\)\?${term}\$`;

const patterns = {
  deletion_insertion: xre(cdna(deletion_insertion), "x"),
  insertion: xre(cdna(insertion), "x"),
  substitution: xre(cdna(substitution), "x"),
  deletion: xre(cdna(deletion), "x"),
  duplication: xre(cdna(duplication), "x"),
  inversion: xre(cdna(inversion), "x"),
  mutation: xre(mutation, "x"),
  template: xre(cdna(template), "x"),
  interval: xre(interval, "x"),
  posFull: xre(posFull, "x"),
}

module.exports = patterns;