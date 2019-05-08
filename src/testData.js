module.exports = [
  {
    "mut": "c.(500)_(501)G>A",
    "validLocation": false,
    "expectedCount": 1,
    "expectedType": "substitution"
  },
  {
    "mut": "NM_000190.3: c.500G>A",
    "validLocation": true,
    "expectedCount": 1,
    "expectedType": "substitution"
  },
  {
    "mut": "c.93+1G>T",
    "validLocation": true,
    "expectedCount": 1,
    "expectedType": "substitution"
  },
  {
    "mut": "c.3921del",
    "validLocation": true,
    "expectedCount": 1,
    "expectedType": "deletion"
  },
  {
    "mut": "c.186del",
    "validLocation": true,
    "expectedCount": 1,
    "expectedType": "deletion"
  },
  {
    "mut": "c.183_186+48del",
    "validLocation": true,
    "expectedCount": 52,
    "expectedType": "deletion"
  },
  {
    "mut": "c.186+5_7del",
    "validLocation": false,
    "expectedCount": null,
    "expectedType": null
  }, //failes
  {
    "mut": "c.185_186+5_7del",
    "validLocation": false,
    "expectedCount": null,
    "expectedType": null
  }, //fails
  {
    "mut": "c.186+5_186+7del",
    "validLocation": true,
    "expectedCount": 3,
    "expectedType": "deletion"
  },
  {
    "mut": "c.185_186+7del",
    "validLocation": true,
    "expectedCount": 9,
    "expectedType": "deletion"
  },
  {
    "mut": "c.1704+1del",
    "validLocation": true,
    "expectedCount": 1,
    "expectedType": "deletion"
  },
  {
    "mut": "c.1813del",
    "validLocation": true,
    "expectedCount": 1,
    "expectedType": "deletion"
  },
  {
    "mut": "c.4072-1234_5155-246del",
    "validLocation": true,
    "expectedCount": "?",
    "expectedType": "deletion"
  },
  {
    "mut": "c.4071+1_4072-1_(5154+1_5155-1)del",
    "validLocation": false,
    "expectedCount": "?",
    "expectedType": "deletion"
  }, //fails 
  // duplications
  {
    "mut": "c.20dup",
    "validLocation": true,
    "expectedCount": 1,
    "expectedType": "duplication"
  },
  {
    "mut": "c.20_23dup",
    "validLocation": true,
    "expectedCount": 4,
    "expectedType": "duplication"
  },
  {
    "mut": "c.260_264+48dup",
    "validLocation": true,
    "expectedCount": 53,
    "expectedType": "duplication"
  },
  {
    "mut": "c.1704+1dup",
    "validLocation": true,
    "expectedCount": 1,
    "expectedType": "duplication"
  },
  {
    "mut": "c.1813dup",
    "validLocation": true,
    "expectedCount": 1,
    "expectedType": "duplication"
  },
  {
    "mut": "c.4072-1234_5155-246dup",
    "validLocation": true,
    "expectedCount": "?",
    "expectedType": "duplication"
  },
  {
    "mut": "c.720_991dup",
    "validLocation": true,
    "expectedCount": 272,
    "expectedType": "duplication"
  },
  {
    "mut": "c.(4071+1_4072-1)_(5154+1_5155-1)dup",
    "validLocation": true,
    "expectedCount": "?",
    "expectedType": "duplication"
  },
  // insertions
  {
    "mut": "c.169_170insA",
    "validLocation": true,
    "expectedCount": 2,
    "expectedType": "insertion"
  },
  {
    "mut": "c.240_241insAGG",
    "validLocation": true,
    "expectedCount": 2,
    "expectedType": "insertion"
  },
  {
    "mut": "c.849_850ins858_895",
    "validLocation": true,
    "expectedCount": 2,
    "expectedType": "insertion"
  },
  // complex insertions
  {
    "mut": "c.419_420ins[T;401_419]",
    "validLocation": true,
    "expectedCount": "?",
    "expectedType": "insertion"
  },
  {
    "mut": "c.419_420ins[T;450_470;AGGG]",
    "validLocation": true,
    "expectedCount": "?",
    "expectedType": "insertion"
  },
  // insertion of inverted duplicated copies
  {
    "mut": "c.849_850ins850_900inv",
    "validLocation": true,
    "expectedCount": "?",
    "expectedType": "insertion"
  },
  {
    "mut": "c.900_901ins850_900inv",
    "validLocation": true,
    "expectedCount": "?",
    "expectedType": "insertion"
  },
  {
    "mut": "c.940_941ins[885_940inv;A;851_883inv]",
    "validLocation": true,
    "expectedCount": "?",
    "expectedType": "insertion"
  },
  {
    "mut": "c.940_941ins[903_940inv;851_885inv]",
    "validLocation": true,
    "expectedCount": "?",
    "expectedType": "insertion"
  },
  // inversions
  {
    "mut": "c.5657_5660inv",
    "validLocation": true,
    "expectedCount": 4,
    "expectedType": "inversion"
  },
  {
    "mut": "c.4145_4160inv",
    "validLocation": true,
    "expectedCount": 16,
    "expectedType": "inversion"
  },
  // deletion-insertions
  {
    "mut": "c.6775delinsGA",
    "validLocation": true,
    "expectedCount": 1,
    "expectedType": "deletion_insertion"
  },
  {
    "mut": "c.6775_6777delinsC",
    "validLocation": true,
    "expectedCount": 3,
    "expectedType": "deletion_insertion"
  },
  {
    "mut": "c.142_144delinsTGG",
    "validLocation": true,
    "expectedCount": 3,
    "expectedType": "deletion_insertion"
  },
  {
    "mut": "c.9002_9009delinsTTT",
    "validLocation": true,
    "expectedCount": 8,
    "expectedType": "deletion_insertion"
  },
  {
    "mut": "c.583_589delTTTTTTAinsATTTTTG",
    "validLocation": true,
    "expectedCount": 7,
    "expectedType": "deletion_insertion"
  },
  // regulatory
  {
    "mut": "c.-26-183G>A",
    "validLocation": true,
    "expectedCount": 1,
    "expectedType": "regulatory"
  },
]