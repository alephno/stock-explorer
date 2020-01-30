/**
 * Stock information is stored in one record per day of trading. The records
 * have buckets of timeseries data where each record in the bucket is each
 * minute of time series data. One minute is the smallest resolution
 * of data available through the AlphaVantage API and all other resolutions
 * can be constructed from that data.
 */

const { Schema } = require("mongoose");

function StockModel(connection) {
  const TimeSeriesSchema = new Schema({
    timestamp: Date,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    volume: Number
  });

  const StockEntrySchema = new Schema({
    symbol: String,
    companyName: String,
    date: Date,
    nEntries: { type: Number, default: 0 },
    finalTimeData: TimeSeriesSchema,
    entries: [TimeSeriesSchema]
  });

  return {
    TimeSeries: connection.model("TimeSeries", TimeSeriesSchema),
    StockEntry: connection.model("StockEntry", StockEntrySchema)
  };
}

module.exports = StockModel;
