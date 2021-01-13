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
        // 拿到查询条件
        const conditions = { year, quarter, name };
        // 看查询条件有没有值
        const keysOfHasValue = Object.keys(conditions).filter(
          key => conditions[key]
        );
        const isHasCondition = keysOfHasValue.length > 0;
        // 如果有查询条件的话就过滤下
        if (isHasCondition) {
          data = data.filter(item =>
            keysOfHasValue.every(key => item[key] === conditions[key])
          );
        }

        // 如果有排序的话
        if (sortBy && isAsc) {
          isAsc === "true"
            ? data.sort((x, y) => x[sortBy] - y[sortBy])
            : data.sort((x, y) => y[sortBy] - x[sortBy]);
        }
        let dataCount;
        // 如果有分页的话
        if (pageSize) {
          dataCount = data.length;
          data = data.slice((pageIndex - 1) * pageSize, pageSize * pageIndex);
        }
        return res.json({
          state: 1,
          data,
          dataCount
        });
      });
    }
  }
};
