import DangVien from "../models/dangvien/dangvien.model.js";
export const create = async (payload) => {
  const count = await DangVien.countDocuments();

  const newData = {
    ...payload,
    so_tt: count + 1,
  };

  return DangVien.create(newData);
};
export const getAll = () => {
  return DangVien.find({ deletedAt: null }).sort({ createdAt: 1 });
};

export const getById = (id) => {
  return DangVien.findById(id);
};

export const update = (id, payload) => {
  return DangVien.findByIdAndUpdate(id, payload, { new: true });
};

export const remove = async (id) => {
  const deleted = await DangVien.findById(id);
  if (!deleted || deleted.deletedAt) return null;

  const deletedSTT = deleted.so_tt;

  await DangVien.findByIdAndUpdate(id, {
    deletedAt: new Date(),
  });
  await DangVien.updateMany(
    {
      so_tt: { $gt: deletedSTT },
      deletedAt: null,
    },
    { $inc: { so_tt: -1 } },
  );

  return { success: true };
};
