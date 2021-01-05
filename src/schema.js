export default [
  {
    modelKey: "year",
    label: "年份",
    type: "date-picker",
    props: {
      type: "year",
      format: "yyyy",
      valueFormat: "yyyy",
      style: { width: "150px" }
    }
  },
  {
    modelKey: "quarter",
    label: "季度",
    type: "select",
    props: {
      options: [
        { value: "春", label: "春" },
        { value: "夏", label: "夏" },
        { value: "秋", label: "秋" },
        { value: "冬", label: "冬" }
      ],
      style: { width: "150px" }
    }
  },

  { modelKey: "name", label: "姓名", type: "input", style: { width: "150px" } }
];
