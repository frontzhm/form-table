module.exports = Array.from({ length: 28 }, (v, i) => ({
  orderNumber: i + 1,
  year: "199" + i - 0 + 1,
  quarter: i % 4 === 1 ? "春" : i % 4 === 2 ? "夏" : i % 4 === 3 ? "秋" : "冬",
  name: `李三${i + 1}`,
  score: `8${i}`
}));
