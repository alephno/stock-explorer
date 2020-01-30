const { StockEntry } = require("../models/stock");

/**
 * Provides functions for interfacing with the time series database.
 *
 * @param {MongooseConnection} connection - A mongoose connection to a database
 */
function StockController() {
  const selectionExclusions =
    "-_id -__v -finalTimeData._id -finalTimeData.__v -entries._id -entries.__v";

  /**
   * Saves time series data to the database. Can optionally apply a
   * formatting function to the time series data before saving. A stock
   * *must* be identified by a symbol and the company name as symbols are
   * sometimes reused by diiferent companies.
   *
   * @param {string} symbol - The stock ticker symbol
   * @param {string} companyName - The name of the company associated with the symbol
   * @param {Array<Object>} - The raw time series data
   * @param {function} [] fmtFn - An optional function to map the raw time series data to a schema compatible format
   * @returns {Promise} A promise that resolves to the new document
   */
  function saveTimeSeries(symbol, companyName, timeSeries, fmtFn) {
    const now = new Date();
    // strip time information off of date
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const timeSeriesData = fmtFn
      ? timeSeries.map(series => frmtFn(series))
      : timeSeries;

    return StockEntry.findOneAndUpdate(
      { symbol, companyName, date: today },
      {
        $push: { entries: { $each: timeSeriesData } },
        finalTimeData: timeSeriesData[timeSeriesData.length - 1],
        $inc: { nEntries: timeSeriesData.length }
      },
      { upsert: true, new: true }
    )
      .lean()
      .select(selectionExclusions);
  }

  /**
   * Get the 24 hour time series data for a stock identified by symbol
   * and companyName for the trading days between startDate (inclusive)
   * and endDate (inclusive).
   *
   * @param {string} symbol - The stock ticker symbol
   * @param {string} companyName - The name of the company
   * @param {Date} startDate - The starting date for the query
   * @param {Date} endDate - The ending data for the query
   * @return {Promise} - Promise that resolves to an Array of time series data
   */
  function getDailyTimeSeries(symbol, companyName, startDate, endDate) {
    return StockEntry.find({
      symbol,
      companyName,
      date: { $gte: startDate, $lte: endDate }
    })
      .lean()
      .select(selectionExclusions)
      .then(TradingDays => {
        return TradingDays.reduce(
          (entries, day) => entries.concat(day.finalTimeData),
          []
        );
      });
  }

  return {
    saveTimeSeries,
    getDailyTimeSeries
  };
}

module.exports = StockController;
