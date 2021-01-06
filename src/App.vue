<template lang="pug">
div#app
  //- 表单区域
  enhanced-el-form(ref="queryForm" :model="model" :schema="schema"  :inline="true" label-width="70px" label-position= "right")
    template(#footer)
      el-form-item.app-btns-box
        el-button.btn(type='primary', @click='clickSearchBtn') 查询
        el-button.btn(plain, @click='clickResetBtn') 重置
  //- 表格区域
  enhanced-el-table(ref="mainTable" @sort-change="sortChange" :data='tableData', :col-configs='colConfigs')
    template(#name="colConfig")
      el-table-column(v-bind="colConfig")
        template(#default="{row}")
          a.link(href="javascript:;" @click="clickName(row)") {{row.name}}
  //- 分页
  .pagination-box
    el-pagination(@current-change='changeCurrentPage', :current-page.sync='pageIndex', :page-size='pageSize', layout='prev, pager, next, jumper', :total='dataCount')
</template>
<script>
import EnhancedElTable from "@/components/EnhancedElTable";
import EnhancedElForm from "@/components/EnhancedElForm";
import schema from "./schema";
import colConfigs from "./colConfigs";
export default {
  name: "app",
  components: { EnhancedElTable, EnhancedElForm },

  data() {
    return {
      // 表单数据
      model: { quarter: "" },
      // 表单配置
      schema,
      // 表格配置
      colConfigs,
      // 表格请求的原始数据
      tableData: [],
      // 有数据就意味着可能分页
      pageIndex: 0,
      pageSize: 10,
      sortConfig: { isAsc: "", sortBy: "" },
      // 数据总长度，基本只给分页组件用的
      dataCount: 0
    };
  },
  mounted() {
    // 存下默认，这里需要复制，引用类型你懂的
    this.sortConfigDefault = { ...this.sortConfig };
    this.getTableData();
  },
  watch: {
    sortConfig: {
      handler(newValue) {
        console.log(newValue);
        const order =
          newValue.isAsc === ""
            ? null
            : newValue.isAsc === false
            ? "descending"
            : "ascending";
        const hasOrder = order !== null;
        const mainTable = this.$refs.mainTable;
        // 有排序的时候，需要设置，没有排序的时候直接清除掉
        hasOrder
          ? mainTable.sort(newValue.sortBy, order)
          : mainTable.clearSort();
        this.getTableData();
      },
      deep: true
    },

    pageIndex() {
      this.getTableData();
    }
  },
  methods: {
    clickResetBtn() {
      // 重置查询表单，将所有字段值重置为初始值并移除校验结果
      this.$refs.queryForm.resetFields();
      // 重置页数
      this.pageIndex = 1;
      // 重置排序
      this.sortConfig = { ...this.sortConfigDefault };
    },
    clickSearchBtn() {
      this.pageIndex = 1;
      this.getTableData();
    },
    changeCurrentPage(curPageIndex) {
      this.pageIndex = curPageIndex;
    },
    async getTableData() {
      const { pageIndex, pageSize } = this;
      let params = { ...this.model, ...this.sortConfig, pageIndex, pageSize };
      const res = await this.$api.ApiGetList(params);
      this.tableData = res.data;
      this.dataCount = res.dataCount;
    },
    sortChange({ column, prop, order }) {
      console.log(1, column, prop, order);
      this.sortConfig.isAsc = order === null ? "" : order === "ascending";
      this.sortConfig.sortBy = prop;
    },

    clickName() {}
  }
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.el-table {
  border: 1px solid #e8e8e8;
  width: 90%;
  margin: auto;
}
.pagination-box {
  margin-top: 20px;
  text-align: center;
}
</style>
