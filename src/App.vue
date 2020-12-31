<template lang="pug">
div#app
    //- 表单区域
    enhanced-el-form(ref="queryForm" :model="model" :schema="schema"  :inline="true" label-width="100px" label-position= "right")
      template(#footer)
        el-form-item.app-btns-box
          el-button.btn(type='primary', @click='clickSearchBtn') 查询
    //- 表格区域
    enhanced-el-table(:data='tableData', :col-configs='colConfigs' :is-loading="isShowTableLoading")
      template(#className="colConfig")
        el-table-column(v-bind="className")
          template(#default="{row}")
            a.link(href="javascript:;" @click="clickClassName(row)") {{row.className}}
    //- 分页 没有数据的时候不显示
    .pagination-box
      el-pagination(@current-change='changeTablePage', :current-page.sync='otherParams.pageIndex', :page-size='otherParams.pageSize', layout='prev, pager, next, jumper', :total='dataLength')
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
      // 表格的加载图标
      isShowTableLoading: false,
      // 表格请求的原始数据
      tableDataNative: [],
      // 有数据就意味着可能分页
      otherParams: {
        pageIndex: 0,
        pageSize: 10,
        isAsc: "",
        sortBy: ""
      },
      // 数据总长度，基本只给分页组件用的
      dataLength: 0
    };
  },
  computed: {
    // 处理之后的数据
    tableData() {
      return this.tableDataNative;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 页面加载执行的方法
    async init() {
      // 这个有异步操作，需要用await
      await this.setAreaOptions();
      this.getTableData();
    },

    clickSearchBtn() {
      this.getTableData();
    },
    clickExportBtn() {
      // 导出的参数和查询的参数基本一样，但是数据不分页
      let params = { ...this.getAjaxQueryParams() };
      params.pageSize = 0;
      this.$api.AjaxExportTable(params);
    },
    clickResetBtn() {
      // 重置页数的相关参数
      this.otherParams = this.initialParams.otherParams;
      // 查询
      this.getTableData();
    },
    // ajax请求表格数据，并赋值，因为后端的数据很多时候前端需要处理下，在computed那边加一层过滤
    async ajaxQuery(params) {
      let res = await this.$api.AjaxQuery(params);
      this.tableDataNative = res.data.data;
      this.dataLength = res.data.dataCount;
    },

    getTableData() {
      let params = this.getAjaxQueryParams();
      this.ajaxQuery(params);
    },
    // 请求的参数 包括表单和页数相关的数据
    getAjaxQueryParams() {
      let formParams = this.getFormData();
      let params = { ...this.otherParams, ...formParams };
      // 设置首次查询的参数,这里注意对象是引用，必须深度复制下
      this.initialParams ||
        (this.initialParams = {
          formParams: { ...formParams },
          otherParams: { ...this.otherParams }
        });
      console.log(this.initialParams);
      return params;
    },
    changeTablePage(page) {
      this.otherParams.pageIndex = page;
      this.getTableData();
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
