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
  {
    modelKey: "area",
    label: "大区",
    type: "select",
    props: {
      filterable: true,
      default: "",
      options: null
    }
  },
  { modelKey: "name", label: "姓名", type: "input" },
  { modelKey: "code", label: "编号", type: "input" }
];
