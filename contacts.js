const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  try {
    const dataContacts = await fs.readFile(contactsPath, "utf-8");

    console.table(JSON.parse(dataContacts));
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  if (!contactId) return;

  try {
    const dataContacts = await fs.readFile(contactsPath, "utf-8");
    const data = JSON.parse(dataContacts);
    const contactsFiltered = data.find((contact) => contact.id === contactId);
    console.table(contactsFiltered);
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(contactId) {
  try {
    const dataContacts = await fs.readFile(contactsPath, "utf-8");
    const data = JSON.parse(dataContacts);
    const contactsFiltered = data.filter((contact) => contact.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(contactsFiltered));
    console.log(`delete contact id-${contactId} was successful`);
    console.table(contactsFiltered);
  } catch (error) {
    console.error(error);
  }
}

async function addContact(name, email, phone) {
  if (!name && !email && !phone) return;

  const newContact = {
    id: Date.now(),
    name,
    email,
    phone,
  };

  try {
    const dataContacts = await fs.readFile(contactsPath, "utf-8");
    const dataAddedNewContact = [...JSON.parse(dataContacts), newContact];

    await fs.writeFile(contactsPath, JSON.stringify(dataAddedNewContact));

    console.table(dataAddedNewContact);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
