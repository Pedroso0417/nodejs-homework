import { v4 as uuidv4 } from "uuid";
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Joi from "joi";

const router = express.Router();

// Helper to get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contactsPath = path.join(__dirname, "../../models/contacts.json");

// Function to read contacts from file
const readContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
};

// Function to write contacts to file
const writeContacts = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

// Schema for validating contact data
const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

// Get all contacts
router.get("/", async (req, res, next) => {
  try {
    const contacts = await readContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

// Get a contact by ID
router.get("/:contactId", async (req, res, next) => {
  try {
    const contacts = await readContacts();
    const contact = contacts.find((c) => c.id === req.params.contactId);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
});

// Add a new contact
router.post("/", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const contacts = await readContacts();
    const newContact = { id: uuidv4(), ...req.body }; // Generate UUID for ID
    contacts.push(newContact);
    await writeContacts(contacts);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

// Delete a contact by ID
router.delete("/:contactId", async (req, res, next) => {
  try {
    let contacts = await readContacts();
    const index = contacts.findIndex((c) => c.id === req.params.contactId);
    if (index !== -1) {
      const [deletedContact] = contacts.splice(index, 1);
      await writeContacts(contacts);
      res.json({ message: "contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
});

// Update a contact by ID
router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    let contacts = await readContacts();
    const index = contacts.findIndex((c) => c.id === req.params.contactId);
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...req.body };
      await writeContacts(contacts);
      res.json(contacts[index]);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
});

export { router };
