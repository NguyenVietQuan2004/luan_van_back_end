import * as registrationService from "../services/contest.registration.service.js";
import { parseJsonField } from "../utils/utils.js";

// CREATE
export const createRegistrationCtrl = async (req, res) => {
  try {
    // parse data
    const parsedData = parseJsonField(req.body.data);

    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    const data = await registrationService.createRegistration({
      ...parsedData,
      certificate_file: filePath,
    });

    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL
export const getAllRegistrationsCtrl = async (req, res) => {
  try {
    const data = await registrationService.getAllRegistrations();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET BY ID
export const getRegistrationByIdCtrl = async (req, res) => {
  try {
    const data = await registrationService.getRegistrationById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// UPDATE
export const updateRegistrationCtrl = async (req, res) => {
  try {
    const parsedData = parseJsonField(req.body.data);

    let updateData = { ...parsedData };

    if (req.file) {
      updateData.certificate_file = `/uploads/${req.file.filename}`;
    }

    const data = await registrationService.updateRegistration(req.params.id, updateData);

    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
export const deleteRegistrationCtrl = async (req, res) => {
  try {
    const data = await registrationService.deleteRegistration(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
