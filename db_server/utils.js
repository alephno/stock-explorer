/**
 * Formats one or more time series objects returned from the
 * AlphaVantage API into a format used by this project.
 *
 * @param {Object} series The time series data from AlphaVantage
 * @return {Array<Object>} An array of formatted time series data
 */
function formatAlphaVantageSeries(series) {
  const formatFields = fields => {
    return Object.keys(fields).reduce((obj, key) => {
      // strip the leading "n. " from keys
      const formattedKey = key.slice(3);
      obj[formattedKey] = otherFields[key];
      return obj;
    }, {});
  };

  // AlphaVantage returns an object with time series data keyed to
  // the timestamp. This API expects an array of timeseries data
  // with the timestamp as field in that data.
  return Object.entries(series).map(([timestamp, otherFields]) => {
    return { ...formatFields(otherFields), timestamp: new Date(timestamp) };
  });
}

module.exports = {
  formatAlphaVantageSeries
};
