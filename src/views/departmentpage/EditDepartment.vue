<template>
  <div>
    <el-dialog
      :title="(isNew ? '添加' : '编辑') + departmentType"
      :visible="true"
      :destroy-on-close="true"
      @close="cancelEdit"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="form">
        <el-form-item
          :label="departmentType + '名称'"
          :label-width="formLabelWidth"
        >
          <el-input v-model="form.departmentName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="processSubmit"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const DepartmentEnum = {
  TOP: 1, // 顶级
  INSTITUTION: 2, // 机构
  DEPARTMENT: 3, // 部门
  SECTION: 4, // 科室
};

export default {
  name: "EditDepartment",
  props: ["isNew", "nodeData", "departmentLevel"], // isNew: 为true则表示新增，否则为编辑; nodeData: 若新增，则为父结点data, 若编辑，则为当前结点data
  emits: ["cancelEdit", "addSuccess", "addFail", "editSuccess", "editFail"],
  data() {
    return {
      form: {
        departmentName: "",
      },
      formLabelWidth: "120px",
    };
  },
  computed: {
    departmentType: function () {
      if (DepartmentEnum.INSTITUTION === this.departmentLevel) {
        return "机构";
      } else if (DepartmentEnum.DEPARTMENT === this.departmentLevel) {
        return "部门";
      } else if (DepartmentEnum.SECTION === this.departmentLevel) {
        return "科室";
      } else {
        return "";
      }
    },
  },
  mounted() {
    if (!this.isNew) {
      this.form.departmentName = this.nodeData.deptName;
    }
  },
  methods: {
    cancelEdit() {
      this.$emit("cancelEdit");
    },
    append() {
      this.axios
        .post("/api/department/addDepartment", {
          depName: this.form.departmentName,
          parentId: this.nodeData.id,
        })
        .then((response) => {
          this.$emit("addSuccess", this.nodeData, response.data.dep);
        })
        .catch(() => {
          this.$emit("addFail");
        });
    },
    edit() {
      const updatedData = {
        id: this.nodeData.id,
        depName: this.form.departmentName,
        parentId: this.nodeData.parentId,
      };
      this.axios
        .post("/api/department/updateDepartment", updatedData)
        .then(() => {
          this.$emit("editSuccess", this.nodeData, updatedData);
        })
        .catch(() => {
          this.$emit("editFail");
        });
    },
    processSubmit() {
      if (this.isNew) {
        this.append();
      } else {
        this.edit();
      }
    },
  },
};
</script>
