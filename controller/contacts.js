const contactsModel = require("../models/contacts");

exports.listContacts = async (req, res) => {
  try {
    const contacts = await contactsModel.find({});

    res.send({ contacts });
  } catch (error) {
    console.error("Error", error);
    res.status(500).send({ message: message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact = await contactsModel.findById({ _id: contactId });

    if (!contact) {
      return res.status(404).send({ message: "Not found" });
    }

    res.send({ contact });
  } catch (error) {
    console.error("Error", error);
    res.status(500).send({ message: message });
  }
};

exports.addContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const contact = await contactsModel.create({ name, email, phone });

    res.status(200).send({ contact });
  } catch (error) {
    console.error("Error", error);
    res.status(500).send({ message: message });
  }
};

exports.removeContact = async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact = await contactsModel.findByIdAndDelete({ _id: contactId });

    res.send({ message: "contact deleted" });
  } catch (error) {
    console.error("Error", error);
    res.status(500).send({ message: message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;

    const contact = await contactsModel.findById({ _id: contactId });

    if (!contact) {
      return res.status(404).send({ message: "Not found" });
    }

    contact.name = name;
    contact.email = email;
    contact.phone = phone;

    await contact.save();

    res.status(200).send();
  } catch (error) {
    console.error("Error", error);
    res.status(500).send({ message: message });
  }
};
