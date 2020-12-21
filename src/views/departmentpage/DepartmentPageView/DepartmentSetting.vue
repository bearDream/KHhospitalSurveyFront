<template>
    <div>
        <el-tree
            :data="departmentData"
            :props="defaultProps"
            empty-text=""
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent"
        >
        </el-tree>
        <edit-department-dialog
            v-if="editDialogVisible"
            :departmentLevel="departmentLevel"
            :isNew="addDepartment"
            :nodeData="nodeData"
            @cancelEdit="closeEditDialog"
            @addSuccess="processAddSuccess"
            @addFail="processAddFail"
            @editSuccess="processEditSuccess"
            @editFail="processEditFail"
        />
    </div>
</template>

<script>
import EditDepartmentDialog from "./EditDepartmentDialog.vue";
const DepartmentEnum = {
    TOP: 1, // 顶级
    INSTITUTION: 2, // 机构
    DEPARTMENT: 3, // 部门
    SECTION: 4, // 科室
};

export default {
    components: { EditDepartmentDialog },
    name: "DepartmentSetting",
    data() {
        return {
            departmentData: [{ id: -1000, depName: "全部", childList: [] }],
            defaultProps: {
                children: "childList",
                label: "depName",
            },
            editDialogVisible: false,
            addDepartment: false, // true为添加，false为编辑
            departmentLevel: DepartmentEnum.INSTITUTION,
            nodeData: -1,
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.axios
                .get("/api/department/getDepartmentAll")
                .then((response) => {
                    // console.log('response:', response.data.json[0])
                    this.departmentData[0].childList = response.data.json;
                })
                .catch(() => {
                    this.$message({
                        message: "error!机构信息读取失败！",
                        duration: 1000,
                    });
                });
        },
        // parentData: 添加的结点的父结点data，level: 父结点level
        append(parentData, parentLevel) {
            this.addDepartment = true;
            this.departmentLevel = parentLevel + 1;
            this.nodeData = parentData;
            if (DepartmentEnum.TOP === parentLevel) {
                this.nodeData.id = 0;
            }
            this.openEditDialog();
            // console.log(this.editDialogVisible)
        },
        // data: 当前结点data，level: 当前结点level
        edit(data, level) {
            this.addDepartment = false;
            this.departmentLevel = level;
            this.nodeData = data;
            this.openEditDialog();
        },
        remove(node, data) {
            this.axios
                .post("/api/department/deleteById?id=" + data.id)
                .then(() => {
                    this.$message({
                        message: "删除成功！",
                        type: "success",
                    });
                    // this.fetchData();
                    const parent = node.parent;
                    const childList = parent.data.childList || parent.data;
                    const index = childList.findIndex((d) => d.id === data.id);
                    childList.splice(index, 1);
                })
                .catch(() => {
                    this.$message.error("删除失败！");
                });
        },
        renderContent(h, { node, data, store }) {
            // 叶节点不能再添加子节点，顶级节点不能删除
            // console.log(node.label, node.level);
            // console.log("node:", node);
            // console.log("data:", data);
            return (
                <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                    <span>
                        <span>{node.label}</span>
                    </span>
                    <span>
                        {DepartmentEnum.SECTION !== node.level ? (
                            <el-button
                                style="font-size: 12px;"
                                type="text"
                                on-click={() => this.append(data, node.level)}
                            >
                                <i class="el-icon-plus"></i>
                                添加
                            </el-button>
                        ) : (
                            ""
                        )}
                        {DepartmentEnum.TOP !== node.level ? (
                            <el-button
                                style="font-size: 12px;"
                                type="text"
                                on-click={() => this.edit(data, node.level)}
                            >
                                <i class="el-icon-edit"></i>
                                编辑
                            </el-button>
                        ) : (
                            ""
                        )}
                        {DepartmentEnum.TOP !== node.level ? (
                            <el-button
                                style="font-size: 12px;"
                                type="text"
                                on-click={() => this.remove(node, data)}
                            >
                                <i class="el-icon-delete"></i>
                                删除
                            </el-button>
                        ) : (
                            ""
                        )}
                    </span>
                </span>
            );
        },
        openEditDialog() {
            this.editDialogVisible = true;
        },
        closeEditDialog() {
            this.editDialogVisible = false;
        },
        processAddSuccess(parentData, data) {
            this.$message({
                message: "添加成功！",
                type: "success",
            });
            this.closeEditDialog();
            if (!parentData.childList) {
                this.$set(parentData, "childList", []);
            }
            console.log(parentData, data);
            parentData.childList.push(data);
            // this.fetchData();
        },
        processAddFail() {
            this.$message.error("添加失败！");
            this.closeEditDialog();
        },
        processEditSuccess(originalData, updatedData) {
            this.$message({
                message: "编辑成功！",
                type: "success",
            });
            this.closeEditDialog();
            originalData.depName = updatedData.depName;
            // this.fetchData();
        },
        processEditFail() {
            this.$message.error("编辑失败！");
            this.closeEditDialog();
        },
    },
};
</script>
