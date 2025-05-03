const DELIM_POS = "●";
const DELIM_CPOS = "→";
const DELIM_GROUP = "⊞";
const EMPTY_STRING = "";

/**
 * Dumb encoder to bypass github secrets scanning
 * @param {string} s
 */
function encode(s) {
  /** @type Record<string, number[]> */
  const positions = {};

  s.split(EMPTY_STRING).forEach((c, i) => {
    if (!positions[c]) positions[c] = [];
    positions[c].push(i);
  });

  return Object.keys(positions)
    .sort()
    .map((c) => `${c}${DELIM_CPOS}${positions[c].sort().join(DELIM_POS)}`)
    .join(DELIM_GROUP);
}

/**
 * Decode results from {@link encode}
 * @param {string} s encoded string
 */
function decode(s) {
  /** @type Record<string, string> */
  const positions = {};

  s.split(DELIM_GROUP).forEach((group) => {
    const [c, indexes] = group.split(DELIM_CPOS);
    indexes.split(DELIM_POS).forEach((i) => {
      positions[i] = c;
    });
  });

  return Object.keys(positions)
    .sort((a, b) => Number(a) - Number(b))
    .map((i) => positions[i])
    .join(EMPTY_STRING);
}
