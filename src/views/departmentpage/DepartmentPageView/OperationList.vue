<template>
    <div>
        <span
            style="
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                padding-right: 8px;
            "
        >
            <span>
                <el-button
                    v-if="DepartmentEnum.SECTION !== node.level"
                    style="font-size: 12px"
                    type="text"
                    @click="append(data, node.level)"
                >
                    <i class="el-icon-plus"></i>
                    添加
                </el-button>
                <el-button
                    v-if="DepartmentEnum.TOP !== node.level"
                    style="font-size: 12px"
                    type="text"
                    @click="edit(data, node.level)"
                >
                    <i class="el-icon-edit"></i>
                    编辑
                </el-button>
                <el-button
                    v-if="DepartmentEnum.TOP !== node.level"
                    v-popover:delete_popover
                    style="font-size: 12px"
                    type="text"
                >
                    <i class="el-icon-delete"></i>
                    删除
                </el-button>
                <el-popover
                    ref="delete_popover"
                    placement="top"
                    width="160"
                    v-model="deletePopoverVisible"
                >
                    <p>确定删除吗？</p>
                    <div style="text-align: right; margin: 0">
                        <el-button
                            size="mini"
                            type="text"
                            @click="deletePopoverVisible = false"
                        >
                            取消
                        </el-button>
                        <el-button
                            type="primary"
                            size="mini"
                            @click="
                                () => {
                                    deletePopoverVisible = false;
                                    remove(node, data);
                                }
                            "
                        >
                            确定
                        </el-button>
                    </div>
                </el-popover>
            </span>
        </span>
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
    props: ["data", "node"],
    components: { EditDepartmentDialog },
    name: "OperationList",
    data() {
        return {
            editDialogVisible: false,
            addDepartment: false, // true为添加，false为编辑
            departmentLevel: DepartmentEnum.INSTITUTION,
            nodeData: -1,
            deletePopoverVisible: false,
            DepartmentEnum,
        };
    },
    methods: {
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
