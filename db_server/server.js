const express = require("express");

const app = express();
const port = process.env.PORT || 8899;

app.listen(port, () => console.log(`Listening on port ${port}...`));
