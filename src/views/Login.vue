<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像 -->
      <div class="avatar-box">
        <img src="@/assets/logo/logo.png" alt />
      </div>
      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login-form"
      >
        <!-- userName -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont iconuser"></el-input>
        </el-form-item>
        <!-- passWord -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont iconmimasuo"></el-input>
        </el-form-item>
        <el-form-item class="login-button">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginBtn">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "component_name",
  data() {
    return {
      // 表单的数据绑定
      loginForm: {
        username: "admin",
        password: "123456"
      },
      // 表单验证规则对象
      loginFormRules: {
        userName: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 重置登录
    resetLoginBtn() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      // 表单预验证
      // valid：bool类型
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return;
        // this.$http.post('login', this.loginForm): 返回值为promise
        // 返回值为promise，可加await简化操作 相应的也要加async
        const { data: res } = await this.$http.post("login", this.loginForm);
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error("登录失败");
        this.$message.success("登录成功");
        // 1、将登陆成功之后的token, 保存到客户端的sessionStorage中; localStorage中是持久化的保存
        //   1.1 项目中出现了登录之外的其他API接口，必须在登陆之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem("token", res.data.token);
        // 2、通过编程式导航跳转到后台主页, 路由地址为：/home
        this.$router.push("/home");
      });
    }
  }
};
</script>
<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100vh;
}

.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.avatar-box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #eee;

  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login-form {
  position: absolute;
  box-sizing: border-box;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
}

.login-button {
  display: flex;
  justify-content: flex-end;
}
</style>