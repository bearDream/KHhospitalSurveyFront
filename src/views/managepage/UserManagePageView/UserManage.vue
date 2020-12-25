<template>
    <div>
        <div style="text-align: left">
            <el-button type="primary" @click="append">添加用户</el-button>
        </div>
        <div style="width: 100%; height: 30px"></div>
        <el-table :data="tableData" style="width: 100%">
            <!-- <el-table-column label="用户名">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>用户名: {{ scope.row.username }}</p>
                        <p>科室: {{ scope.row.depId }}</p>
                        <p>电话号码: {{ scope.row.phoneNum }}</p>
                        <p>电子邮件: {{ scope.row.email }}</p>
                        <div slot="reference" class="username-wrapper">
                            <el-tag size="medium">{{
                                scope.row.username
                            }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column> -->
            <el-table-column prop="username" label="用户名"> </el-table-column>
            <el-table-column prop="depId" label="科室"> </el-table-column>
            <el-table-column prop="phoneNum" label="电话号码"> </el-table-column>
            <el-table-column prop="email" label="电子邮件"> </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        @click="edit(scope.$index, scope.row)"
                        >编辑</el-button
                    >
                    <el-button
                        v-popover:delete_popover
                        size="mini"
                        type="danger"
                        >删除</el-button
                    >
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
                                        remove(scope.$index, scope.row);
                                    }
                                "
                            >
                                确定
                            </el-button>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <edit-user-dialog
            v-if="editDialogVisible"
            :isNew="addUser"
            :departmentLevel="departmentLevel"
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
import EditUserDialog from "./EditUserDialog.vue";

export default {
    username: "UserManage",
    components: { EditUserDialog },
    data() {
        return {
            tableData: [],
            editDialogVisible: false,
            addUser: false, // true为添加，false为编辑
            deletePopoverVisible: false,
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.axios
                .get("/api/getUserLists")
                .then((response) => {
                    // console.log('response:', response.data.patientLists)
                    this.tableData = response.data.patientLists;
                })
                .catch((error) => {
                    console.log(error);
                    this.$message({
                        message: "error!用户信息读取失败！",
                        duration: 1000,
                    });
                });
        },
        // parentData: 添加的结点的父结点data，level: 父结点level
        append() {
            this.addUser = true;
            this.openEditDialog();
            // console.log(this.editDialogVisible)
        },
        // data: 当前结点data，level: 当前结点level
        edit(data, level) {
            // this.addDepartment = false;
            // this.departmentLevel = level;
            // this.nodeData = data;
            // this.openEditDialog();
        },
        remove(index, data) {
            this.axios
                .post("/api/delUser?userId=" + data.userId)
                .then(() => {
                    this.$message({
                        message: "删除成功！",
                        type: "success",
                    });
                    this.fetchData();
                    // const parent = node.parent;
                    // const childList = parent.data.childList || parent.data;
                    // const index = childList.findIndex((d) => d.id === data.id);
                    // childList.splice(index, 1);
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
            this.fetchData();
        },
        processAddFail() {
            // this.$message.error("添加失败！");
            // this.closeEditDialog();
        },
        processEditSuccess(originalData, updatedData) {
            // this.$message({
            //     message: "编辑成功！",
            //     type: "success",
            // });
            // this.closeEditDialog();
            // originalData.depName = updatedData.depName;
            // // this.fetchData();
        },
        processEditFail() {
            // this.$message.error("编辑失败！");
            // this.closeEditDialog();
        },
    },
};
</script>