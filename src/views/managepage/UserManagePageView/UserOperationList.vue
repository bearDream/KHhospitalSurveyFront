<template>
    <div>
        <el-button size="mini" @click="edit">编辑</el-button>
        <el-button
            v-popover:delete_popover
            style="font-size: 12px"
            size="mini"
            type="danger"
        >
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
                            remove();
                        }
                    "
                >
                    确定
                </el-button>
            </div>
        </el-popover>
    </div>
</template>

<script>
export default {
    props: ["rowData"],
    emits: ["deleteSuccess", "deleteFail", "edit"],
    name: "UserOperationList",
    data() {
        return {
            deletePopoverVisible: false,
        };
    },
    methods: {
        remove() {
            this.axios
                .post("/api/delUser?userId=" + this.rowData.userId)
                .then(() => {
                    this.$emit("deleteSuccess");
                })
                .catch(() => {
                    this.$emit("deleteFail");
                });
        },
        edit() {
            this.$emit("edit");
        },
    },
};
</script>
