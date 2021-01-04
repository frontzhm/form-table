---
title: 让表单和表格这种页面，快速搞定
tags: js
categories: js
---

做后台系统的时候，估计接触最多的就是`表单 + 表格`，以此进行**增删改查**的操作。

本篇，努力将**增删改查**的通用逻辑分析清除，使用的时候，能通过简单的配置，就搞定一个复杂的页面。

可以的话，可以先看下准备篇：

- [让el-form更好用，通过配置的方式](https://juejin.cn/post/6911964058644135943)
- [让el-table更好用，通过配置的方式](https://juejin.cn/post/6912308157997907982)

本篇代码，涉及的文件比较多，想要看细节，可以参照[github](https://juejin.cn/post/691230815799790798244444444)

## 1. 显示查询的表单和表格

第一步，先将表单显示出来，表格的数据通过请求拿到数据，也显示出来。

之前封装过表格和表单插件。  

一个页面，先看下，查询的条件，将其变成一个表单的`model`，表格就更简单，将**列**进行配置化。

当然查询条件，除了表单，还外加下分页和排序数据，`pageIndex pageSize sortBy isAsc`。

第一版展示效果：

![table-form2](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/table-form2.png)

第一版核心代码，详细代码见文末：
![table-form1](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/table-form1.png)
![table-form6](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/table-form6.png)

[github上](https://juejin.cn/post/691230815799790798244444444)可以切换`c1分支`

## 2. 增加排序和页码变化

排序的话:

- 不分页，直接配置`colConfig`的`sortable:true`，就在该列的表头显示`排序符号`了
- 分页，需要请求数据的话，配置`colConfig`的`sortable:custom`，在组件上写上`@sort-change="sortChange"`，点击排序符号的时候，就会触发`sort-change`事件。

页码变化的话: 分页组件有事件`current-change`，相应的设置`pageIndex`

监测`pageIndex sortBy isAsc`发生变化的时候，请求表格数据

![table-form7](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/table-form7.png)
![table-form8](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/table-form8.gif)


## 代码

### 代码：1. 显示查询的表单和表格

这边使用`vue create`创建了项目。

整体的代码略微复杂，加了mock数据、加了请求、全局用$api。

相应的文件有很多：但是除了`App.vue`文件，其余文件后期不动。

目录结构这样，红框的文件就是需要动的文件

![table-form3](https://blog-huahua.oss-cn-beijing.aliyuncs.com/blog/code/table-form3.png)

#### App.vue

App.vue

```vue
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
  //- 分页
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
    this.getTableData();
  },
  methods: {
    async getTableData() {
      const { pageIndex, pageSize, sortBy, isAsc } = this;
      let params = { ...this.model, pageIndex, pageSize, sortBy, isAsc };
      const res = await this.$api.ApiGetList(params);
      this.tableData = res.data;
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

```

#### 表单和表格的配置：colConfig.js、 schema.js

colConfig.js

```js
export default [
  { prop: "orderNumber", label: "序号" },
  {
    slotName: "name",
    label: "姓名"
  },
  {
    prop: "year",
    label: "年份"
  },
  {
    prop: "quarter",
    label: "季度"
  },

  { prop: "score", label: "分数", sortable: "custom" }
];

```

schema.js

```js
export default [
  {
    modelKey: "year",
    label: "年份",
    type: "date-picker",
    default: new Date().getFullYear() + "",
    props: {
      type: "year"
    },
    format: "yyyy",
    valueFormat: "yyyy"
  },
  {
    modelKey: "term",
    label: "季度",
    type: "select",
    props: {
      options: [
        { value: "春", label: "春" },
        { value: "夏", label: "夏" },
        { value: "秋", label: "秋" },
        { value: "冬", label: "冬" }
      ]
    }
  },

  { modelKey: "name", label: "姓名", type: "input" }
];

```

#### 两个组件：EnhancedElTable.vue和EnhancedElForm.vue

EnhancedElTable.vue

```vue
<template lang="pug">
  el-table(ref="elTable" :data="data" v-bind="$attrs" v-on="$listeners")
    template(v-for="colConfig in colConfigs")
      slot(v-if="colConfig.slotName" :name="colConfig.slotName" v-bind="colConfig")
      el-table-column(v-else v-bind="colConfig" :key="colConfig.prop")
</template>

<script>
export default {
  name: "enhanced-el-table",
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    colConfigs: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  mounted() {
    console.log(444, this.tableData);
    const methods = [
      "clearSelection",
      "toggleRowSelection",
      "toggleAllSelection",
      "toggleRowExpansion",
      "setCurrentRow",
      "clearSort",
      "clearFilter",
      "doLayout",
      "sort"
    ];
    methods.forEach(method => (this[method] = this.$refs.elTable[method]));
  }
};
</script>

```

EnhancedElForm.vue

```vue
<template lang="pug">
el-form(ref="elForm" :model="model" :rules="rules" v-bind="$attrs" v-on="$listeners")
  slot(name="header")
  
  template(v-for="config in schema" )
    slot(v-if="config.slotName" :name="config.slotName" v-bind="config")
 
    el-form-item(v-else :label="config.label" :prop="config.modelKey" :key="config.modelKey")
      el-radio-group(v-if="config.type==='radio-group'"   v-model="model[config.modelKey]" v-bind="config.props")
        el-radio(v-for="(item,index) in config.props.options" :key="index" :label="typeof item==='object'?item.value:item") {{ typeof item==='object'?item.label:item }}
      el-checkbox-group(v-else-if="config.type==='checkbox-group'"   v-model="model[config.modelKey]" v-bind="config.props")
        el-checkbox(v-for="(item,index) in config.props.options" :key="index" :label="typeof item==='object'?item.value:item") {{ typeof item==='object'?item.label:item }}
      el-select(v-else-if="config.type==='select'"   v-model="model[config.modelKey]" v-bind="config.props")
        el-option(v-for="(item,index) in config.props.options" :key="index" :value="typeof item==='object'?item.value:item" :label="typeof item==='object'?item.label:item")

      component(v-else :is="'el-'+config.type" v-model="model[config.modelKey]" v-bind="config.props") {{config.text}}

  slot(name="footer")
</template>
<script>
export default {
  name: "enhanced-el-form",
  props: {
    model: {
      type: Object,
      default() {
        return {};
      }
    },
    schema: {
      type: Array,
      default() {
        return {};
      }
    }
  },
  computed: {
    rules() {
      return this.schema.reduce((acc, cur) => {
        acc[cur.modelKey] = cur.rules;
        // 日期组件可能有children
        const hasChildren = cur.children && cur.children.length;
        hasChildren &&
          cur.children.forEach(child => (acc[child.modelKey] = child.rules));
        return acc;
      }, {});
    }
  },
  mounted() {
    // el-form上面的方法继承过来
    const methods = [
      "validate",
      "validateField",
      "resetFields",
      "clearValidate"
    ];
    methods.forEach(method => (this[method] = this.$refs.elForm[method]));
  }
};
</script>

```

#### mock数据部分：.env.mock、mock.js、vue.config.js

.env.mock

```js
NODE_ENV = 'mock'
```

mock.js

```js
module.exports = Array.from({ length: 28 }, (v, i) => ({
  orderNumber: i + 1,
  year: "199" + i - 0 + 1,
  quarter: i % 4 === 1 ? "春" : i % 4 === 2 ? "夏" : i % 4 === 3 ? "秋" : "冬",
  name: `李三${i + 1}`,
  score: `8${i}`
}));

```

vue.config.js

```js
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

```

#### 加了请求：api/index.js

api/index.js

```js
import axios from "axios";

// 所有请求统一配置
const instance = axios.create({ timeout: 5000 });

// 请求拦截器，统一加些appid、sign之类的
instance.interceptors.request.use(
  config => {
    config.method === "get" && (config.params.appid = "颜酱");
    return config;
  },
  error => Promise.error(error)
);

// 响应拦截器，错误的统一处理
instance.interceptors.response.use(
  // 请求成功
  res => {
    //   200的状态就是请求成功了
    const isSuccess = res.status === 200;
    if (!isSuccess) {
      Promise.reject(res);
      return;
    }
    return Promise.resolve(res.data);
  },
  // 请求失败
  error => {
    console.log(error);
    if (!window.navigator.onLine) {
      this.$message.error("网不好");
      return;
    }
    const { response } = error;
    if (response) {
      this.$message.error(response.message);
    }
  }
);

export const ApiGetList = ({ pageIndex, pageSize, sortBy, isAsc, year, quarter, name }) =>
  instance.get("/api/list", {
    params: { pageIndex, pageSize, sortBy, isAsc, year, quarter, name }
  });

```

#### 全局api：main.js

main.js

```js
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import * as api from "@/api";
// 让全局方便访问api
Vue.prototype.$api = api;

Vue.use(ElementUI);

new Vue({
  el: "#app",
  render: h => h(App)
});

```

### 代码：2. 增加排序和页码变化

App.vue

```vue
<template lang="pug">
div#app
  //- 表单区域
  enhanced-el-form(:model="model" :schema="schema"  :inline="true" label-width="100px" label-position= "right")
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

    clickName() {},
    clickSearchBtn() {}
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

```