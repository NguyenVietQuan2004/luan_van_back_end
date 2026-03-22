import cuocthidangky from "../models/contest/contest.registration.model.js";

// CREATE
export const createRegistration = async (data) => {
  return await cuocthidangky.create(data);
};

// GET ALL
export const getAllRegistrations = async () => {
  return await cuocthidangky.find().populate("contest_id").populate("members.party_member_id").sort({ createdAt: -1 });
};

// GET BY ID
export const getRegistrationById = async (id) => {
  const data = await cuocthidangky.findById(id).populate("contest_id").populate("members.party_member_id");

  if (!data) throw new Error("Registration not found");
  return data;
};

// UPDATE
export const updateRegistration = async (id, data) => {
  const updated = await cuocthidangky.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!updated) throw new Error("Registration not found");
  return updated;
};

// DELETE
export const deleteRegistration = async (id) => {
  const deleted = await cuocthidangky.findByIdAndDelete(id);

  if (!deleted) throw new Error("Registration not found");
  return { message: "Deleted registration successfully" };
};
