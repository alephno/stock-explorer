const expect = require("chai").expect;

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const StockEntryController = require("../controllers/stock");

let mongodb;

before(async () => {
  mongodb = new MongoMemoryServer();
  const mongoUri = await mongodb.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true });
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongodb.stop();
});

describe("StockEntryController", function() {
  it("Should save time series data", async () => {
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const open = 0;
    const close = 1;
    const high = 2;
    const low = 0;
    const volume = 1;
    const symbol = "MSFT";
    const companyName = "Microsoft";

    const timeSeries = {
      timestamp: now,
      open,
      close,
      high,
      low,
      volume
    };

    const expectedRecord = {
      symbol,
      companyName,
      date,
      nEntries: 1,
      finalTimeData: timeSeries,
      entries: [timeSeries]
    };

    const controller = new StockEntryController();

    const record = await controller.saveTimeSeries(symbol, companyName, [
      timeSeries
    ]);
    //expectObjectContains(record, expectedRecord);
    expect(record).to.deep.equal(expectedRecord);
  });

  it("Should return the daily time series for a range of dates", async () => {
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const open = 0;
    const close = 1;
    const high = 2;
    const low = 0;
    const volume = 1;
    const symbol = "MSFT";
    const companyName = "Microsoft";

    const timeSeries = {
      timestamp: now,
      open,
      close,
      high,
      low,
      volume
    };

    const controller = new StockEntryController();
    await controller.saveTimeSeries(symbol, companyName, [timeSeries]);

    const end = new Date();
    const start = new Date(2000, 1, 1);
    const dailyTimeSeries = await controller.getDailyTimeSeries(
      symbol,
      companyName,
      start,
      end
    );
    expect(dailyTimeSeries).to.deep.equal([timeSeries]);
  });
});
