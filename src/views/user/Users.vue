<template>
  <div>
    <h3>
      <!-- 面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </h3>

    <!-- 卡片视频 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 状态选择 -->
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="light" content="修改角色" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="light" content="删除角色" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="light" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户功能 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      center
      @close="addDialgClose"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="formRules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <el-form ref="ruleFormRef" :model="editUserForm" :rules="formRules" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoledialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Users",
  data() {
    // 检验邮箱规则
    var checkEmail = (rule, value, callback) => {
      // 邮箱的正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的邮箱"));
    };
    // 检验手机号码
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的手机号码"));
    };
    return {
      // 获取用户列表数据
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 每页显示的数量
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 是否显示添加用户对话框
      addDialogVisible: false,
      // 是否显示修改用户对话框
      editDialogVisible: false,
      // 查询到的用户信息
      editUserForm: {},
      // 要添加的用户对象
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 通用表单规则
      formRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 分配角色默认显示不打开
      setRoledialogVisible: false,
      // 需要分配角色的个人信息
      userInfo: {},
      // 获取到角色列表
      rolesList: [],
      // 选中角色保存的id值(selectedRoleId保存的是value的值)
      selectedRoleId: ""
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户数据列表
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户数据失败，请重新刷新页面");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 监听一页显示多少条数据
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码发生改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听swith开关的状态改变
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("更新用户状态失败");
        // 更新失败重置回用户的状态
        userInfo.mg_state = !userInfo.mg_state;
      }
      this.$message.success("更新用户信息成功");
    },
    // 关闭添加用户对话框清空数据
    addDialgClose() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加新的用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid);
        if (!valid) return;
        // 添加用户请求
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) return this.$message.error("添加用户失败");
        this.$message.success("添加用户成功");
        // 隐藏对话框
        this.addDialogVisible = false;
        // 刷新页面
        this.getUserList();
      });
    },
    // 编辑用户对象框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      }
      this.editUserForm = res.data;
      this.editDialogVisible = true;
    },
    // 监听修改用户框关闭
    editDialogClosed() {
      this.$refs.ruleFormRef.resetFields();
    },
    // 验证修改的用户信息合法性并发送请求
    editUserInfo() {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) return;
        // 发送修改信息请求
        const { data: res } = await this.$http.put(
          "users/" + this.editUserForm.id,
          {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile
          }
        );
        if (res.meta.status !== 200)
          return this.$message.error("用户信息更新失败");
        this.editDialogVisible = false;
        this.getUserList();
        this.$message.success("用户信息更新成功");
      });
    },
    // 通过id删除用户
    async removeUserById(id) {
      // 通过注册的$confirm来确认是否删除用户
      const confirmRes = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
        // 这里要用catch捕捉 不然报错
      ).catch(err => err);
      // 此时返回的结果是字符串 "confirm"
      if (confirmRes != "confirm") return this.$message.info("已经取消删除");
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) return this.$message.error("删除用户失败");
      this.$message.success("删除用户成功");
      this.getUserList();
    },
    //展示分配角色对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;
      // 获取角色列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
      this.setRoledialogVisible = true;
    },
    // 分配角色后 发送请求
    async saveRoleInfo() {
      if (!this.selectedRoleId)
        return this.$message.error("请选择要分配的角色");
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      );
      if (res.meta.status !== 200) return this.$message.error("更新角色失败");
      this.$message.success("更新角色成功");
      this.getUserList();
      this.setRoledialogVisible = false;
    },
    // 关闭分配角色对话框后 清空selectedRoleId数据
    setRoleDialogClosed() {
      this.selectedRoleId = "";
    }
  }
};
</script>
<style lang="less" scoped>
</style>