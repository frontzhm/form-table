<template lang="pug">
div#app
  //- 表单区域
  enhanced-el-form(ref="queryForm" :model="model" :schema="schema"  :inline="true" label-width="70px" label-position= "right")
    template(#footer)
      el-form-item.app-btns-box
        el-button.btn(type='primary', @click='clickSearchBtn') 查询
        el-button.btn(plain, @click='clickResetBtn') 重置
        el-button.btn(plain, @click='clickCreateBtn') 新建
  //- 表格区域
  enhanced-el-table(ref="mainTable" @sort-change="sortChange" :data='tableData', :col-configs='colConfigs')
    template(#name="colConfig")
      el-table-column(v-bind="colConfig")
        template(#default="{row}")
          a.link(href="javascript:;" @click="clickName(row)") {{row.name}}
    template(#action="colConfig")
      el-table-column(v-bind="colConfig")
        template(#default="{row}")
          div(style="color:#409eff;cursor:pointer" @click="clickEdit(row)") 编辑
  //- 分页
  .pagination-box
    el-pagination(@current-change='changeCurrentPage', :current-page.sync='pageIndex', :page-size='pageSize', layout='prev, pager, next, jumper', :total='dataCount')
  el-dialog(:title="dialogFormTitle" :visible.sync="isShowDialogForm" center width="340px")
    enhanced-el-form(ref="dialogForm" :model="dialogFormModel" :schema="dialogFormSchema"  label-width="70px" label-position= "right")
      template(#footer)
        el-form-item
          el-button.btn( plain,@click='clickCancelOfDialogForm') 取消
          el-button.btn(type='primary', @click='clickConfirmOfDialogForm') 确定
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
      sortConfig: { isAsc: "", sortBy: "" },
      // 数据总长度，基本只给分页组件用的
      dataCount: 0,
      // 弹框 新建的各种参数
      isShowDialogForm: false,
      dialogFormTitle: "新建学生",
      dialogFormModel: {},
      dialogFormSchema: schema.map(item => {
        let res = { ...item };
        res.rules = [{ required: true, trigger: "blur", message: "不能为空" }];
        return res;
      })
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
    clickEdit(row) {
      // 这里后期确定是编辑还是添加，以此做一些不同的操作
      this.isEdit = true;
      // 注意这里必须是这行在下行的前面，为了后期的resetFields因为页面首次点击编辑的话，表单初始值是空的。如果下面那行在上面的话，页面先点击编辑后点击新建的话，resetFields就会失效。nextTick也是保证这个功能
      this.isShowDialogForm = true;
      this.$nextTick(() => {
        this.dialogFormModel = { ...row };
      });
      // 保留当前行的信息，修改成功之后，将更新的信息赋值
      this.curRow = row;
      // 可能需要修改标题
      this.dialogFormTitle = "修改";
    },
    async clickConfirmOfDialogForm() {
      const isValid = await this.$refs.dialogForm.validate();
      if (!isValid) {
        return;
      }
      // 鉴于时间不多，不在多写接口，表达意思就行
      if (this.isEdit) {
        // await this.$api.editData(this.dialogFormModel)
        this.$message.success("修改成功~");
        // 这里需要用遍历的办法更新当前row的信息，必须等接口成功
        Object.keys(this.dialogFormModel).forEach(key => {
          this.curRow[key] = this.dialogFormModel[key];
        });
      } else {
        // await this.$api.createData(this.dialogFormModel)
        this.$message.success("新建成功~");
        // 重置查询条件和排序
        this.resetQueryAndSort();
      }
      this.isShowDialogForm = false;
    },
    clickCreateBtn() {
      // 这里后期确定是编辑还是添加，以此做一些不同的操作
      this.isEdit = false;
      this.dialogFormTitle = "新建";
      this.$refs.dialogForm && this.$refs.dialogForm.resetFields();
      this.isShowDialogForm = true;
    },
    clickCancelOfDialogForm() {
      this.isShowDialogForm = false;
    },
    resetQueryAndSort() {
      // 重置查询表单，将所有字段值重置为初始值并移除校验结果
      this.$refs.queryForm.resetFields();
      // 重置页数
      this.pageIndex = 1;
      // 重置排序
      this.sortConfig = { ...this.sortConfigDefault };
    },
    clickResetBtn() {
      this.resetQueryAndSort();
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
