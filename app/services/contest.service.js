import cuocthi from "../models/contest/contest.model.js";
import cuocthidangky from "../models/contest/contest.registration.model.js";
// CREATE
export const createContest = async (data) => {
  return await cuocthi.create(data);
};

// GET ALL
export const getAllContests = async () => {
  return await cuocthi.find().sort({ createdAt: -1 });
};

// GET BY ID
export const getContestById = async (id) => {
  const contest = await cuocthi.findById(id);
  if (!contest) throw new Error("Contest not found");
  return contest;
};

// UPDATE
export const updateContest = async (id, data) => {
  const contest = await cuocthi.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!contest) throw new Error("Contest not found");
  return contest;
};

// DELETE
export const deleteContest = async (id) => {
  const contest = await cuocthi.findById(id);
  if (!contest) throw new Error("Contest not found");
  // check có đăng ký không
  const hasRegistration = await cuocthidangky.exists({ contest_id: id });

  if (hasRegistration) {
    throw new Error("Không thể xóa cuộc thi vì đã có đăng ký tham gia");
  }

  await cuocthi.findByIdAndDelete(id);

  return { message: "Deleted contest successfully" };
};
