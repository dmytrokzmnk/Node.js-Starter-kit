const express = require("express");
const cors = require("cors");

const database = require("./db/contacts");
const contacts = require("./routers/contacts");

const app = express();

const PORT = 5555;

async function main() {
  await database.init();

  app.use(express.json());
  app.use(cors());
  app.use(contacts);

  app.use((req, res) => {
    res.status(404).send({ message: "Page not found" });
  });

  app.listen(PORT, (err) => {
    err && console.error("error", err);
    console.info("Operation complete");
  });
}

main().catch(console.error);
