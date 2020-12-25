<template>
    <div>
        <el-dialog
            :title="(isNew ? '添加' : '编辑') + '用户'"
            :visible="true"
            :destroy-on-close="true"
            @close="cancelEdit"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
        >
            <el-form :model="form" status-icon :rules="rules" ref="form">
                <el-form-item
                    label="用户名"
                    :label-width="formLabelWidth"
                    prop="username"
                >
                    <el-input
                        v-model="form.username"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="密码"
                    :label-width="formLabelWidth"
                    prop="password"
                >
                    <el-input
                        v-model="form.password"
                        autocomplete="off"
                        type="password"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="确认密码"
                    :label-width="formLabelWidth"
                    prop="checkPassword"
                >
                    <el-input
                        v-model="form.checkPassword"
                        autocomplete="off"
                        type="password"
                    ></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input
                        v-model="form.phoneNum"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input
                        v-model="form.email"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="科室" :label-width="formLabelWidth">
                    <el-select v-model="form.depId" placeholder="请选择科室">
                        <el-option
                            v-for="item in departmentList"
                            :label="item.depName"
                            :key="item.id"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="submit('form')">
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "EditUserDialog",
    props: ["isNew", "userData"], // isNew: 为true则表示新增，否则为编辑; nodeData: 若新增，则为父结点data, 若编辑，则为当前结点data
    emits: ["cancelEdit", "addSuccess", "addFail", "editSuccess", "editFail"],
    data() {
        // validStr不包含空格
        const isValidStr = (str) => {
            return str.indexOf(" ") === -1;
        };
        const checkUsername = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("请输入用户名"));
            }
            setTimeout(() => {
                if (!isValidStr(value)) {
                    callback(new Error("用户名含有非法字符"));
                } else {
                    callback();
                }
            }, 1000);
        };
        const validatePassword = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                if (this.form.checkPassword !== "") {
                    this.$refs.form.validateField("checkPassword");
                }
                callback();
            }
        };
        const validateCheckPassword = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.form.password) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            form: {
                username: "",
                password: "",
                checkPassword: "",
                phoneNum: "",
                email: "",
                depId: "",
            },
            rules: {
                username: [{ validator: checkUsername, trigger: "blur" }],
                password: [{ validator: validatePassword, trigger: "blur" }],
                checkPassword: [
                    { validator: validateCheckPassword, trigger: "blur" },
                ],
            },
            departmentList: [
                { depId: "4", depName: "科室五" },
                { depId: "6", depName: "科室六" },
            ],
            originalPassword: "",
            formLabelWidth: "120px",
        };
    },
    mounted() {
        this.fetchData();
        if (!this.isNew) {
            this.form.username = this.userData.username;
            this.originalPassword = this.userData.password;
            this.form.password = this.userData.password;
            this.form.checkPassword = this.userData.password;
            this.form.phoneNum = this.userData.phoneNum;
            this.form.email = this.userData.email;
            this.form.depId = this.userData.depId;
            // console.log("fetch:", this.userData.depId)
        }
    },
    methods: {
        fetchData() {
            this.axios
                .get("/api/department/getDepartmentLists")
                .then((response) => {
                    // console.log('response:', response.data.patientLists)
                    // this.tableData = response.data.patientLists;
                    this.departmentList = response.data.depList;
                })
                .catch((error) => {
                    // console.log(error);
                    this.$message({
                        message: "error!用户信息读取失败！",
                        duration: 1000,
                    });
                });
        },
        cancelEdit() {
            this.$emit("cancelEdit");
        },
        append() {
            this.axios
                .post("/api/register" + "?depId=" + this.form.depId, {
                    username: this.form.username,
                    password: this.form.password,
                    phoneNum: this.form.phoneNum,
                    email: this.form.email,
                    // depId: this.form.depId,
                })
                .then((response) => {
                    this.$emit("addSuccess");
                })
                .catch(() => {
                    this.$emit("addFail");
                });
        },
        edit() {
            const updatedData = {
                userId: this.userData.userId,
                username: this.form.username,
                phoneNum: this.form.phoneNum,
                email: this.form.email,
                depId: this.form.depId,
            };
            console.log(updatedData);
            if (this.form.password !== this.originalPassword) {
                console.log("edit password");
                updatedData.password = this.form.password;
            }
            this.axios
                .post("/api/updateUser", updatedData)
                .then(() => {
                    this.$emit("editSuccess");
                })
                .catch(() => {
                    this.$emit("editFail");
                });
        },
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // alert("submit!");
                    if (this.isNew) {
                        this.append();
                    } else {
                        this.edit();
                    }
                } else {
                    // console.log("error submit!!");
                    // return false;
                }
            });
        },
    },
};
</script>
