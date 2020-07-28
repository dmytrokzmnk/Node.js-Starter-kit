const mongoose = require("mongoose");

const USER_NAME = "admin_contacts";
const PASSWORD = "cyomMYrhhXe8ZXDB";
const DB = "db-contacts";

const CONNECT_URL = `mongodb+srv://${USER_NAME}:${PASSWORD}@cluster0.o5oqq.mongodb.net/${DB}`;

class Database {
  constructor() {
    this.connection = null;
  }
  errorHandler(err) {
    console.error("Database connection error");
    console.error(err);
    process.exit(1);
  }

  async init() {
    try {
      this.connection = await mongoose.connect(CONNECT_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });

      console.log("Database connection successful");
    } catch (err) {
      this.errorHandler(err);
    }
  }
}

module.exports = new Database();
