<template>
    <div>
        <div style="text-align: left;">
            <el-button type="primary" @click="dialogFormVisible = true">添加患者</el-button>
        </div>
        <div style="width: 100%; height: 30px;"></div>
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    prop="patientId"
                    label="患者号"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="patientName"
                    label="姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="gender"
                    label="性别">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="手机号">
            </el-table-column>
            <el-table-column
                    prop="idNumber"
                    label="身份证">
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 50, 100, 200]"
                    :page-size="limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>

        <!-- 添加患者对话框 -->
        <el-dialog title="添加患者" :visible.sync="dialogFormVisible">
            <el-form :model="form" status-icon :rules="rules" ref="form">
                <el-form-item label="患者号" prop="patientId" :label-width="formLabelWidth">
                    <el-input v-model="form.patientId" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="patientName" :label-width="formLabelWidth">
                    <el-input v-model="form.patientName" required=true auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender" :label-width="formLabelWidth">
                    <el-radio-group v-model="form.gender" style="margin-top: 10px;">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="科室" prop="department" :label-width="formLabelWidth">
                    <el-input v-model="form.department" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone" :label-width="formLabelWidth">
                    <el-input v-model="form.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证" prop="idNumber" :label-width="formLabelWidth">
                    <el-input v-model="form.idNumber" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PatientManagement",

        data() {
            const checkPhone = (rule, value, callback) => {
                if (!value) {
                    return callback();
                } else {
                    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
                    console.log(reg.test(value));
                    if (reg.test(value)) {
                        callback();
                    } else {
                        return callback(new Error('请输入正确的手机号'));
                    }
                }
            };
            return {
                limit: 10,
                currentPage: 1,
                total: 0,
                formLabelWidth: '120px',
                userinfo: {},
                dialogFormVisible: false,
                tableData: [{
                    patientId: '202013233265',
                    name: '王小虎',
                    department: '骨科',
                    phone: '18812341234',
                    idNumber: '530112200001018719'
                }],
                form: {
                    patientId: '',
                    patientName: '',
                    gender: 1,
                    department: '',
                    phone: '',
                    idNumber: ''
                },
                rules: {
                    patientId: [
                        { required: true, message: '请输入患者号', trigger: 'blur' },
                        { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
                    ],
                    patientName: [
                        { required: true, message: '请输入患者姓名', trigger: 'blur' },
                        { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                    ],
                    phone: [
                        {validator: checkPhone, trigger: 'blur'}
                    ]
                }
            }
        },
        created: function () {
            this.init()
        },
        methods: {
            init() {
                this.userinfo = JSON.parse(localStorage.getItem('userInfo'))
                this.form.department = this.userinfo.depName
                this.initTable(1, 10);
            },
            initTable(index, limit) {
                this.axios.get('/api/patient/listPatients', {
                    params: {
                        index: index,
                        limit: limit
                    }
                }).then((request) => {
                    const data = request.data
                    if (data.success){
                        this.total = data.total
                        const list = data.listPatients
                        list.forEach(i => {
                            i.gender === 1 ? i.gender = '男' : i.gender = '女'
                        })
                        this.tableData = data.listPatients
                    }
                    console.log(request.data)
                }).catch(() => {
                    this.$message({message: "错误！患者数据读取失败", duration: 1000});
                })
            },
            submitForm(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.axios
                            .post("/api/patient/addPatient", {
                                patientId: this.form.patientId,
                                patientName: this.form.patientName,
                                gender: this.form.gender,
                                departmentId: this.userinfo.depId,
                                phone: this.form.phone,
                                idNumber: this.form.idNumber
                            })
                            .then((response) => {
                                this.$notify({
                                    title: '添加成功',
                                    message: '患者数据添加成功',
                                    type: 'success'
                                });
                                this.$refs['form'].resetFields();
                                this.dialogFormVisible = false;
                                this.initTable(1, 10)
                            })
                            .catch(() => {
                                this.$emit("addFail");
                            });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleSizeChange(val) {
                this.initTable(1, val)
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.initTable(val, this.limit)
                console.log(`当前页: ${val}`);
            }
        }
    }
</script>

<style scoped>
    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .el-col {
        border-radius: 4px;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
</style>