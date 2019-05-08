function removeCaptureGroup(input) {
  return input.replace(/\(\?\<.*\>\s+/g, "(")
}

module.exports = {
  removeCaptureGroup,
}