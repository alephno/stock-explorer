/**
 * Stock information is stored in one record per day of trading. The records
 * have buckets of timeseries data where each record in the bucket is each
 * minute of time series data. One minute is the smallest resolution
 * of data available through the AlphaVantage API and all other resolutions
 * can be constructed from that data.
 */

const mongoose = require("mongoose");

const TimeSeriesSchema = new mongoose.Schema({
  timestamp: Date,
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  volume: Number
});

const StockEntrySchema = new mongoose.Schema({
  symbol: String,
  companyName: String,
  date: Date,
  nEntries: { type: Number, default: 0 },
  finalTimeData: TimeSeriesSchema,
  entries: [TimeSeriesSchema]
});

module.exports = {
  TimeSeries: mongoose.model("TimeSeries", TimeSeriesSchema),
  StockEntry: mongoose.model("StockEntry", StockEntrySchema)
};
