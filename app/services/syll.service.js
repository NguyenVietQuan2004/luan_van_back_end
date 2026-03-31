import Syllabus from "../models/syll.model.js";

export const createSyllabus = (data) => {
  return Syllabus.create(data);
};

export const getAllSyllabus = () => {
  return Syllabus.find().sort({ extractedAt: -1 });
};

export const getSyllabusById = (id) => {
  return Syllabus.findById(id);
};

export const updateSyllabus = (id, data) => {
  return Syllabus.findByIdAndUpdate(id, data, { new: true });
};

export const deleteSyllabus = (id) => {
  return Syllabus.findByIdAndDelete(id);
};
