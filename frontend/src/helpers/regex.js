export const removeVietnameseTones = (str) => {
    return str
        .normalize("NFD") // Tách dấu khỏi ký tự
        .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
        .toLowerCase(); // Chuyển về chữ thường
};


export const toSlug = (str) => {
  return str
    .toLowerCase() // viết thường
    .normalize('NFD') // chuyển ký tự có dấu thành không dấu
    .replace(/[\u0300-\u036f]/g, '') // xóa dấu
    .replace(/[^a-z0-9\s-]/g, '') // bỏ ký tự đặc biệt
    .trim() // xóa khoảng trắng đầu đuôi
    .replace(/\s+/g, '-') // thay khoảng trắng bằng dấu -
    .replace(/-+/g, '-'); // loại bỏ dấu - thừa
};