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
    </div>
</template>

<script>
import OperationList from "./OperationList";

export default {
    name: "DepartmentSetting",
    data() {
        return {
            departmentData: [{ id: -1000, depName: "全部", childList: [] }],
            defaultProps: {
                children: "childList",
                label: "depName",
            },
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
                        <OperationList data={data} node={node}></OperationList>
                    </span>
                </span>
            );
        },
    },
};
</script>
