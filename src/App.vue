<template lang="pug">
div#app
  //- 表单区域
  enhanced-el-form(:model="model" :schema="schema"  :inline="true" label-width="70px" label-position= "right")
    template(#footer)
      el-form-item.app-btns-box
        el-button.btn(type='primary', @click='clickSearchBtn') 查询
  //- 表格区域
  enhanced-el-table(@sort-change="sortChange" :data='tableData', :col-configs='colConfigs')
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
      model: {},
      // 表单配置
      schema,
      // 表格配置
      colConfigs,
      // 表格请求的原始数据
      tableData: [],
      // 有数据就意味着可能分页
      pageIndex: 0,
      pageSize: 10,
      isAsc: "",
      sortBy: "",
      // 数据总长度，基本只给分页组件用的
      dataCount: 0
    };
  },
  mounted() {
    this.sortConditionDefault = { isAsc: this.isAsc, sortBy: this.sortBy };
    this.getTableData();
  },
  watch: {
    isAsc() {
      this.getTableData();
    },
    sortBy() {
      this.getTableData();
    },
    pageIndex() {
      this.getTableData();
    }
  },
  methods: {
    clickSearchBtn() {
      this.pageIndex = 1;
      this.sortBy = this.sortConditionDefault.sortBy;
      this.isAsc = this.sortConditionDefault.isAsc;
      this.getTableData();
    },
    changeCurrentPage(curPageIndex) {
      this.pageIndex = curPageIndex;
    },
    async getTableData() {
      const { pageIndex, pageSize, sortBy, isAsc } = this;
      let params = { ...this.model, pageIndex, pageSize, sortBy, isAsc };
      const res = await this.$api.ApiGetList(params);
      this.tableData = res.data;
      this.dataCount = res.dataCount;
    },
    sortChange({ column, prop, order }) {
      console.log(column, prop, order);
      this.isAsc = order === "ascending";
      this.sortBy = prop;
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
