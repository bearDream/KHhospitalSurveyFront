<template>
    <div>
        <div style="text-align: left">
            <el-button type="primary" @click="append">添加用户</el-button>
        </div>
        <div style="width: 100%; height: 30px"></div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="username" label="用户名"> </el-table-column>
            <el-table-column prop="depName" label="科室"> </el-table-column>
            <el-table-column prop="phoneNum" label="电话号码">
            </el-table-column>
            <el-table-column prop="email" label="电子邮件"> </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                    <user-operation-list
                        :rowData="scope.row"
                        @edit="edit(scope.row)"
                        @deleteSuccess="processDeleteSuccess"
                        @deleteFail="processDeleteFail"
                    >
                    </user-operation-list>
                </template>
            </el-table-column>
        </el-table>
        <edit-user-dialog
            v-if="editDialogVisible"
            :isNew="addUser"
            :userData="rowData"
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
import UserOperationList from "./UserOperationList.vue";

export default {
    username: "UserManage",
    components: { EditUserDialog, UserOperationList },
    data() {
        return {
            rowData: "",
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
                    // console.log(error);
                    this.$message({
                        message: "error!用户信息读取失败！",
                        duration: 1000,
                    });
                });
        },
        append() {
            this.addUser = true;
            this.openEditDialog();
            // console.log(this.editDialogVisible)
        },
        edit(rowData) {
            // console.log(rowData)
            this.addUser = false;
            this.rowData = rowData;
            this.openEditDialog();
        },
        openEditDialog() {
            this.editDialogVisible = true;
        },
        closeEditDialog() {
            this.editDialogVisible = false;
        },
        processAddSuccess() {
            this.$message({
                message: "添加成功！",
                type: "success",
            });
            this.closeEditDialog();
            this.fetchData();
        },
        processAddFail() {
            this.$message.error("添加失败！");
            this.closeEditDialog();
        },
        processEditSuccess() {
            this.$message({
                message: "编辑成功！",
                type: "success",
            });
            this.closeEditDialog();
            this.fetchData();
        },
        processEditFail() {
            this.$message.error("编辑失败！");
            this.closeEditDialog();
        },
        processDeleteSuccess() {
            this.$message({
                message: "删除成功！",
                type: "success",
            });
            this.fetchData();
        },
        processDeleteFail() {
            this.$message.error("删除失败！");
        },
    },
};
</script>