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
        if (sortBy && isAsc) {
          isAsc === "true"
            ? data.sort((x, y) => x[sortBy] - y[sortBy])
            : data.sort((x, y) => y[sortBy] - x[sortBy]);
          console.log(sortBy, isAsc);
        }

        const curPageData = data.slice(
          (pageIndex - 1) * pageSize,
          pageSize * pageIndex
        );
        const r = res.json({
          state: 1,
          data: curPageData,
          dataCount: data.length
        });
        return r;
      });
    }
  }
};
