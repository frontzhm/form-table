const nativeData = require("./mock");
module.exports = {
  devServer: {
    before(app) {
      app.get("/api/list", (req, res) => {
        console.log(req.query);
        const {
          pageIndex,
          pageSize,
          sortBy,
          isAsc,
          year,
          quarter,
          name
        } = req.query;
        let data = [...nativeData];
        // 查询条件过滤
        data = data.filter(item => {
          let res = true;
          year && (res = item.year === year);
          quarter && (res = item.quarter === quarter);
          name && (res = item.name === name);
          return res;
        });
        data =
          sortBy && isAsc
            ? data.sort((x, y) =>
                isAsc ? x[sortBy] - y[sortBy] : y[sortBy] - x[sortBy]
              )
            : data;
        data = data.slice((pageIndex - 1) * pageSize, pageSize * pageIndex);
        const r = res.json({ state: 1, data, dataCount: data.length });
        return r;
      });
    }
  }
};
