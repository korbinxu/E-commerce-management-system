<template>
  <div class>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="添加商品信息" show-icon type="info" :closable="false" center></el-alert>
      <!-- 进度条 -->
      <el-steps center :space="200" :active="+activeIndex" finish-status="success" align-center>
        <el-step font-size="14" title="基础信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs -->
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基础信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTabData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button class="addBtn" @click="addBtn" type="primary">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 展示预览图片 -->
    <el-dialog title="图片预览" :visible.sync="PreviewDialogVisible" width="50%">
      <img class="previewImg" :src="previewPath" alt />
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Add",
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品分类数组
        goods_cat: [],
        // 上传的图片数组
        pics: [],
        goods_introduce: "",
        attrs: []
      },
      rules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ]
      },
      cateList: [],
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 获取到的动态参数列表
      manyTabData: [],
      onlyTabData: [],
      // 上传图片后台地址
      uploadURL: "https://www.liulongbin.top:8888/api/private/v1/upload",
      // 给图片设置请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      // 预览图片绝对路径
      previewPath: "",
      PreviewDialogVisible: false
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    cateId() {
      return this.addForm.goods_cat.length === 3
        ? this.addForm.goods_cat[2]
        : null;
    }
  },
  methods: {
    // 获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");
      this.cateList = res.data;
      // console.log(this.cateList);
    },
    handleChange() {
      // console.log(this.addForm.addForm);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 标签页发生切换
    beforeTabLeave(activeName, oldActiveName) {
      // console.log(activeName, oldActiveName);
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    // 切换标签页触发事件
    async tabClicked() {
      // 访问动态参数面板
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数失败");
        }
        res.data.forEach(
          item =>
            (item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [])
        );
        // console.log(res.data);
        this.manyTabData = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态参数失败");
        }
        // console.log(res.data);
        this.onlyTabData = res.data;
      }
    },
    // 图片预览事件
    handlePreview(file) {
      // console.log(file);
      this.previewPath = file.response.data.url;
      this.PreviewDialogVisible = true;
    },
    // 删除图片事件
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.find(item => item.pic === filePath);
      this.addForm.pics.splice(i, 1);
      // console.log(this.addForm);
    },
    // 图片上传成功事件 返回数据对象
    handleSuccess(response) {
      // console.log(response);
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
      // console.log(this.addForm.pics);
    },
    // 点击添加商品事件
    addBtn() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error("请填写必要的表单项目");
        this.manyTabData.forEach(item => {
          const manyObj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" ")
          };
          this.addForm.attrs.push(manyObj);
        });
        this.onlyTabData.forEach(item => {
          const onlyObj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join
          };
          this.addForm.attrs.push(onlyObj);
        });
        // 利用JSON进行深拷贝 应为addForm里的goods_cat在被级联选择器引用要求是数组
        // 后台要求是字符串 会报错
        const addFormC = JSON.parse(JSON.stringify(this.addForm));
        addFormC.goods_cat = addFormC.goods_cat.join(",");
        // console.log(addFormC);
        const { data: res } = await this.$http.post(`goods`, addFormC);
        if (res.meta.status !== 201) return this.$message.error("添加商品失败");
        this.$message.success("添加商品成功");
        this.$router.push("/goods");
      });
    }
  }
};
</script>
<style lang="less" scoped>
.el-steps {
  margin-top: 20px;
  margin-bottom: 20px;
}

/deep/ .el-step__title {
  font-size: 14px;
}

.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.addBtn {
  margin-top: 20px;
}
</style>