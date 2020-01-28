const axios = require("axios");
const { buildSchema } = require("graphql");

const schema = buildSchema(`
	type Query {
		stock_price(symbol: String!, interval: Interval!): [TimeSeries]!
	}

	enum Interval {
		DAILY,
		MIN_1,
		MIN_5,
		MIN_15,
		MIN_30,
		MIN_60
	}

	type TimeSeries {
		timestamp: String!
		high: Float!
		low: Float!
		open: Float!
		close: Float
		volume: Int!
	}
`);

const formatAPIUrl = (symbol, interval) => {
  const func =
    interval === "DAILY" ? "TIME_SERIES_DAILY" : "TIME_SERIES_INTRADAY";

  const intervalMapping = {
    MIN: "1min",
    MIN: "5min",
    MIN: "15min",
    MIN: "30min",
    MIN: "60min"
  };

  const interval_ =
    interval === "DAILY" ? `&interval=${intervalMapping[interval]}` : "";

  return `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
};

formatAPIResponse = data => {
  const timeSeries = data["Time Series (Daily)"];
  return Object.entries(timeSeries).map(([timestamp, otherFields]) => {
    // strip the '1. ' from the field names (open, close, etc)
    const formattedFields = Object.keys(otherFields).reduce((obj, key) => {
      const formattedKey = key.slice(3);
      obj[formattedKey] = otherFields[key];
      return obj;
    }, {});

    return { ...formattedFields, timestamp };
  });
};

const root = {
  stock_price: ({ symbol, interval }) => {
    return axios
      .get(formatAPIUrl(symbol, interval))
      .then(res => formatAPIResponse(res.data));
  }
};

module.exports = {
  schema,
  root
};
