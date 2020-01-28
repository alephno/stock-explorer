require("dotenv").config();
const express = require("express");
const graphqlHTTP = require("express-graphql");
const { schema, root } = require("./schema");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(port, () => console.log(`Listening on port ${port}...`));
