const nativeData = Array.from({ length: 28 }, (v, i) => ({
  orderNumber: i + 1,
  projectName: "高中" + i + 1,
  teacherCount: 60 + i + 1,
  lessonCount: 948 + i + 1,
  uploadPercent: Math.random(),
  passPercent: Math.random()
}));
module.exports = {
  devServer: {
    before(app) {
      app.get("/api/list", (req, res) => {
        console.log(req.query);
        const { pageIndex, pageSize, sortBy, isAsc } = req.query;
        let data =
          sortBy && isAsc
            ? nativeData.sort((x, y) =>
                isAsc ? x[sortBy] - y[sortBy] : y[sortBy] - x[sortBy]
              )
            : nativeData;
        data = data.slice(pageIndex * pageSize, pageSize * (pageIndex - 0 + 1));
        const r = res.json({ state: 1, data, dataCount: data.length });
        return r;
      });
    }
  }
};
