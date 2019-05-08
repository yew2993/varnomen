const fs = require("fs");
const location = require("./cdna/patterns/location");
const cDNA = require("./cdna");
const cases = require("./testData");

let testResults = fullPosition(cases)
fs.writeFile("./testResults.json", JSON.stringify(testResults, null, 2), e => {
  if (e) console.log(e)
  else console.log("Done")
});

function fullPosition(cases) {
  return cases.map(({mut}) => {
    let result = cDNA.parse(mut, {patternName: "template"});
    if (!result) return null;
    
    let {position} = result;
    let parsed = location.parse(position, {debug: true});//{pattern: newCdna.patterns.fullPosition});

    if (!parsed) return {position};
    else return parsed;
    // return {mut, valid: newCdna.validate(parsed), parsed};
  })
}