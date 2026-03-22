export const parseJsonField = (jsonString) => {
  if (!jsonString) return {};
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    throw new Error("Dữ liệu JSON không hợp lệ");
  }
};
