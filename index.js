const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const PORT = 5555;
const contactsPath = path.join(__dirname, "./db/contacts.json");

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: `http://localhost:${PORT}`,
  })
);

app.get("/contacts", async (req, res) => {
  try {
    const contactsText = await fs.readFile(contactsPath);
    const contactsData = JSON.parse(contactsText);
    res.send({ contactsData });
  } catch (error) {
    console.error("Error!", error);
    res.status(502).send({ message: "502 Bad Gateway" });
  }
});

app.get("/contacts/:contactId", async (req, res) => {
  try {
    const contactId = parseFloat(req.params.contactId);
    const contactsText = await fs.readFile(contactsPath, "utf-8");
    const contactsData = JSON.parse(contactsText);
    const contactFounded = contactsData.find(
      (contact) => contact.id === contactId
    );

    if (!contactFounded) {
      return res.status(404).send({ message: "Not found" });
    }

    res.send({ contactFounded });
  } catch (error) {
    console.error("Error!", error);
    res.status(502).send({ message: "502 Bad Gateway" });
  }
});

app.post("/contacts", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const id = Date.now();
    if (!name || !email || !phone) {
      return res.status(400).send({ message: "missing required params" });
    }
    const contactsText = await fs.readFile(contactsPath, "utf-8");
    const contactsData = JSON.parse(contactsText);
    const contactNew = { id, name, email, phone };
    contactsData.push(contactNew);
    await fs.writeFile(contactsPath, JSON.stringify(contactsData), "utf-8");
    res.status(201).send({ contactNew });
  } catch (error) {
    console.error("Error!", error);
    res.status(502).send({ message: "502 Bad Gateway" });
  }
});

app.delete("/contacts/:contactId", async (req, res) => {
  try {
    const contactId = parseFloat(req.params.contactId);
    const contactsText = await fs.readFile(contactsPath, "utf-8");
    const contactsData = JSON.parse(contactsText);
    const contactIndex = contactsData.findIndex(
      (contact) => contact.id === contactId
    );
    const contactName = contactsData[contactIndex].name;
    if (contactIndex === -1) {
      return res.status(404).send({ message: "Not found" });
    }
    contactsData.splice(contactIndex, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contactsData), "utf-8");
    res.send({ message: `contact ${contactName} deleted` });
  } catch (error) {
    console.error("Error!", error);
    res.status(502).send({ message: "502 Bad Gateway" });
  }
});

app.patch("/contacts/:contactId", async (req, res) => {
  try {
    const contactId = parseFloat(req.params.contactId);
    const contactsText = await fs.readFile(contactsPath, "utf-8");
    const contactsData = JSON.parse(contactsText);
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).send({ message: "missing required params" });
    }

    const contactIndex = contactsData.findIndex(
      (contact) => contact.id === contactId
    );
    if (contactIndex === -1) {
      return res.status(404).send({ message: "Not found" });
    }
    contactsData[contactIndex] = {
      ...contactsData[contactIndex],
      name,
      email,
      phone,
    };
    await fs.writeFile(contactsPath, JSON.stringify(contactsData), "utf-8");
    res.send({ message: `contact id:${contactId} updated` });
  } catch (error) {
    console.error("Error!", error);
    res.status(502).send({ message: "502 Bad Gateway" });
  }
});

app.listen(PORT, (err) => {
  err && console.error("error", err);
  console.info("Operation complete");
});
