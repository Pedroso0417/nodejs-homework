import { Contact } from "../models/contactsModel.js";
// prettier-ignore
import {
  contactValidation,
  favoriteValidation,
} from "../validations/validation.js";
import { v4 as uuidv4 } from "uuid";
import { httpError } from "../helpers/httpError.js";

const getAllContacts = async (_req, res, next) => {
  try {
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);

    if (!result) {
      throw httpError(404, "Contact ID Not Found");
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { error } = contactValidation.validate(req.body);

    if (error) {
      throw httpError(400, "missing required name field");
    }

    const newContact = new Contact({ id: uuidv4(), ...req.body });
    const result = await newContact.save();

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);

    if (!result) {
      throw httpError(404);
    }

    res.json({
      message: "Contact deleted",
    });
  } catch (error) {
    next(error);
  }
};

const updateContactById = async (req, res, next) => {
  try {
    const { error } = contactValidation.validate(req.body);
    if (error) {
      throw httpError(400, "missing fields");
    }

    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });

    if (!result) {
      throw httpError(404);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { error } = favoriteValidation.validate(req.body);
    if (error) {
      throw httpError(400, "missing field favorite");
    }

    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });

    if (!result) {
      throw httpError(404);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {
  getAllContacts,
  getContactById,
  addContact,
  deleteContactById,
  updateContactById,
  updateStatusContact,
};
