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
      <el-table-column
          fixed="right"
          label="操作"
          width="100">
        <template slot-scope="scope">
          <el-button @click="viewQuestionnaireReport(scope.row)" type="text" size="small">查看问卷报告</el-button>
        </template>
      </el-table-column>
    </el-table>

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

      <!-- 查看问卷报告对话框-->
      <el-dialog title="患者已填写问卷" :visible.sync="dialogTableVisible">
          <template>
              <el-table :data="dialogTableData.filter(data => !search || data.key.toLowerCase().includes(search.toLowerCase()))" style="width: 100%">
                  <el-table-column
                          label="问卷标题"
                          prop="key">
                  </el-table-column>
                  <el-table-column
                          label="得分"
                          prop="value">
                  </el-table-column>
                  <el-table-column
                          align="right">
                      <template slot="header">
                          <el-input
                                  v-model="search"
                                  size="mini"
                                  placeholder="输入关键字搜索"/>
                      </template>
                  </el-table-column>
              </el-table>
          </template>
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
                formLabelWidth: '120px',
                dialogFormVisible: false,
                dialogTableVisible: false,
                tableData: [{
                    patientId: '202013233265',
                    name: '王小虎',
                    department: '骨科',
                    phone: '18812341234',
                    idNumber: '530112200001018719'
                }],
                form: {
                    patientId: '',
                    name: '',
                    gender: '',
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
                    ]
                },
                dialogTableData: [{
                    title: '',
                    score: ''
                }],
                search: ''
            }
        },
        created: function () {
            this.init()
        },
        methods: {
            init() {
                const userinfo = JSON.parse(localStorage.getItem('userInfo'))
                this.form.department = userinfo.depName
                this.initTable();
            },
            initTable() {
                this.axios.get('/api/patient/listPatients', {
                    params: {
                        index: 1,
                        limit: 10
                    }
                }).then((request) => {
                    const data = request.data
                    if (data.success){
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
                        alert('submit!');
                        this.dialogFormVisible = false
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            viewQuestionnaireReport(row){
                this.dialogTableVisible = true
                this.titleAndScore(row.patientId)
            },
            titleAndScore(patientId){
                this.axios.get('/api/fillin/getTitleAndScore', {
                    params:{
                        patientId: patientId
                    }
                })
                    .then((request) => {
                        const data = request.data
                        const list = []
                        for (const i in data){
                            list.push({
                                key: i,
                                value: data[i]
                            })
                        }
                        this.dialogTableData = list
                    })
                    .catch(() => {
                        this.$message({message: "错误！问卷报告读取失败", duration: 1000});
                    })
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