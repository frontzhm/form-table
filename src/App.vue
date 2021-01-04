<template lang="pug">
div#app
    //- 表单区域
    enhanced-el-form(ref="queryForm" :model="model" :schema="schema"  :inline="true" label-width="100px" label-position= "right")
      template(#footer)
        el-form-item.app-btns-box
          el-button.btn(type='primary', @click='clickSearchBtn') 查询
    //- 表格区域
    enhanced-el-table(:data='tableData', :col-configs='colConfigs')
      template(#name="colConfig")
        el-table-column(v-bind="colConfig")
          template(#default="{row}")
            a.link(href="javascript:;" @click="clickName(row)") {{row.name}}
    //- 分页 没有数据的时候不显示
    .pagination-box
      el-pagination(@current-change='changeTablePage', :current-page.sync='pageIndex', :page-size='pageSize', layout='prev, pager, next, jumper', :total='dataCount')
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
      model: {},
      // 表单配置
      schema,
      // 表格配置
      colConfigs,
      // 表格请求的原始数据
      tableDataNative: [],
      // 有数据就意味着可能分页
      pageIndex: 0,
      pageSize: 10,
      isAsc: "",
      sortBy: "",
      // 数据总长度，基本只给分页组件用的
      dataCount: 0
    };
  },
  computed: {
    tableData() {
      return this.tableDataNative;
    }
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      const { pageIndex, pageSize, sortBy, isAsc } = this;
      let params = { ...this.model, pageIndex, pageSize, sortBy, isAsc };
      const res = await this.$api.ApiGetList(params);
      this.tableDataNative = res.data;
      this.dataCount = res.dataCount;
    },

    clickName() {},
    clickSearchBtn() {},
    changeTablePage(curPageIndex) {
      this.pageIndex = curPageIndex;
    }
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
