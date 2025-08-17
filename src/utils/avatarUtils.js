/**
 * Lấy 2 chữ cái đầu từ tên hiển thị.
 * Ví dụ: "Trần Văn Tú" -> "TT", "Tú Anh" -> "TA", "Long" -> "L"
 * @param {string} name Tên hiển thị của người dùng
 * @returns {string} 2 chữ cái đầu
 */
export const getInitials = (name = "") => {
  if (!name) return "?";
  const words = name.trim().split(" ");
  if (words.length > 1) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const avatarColors = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#607d8b",
];

/**
 * Tạo ra một màu nền nhất quán cho mỗi người dùng dựa trên tên của họ.
 * @param {string} name Tên hiển thị của người dùng
 * @returns {string} Mã màu hex
 */
export const generateAvatarColor = (name = "") => {
  if (!name) return "#607d8b";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % avatarColors.length);
  return avatarColors[index];
};
