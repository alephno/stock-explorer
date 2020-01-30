const expect = require("chai").expect;

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const StockEntryController = require("../controllers/stock");

let mongodb;
let connection;

before(async () => {
  mongodb = new MongoMemoryServer();
  const mongoUri = await mongodb.getUri();
  connection = await mongoose.createConnection(mongoUri, {
    useNewUrlParser: true
  });
});

after(async () => {
  await connection.close();
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

    const expectObjectContains = (obj1, obj2) => {
      Object.keys(obj2).forEach(key => {
        if (typeof obj2[key] === "object") {
          expectObjectContains(obj1[key], obj2[key]);
        } else {
          expect(obj1).to.haveOwnProperty(key, obj2[key]);
        }
      });
    };

    const controller = new StockEntryController(connection);

    const record = await controller.saveTimeSeries(symbol, companyName, [
      timeSeries
    ]);
    //expectObjectContains(record, expectedRecord);
    expect(record).to.deep.equal(expectedRecord);
  });
});
