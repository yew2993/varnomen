const xre = require("xregexp");
const patterns = require("./patterns");
const patternEntries = Object.entries(patterns);

function parse(mut, {patternName=null, pattern=null}) {
  if (patternName) {
    // console.log(mut, patterns[patternName])
    if (patterns[patternName]) return xre.exec(mut, patterns[patternName]);
    else throw new Error("patternName does not exist");
  }
  else if (pattern) {
    return xre.exec(mut, pattern);
  }
  return patternEntries.reduce((acc, [name, pattern]) => {
    let value = xre.exec(mut, pattern);
    return value ? acc.concat({name, value}) : acc;
  }, [])
}

const is = patternEntries.reduce((acc, [name, pattern]) => (
  Object.assign(acc, {[name]: term => xre.test(term, pattern)})
), {})

function validate(mut) {
  return Object.values(patterns).find(pattern => xre.test(mut, pattern))
}

function cleanMut(mut) {
  let {name, parsed} = getPattern(mut);
  if (!name) return mut;

  let {deleted_sequence, duplicated_sequence} = parsed;
  if (["deletion", "deletion_insertion"].includes(name) && deleted_sequence) mut = mut.replace(deleted_sequence, "");
  if (["duplication"].includes(name) && duplicated_sequence) mut = mut.replace(duplicated_sequence, "");
  return mut;
}

/**
 * 
 * @param {obj} mut 
 * @param {obj} options 
 * @param {boolean} options.allMatches attempt to match mut against all patterns
 * @return {{name, parsed}} name - name of matched pattern, parsed - parsed components of pattern
 */
function getPattern(mut, options = {}) {
  const {allMatches = false} = options;
  if (allMatches) {
    return patternEntries.map(([name, pattern]) => (
      {name, parsed: xre.exec(mut, pattern)}
    ), [])
  }
  else {
    for (let i = 0; i < patternEntries.length; i++) {
      let [name, pattern] = patternEntries[i];
      let result = xre.exec(mut, pattern);
      if (result) return {name, parsed: result};
    }
    return {name: null, parsed: null};
  }
}

function getType(mut) {
  let {name, parsed} = getPattern(mut);
  if (!name) return null;
  
  let {pos_prefix, pos_suffix, pos_end, pos_end_suffix} = parsed;
  if (name === "deletion_insertion") name = "deletion-insertion"
  if (pos_prefix === "*") return `3' UTR ${name}`;
  else if (pos_prefix === "-") return `5' UTR ${name}`;
  else if (pos_suffix || pos_end_suffix) return intronicType(name, parsed) 
  else return `cDNA ${name}`;
}

module.exports = {
  is,
  parse,
  getType,
  cleanMut,
  validate,
  getLoci,
  countNucleotides: query => {
    let loci = getLoci(query)
    if (!loci) return null;
    
    let {start, end} = loci;
    return countNucleotides(start, end)
  },
  name: "cdna"
};
function getLoci(query) {
  let {parsed} = getPattern(query)
  if (!parsed) return null;
  let {pos, pos_suffix, pos_end, pos_end_suffix} = parsed;
  let loci = {
    start: characterizeLocus(pos, pos_suffix),
    end: characterizeLocus(pos_end, pos_end_suffix)
  }
  return loci;
}
function characterizeLocus(locus, suffix, options={}) {
  let {spliceSiteThreshold=7} = options;
  locus = +locus;
  suffix = +suffix;
  return {
    locus, suffix,
    isBlank: Boolean(!locus && !suffix),
    isInvalid: Boolean(!locus && suffix),
    isExonic: Boolean(locus && !suffix),
    isIntronic: Boolean(locus && suffix),
    isSpliceSite: Boolean(Math.abs(suffix) < spliceSiteThreshold),
    isDownstream: Boolean(suffix > 0),
  }
}

function countNucleotides(start, end, intronLengths=0) {
  if (end.isBlank) return 1;
  // b-a=0
  if (end.locus === start.locus) {
    if (start.isExonic || end.isExonic) {
      if (start.suffix && start.suffix) return "ERROR: both exonic bounds have suffixes";
      else if (start.suffix) return 1 + Math.abs(start.suffix)                                // 6
      else if (end.suffix) return 1 + Math.abs(end.suffix)                                    // 7
    }
    else return Math.abs(end.suffix - start.suffix + 1);                                      // 4
  }

  let exonicNucsInOpenInterval = end.locus - start.locus - 1;
  // b-a=1
  if (!exonicNucsInOpenInterval) {
    if (start.isExonic && end.isExonic) return intronLengths + 2;                           // 13 (c.a_b)
    else if (start.isIntronic && end.isIntronic) return intronLengths;                      // 12 (c.(a+x)_(b-y))
    else if (start.isIntronic) return intronLengths + 2 + start.suffix;                     // 15 c.(a.x)_(b)
    else if (end.isIntronic) return intronLengths + 2 + end.suffix;                         // 14 c.(a)_(b.y)
  }
  // b-a>1
  if (start.isExonic && end.isExonic) return exonicNucsInOpenInterval + 2 + intronLengths;  // 1, 5, 9, 10, 11
  else if (start.isIntronic && end.isIntronic) {
    if (!start.isDownstream && end.isDownstream) {
      return exonicNucsInOpenInterval + Math.abs(start.suffix) + Math.abs(end.suffix) + 2;  // 8 
    }
    else if (start.isDownstream && !end.isDownstream) return exonicNucsInOpenInterval + intronLengths
    else if (start.isDownstream && end.isDownstream) return exonicNucsInOpenInterval + intronLengths + end.suffix;
    else if (!start.isDownstream && !end.isDownstream) return exonicNucsInOpenInterval + intronLengths + start.suffix;
  }
  if (start.isIntronic) return exonicNucsInOpenInterval + 2 + Math.abs(start.suffix);           // 2
  if (end.isIntronic) return exonicNucsInOpenInterval + 2 + end.suffix;                         // 3
  return -1;
}

/**
 * Assumes pos exists, so no need to check if (rangeStart.isBlank || rangeStart.isInvalid)
 * Assumes at least one suffix exists.
 * @param {*} name 
 * @param {*} param1 
 */
function intronicType(name, {pos, pos_suffix, pos_end, pos_end_suffix}) {
  let start = characterizeLocus(pos, pos_suffix);
  let end = characterizeLocus(pos_end, pos_end_suffix);
  
  if (end.isInvalid) throw new Error("Varnomen.cdna.getType: Received a cDNA interval that has an end suffix but no end locus.");
  if (end.isBlank) return `Single nucleotide ${start.isSpliceSite ? "splice site": "intronic"} ${name}`;

  let numberOfNucs = countNucleotides(start, end);
  if (numberOfNucs >= 20) name = `gross ${name}`
  
  if (start.isExonic || end.isExonic) return `Splice site ${name}`;
  
  // At this point, we know that both positions (1) are valid and (2) have suffixes.
  // Therefore, if the two positions are more than one off of each other, at least one intron
  // and one exon have been malformed.
  const SPANS_MORE_THAN_ONE_INTRON = end.locus - start.locus > 1
  if (SPANS_MORE_THAN_ONE_INTRON) return `Gross ${name}`;

  const SPANS_AT_LEAST_ONE_EXON = !start.isDownstream && end.isDownstream;
  if (SPANS_AT_LEAST_ONE_EXON) return `Single exon ${name}`;

  let OFFSETS_IN_ONE_DIRECTION = start.isDownstream === end.isDownstream;
  if (OFFSETS_IN_ONE_DIRECTION) {
    if (start.isSpliceSite || end.isSpliceSite) return `Splice site ${name}`;
    else return `Intronic ${name}`;
  }

  const WITHIN_ONE_INTRON = start.isDownstream && !end.isDownstream
  if (WITHIN_ONE_INTRON) {
    if (start.isSpliceSite || end.isSpliceSite) return `Splice site ${name}`;
    else return `Intronic ${name}`
  }
  
  return null;
}

/**
 * function intronicType(name, {pos, pos_suffix, pos_end, pos_end_suffix}) {
 *   const RANGE_START_IS_IN_SPLICE_SITE = isInSpliceSite(pos_suffix);
 *   const RANGE_END_IS_IN_SPLICE_SITE = isInSpliceSite(pos_end_suffix);
 *   
 *   if (!pos_end) {
 *     if (pos_end_suffix) throw new Error("Varnomen.cdna.getType: Received a cDNA interval that has a range end offset but no range end locus.");
 *     else return `${RANGE_START_IS_IN_SPLICE_SITE ? "Splice site": "Intronic"} ${name}`;
 *   }
 *
 *   const ONLY_RANGE_END_IS_INTRONIC = !pos_suffix && pos_end_suffix;
 *   if (ONLY_RANGE_END_IS_INTRONIC) return `Splice site ${name}`;   // "(pos)_(pos_end)(pos_end_suffix)"
 *   
 *   const ONLY_RANGE_START_IS_INTRONIC = pos_suffix && !pos_end_suffix;
 *   if (ONLY_RANGE_START_IS_INTRONIC) {     // "(pos)(pos_suffix)" was matched
 *     if (!pos_end && !RANGE_START_IS_IN_SPLICE_SITE) return `Intronic ${name}`;
 *     else return `Splice site ${name}`; // "(pos)(pos_suffix)_(pos_end)" was matched
 *   }
 *   
 *   const RANGE_START_IS_DOWNSTREAM = pos_suffix > 0;
 *   const RANGE_END_IS_DOWNSTREAM = pos_end_suffix > 0;
 *   if (RANGE_START_IS_DOWNSTREAM === RANGE_END_IS_DOWNSTREAM) {
 *     if (RANGE_START_IS_IN_SPLICE_SITE || RANGE_END_IS_IN_SPLICE_SITE) return `Splice site ${name}`;
 *     else return `Intronic ${name}`;
 *   }
 *
 *   const SPANS_AT_LEAST_ONE_EXON = !RANGE_START_IS_DOWNSTREAM && RANGE_END_IS_DOWNSTREAM;
 *   if (SPANS_AT_LEAST_ONE_EXON) return `Gross ${name}`;
 *
 *   const SPANS_MORE_THAN_ONE_INTRON = pos_end - pos > 1
 *   const SPANS_AT_LEAST_ONE_INTRON = RANGE_START_IS_DOWNSTREAM && !RANGE_END_IS_DOWNSTREAM
 *   if (SPANS_AT_LEAST_ONE_INTRON) {
 *     if (SPANS_MORE_THAN_ONE_INTRON) return `Gross ${name}`;
 *     else if (RANGE_START_IS_IN_SPLICE_SITE || RANGE_END_IS_IN_SPLICE_SITE) return `Splice site ${name}`;
 *     else return `Intronic ${name}`
 *   }
 *   
 *   return null;
 * }
 */