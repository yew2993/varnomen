module.exports = function validate(parsed) {
  let {i1, i2={}} = parsed;

  if (!(i1 && validInterval(i1.p1, i1.p2))) return false;
  if (
    Object.keys(i2).length > 0 &&
    (
      !(i1.open_parens && i1.close_parens) ||
      !(i2.open_parens && i2.close_parens && validInterval(i2.p1, i2.p2))
    )
  ) return false;
  return true;
}

function numberify(input) {
  if (typeof input === "string") return +input;
  if (typeof input === "object") {
    return Object.entries(input).reduce((acc, [key, value]) => ({...acc, [key]: numberify(value)}),{})
  }
  else return input;
}

function validInterval(p1, p2) {
  p1 = numberify(p1);
  p2 = numberify(p2);
  if (!p1 || !validPosition(p1)) return false;
  if (p2) {
    if (!validPosition(p2)) return false;
    p1 = {...p1};
    p2 = {...p2};
    
    if (p1.prefix === "-") p1.pos = -p1.pos
    if (p2.prefix === "-") p2.pos = -p2.pos

    if (
      p1.pos > p2.pos ||
      (
        p1.pos === p2.pos &&
        p1.suffix &&
        p2.suffix &&
        p1.suffix >= p2.suffix
      )
    ) return false;
  }
  return true;
}

function validPosition(position={}) {
  return (
    Number.isInteger(+position.pos) &&
    (!position.prefix || ["+","-"].includes(position.prefix)) &&
    (!position.suffix || Number.isInteger(+position.suffix))
  )
}