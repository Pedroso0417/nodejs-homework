import fs from "fs/promises";
import path from "path";

const contactsPath = path.join(__dirname, "../models/contacts.json");

// Function to list all contacts
const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
};

// Function to get a contact by ID
const getContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === contactId);
};

// Function to remove a contact by ID
const removeContact = async (contactId) => {
  let contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index !== -1) {
    const removedContact = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removedContact[0];
  }
  return null;
};

// Function to add a new contact
const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = { id: Date.now().toString(), ...body };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

// Function to update an existing contact
const updateContact = async (contactId, body) => {
  let contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...body };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
  }
  return null;
};

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
