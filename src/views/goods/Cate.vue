<template>
  <div class>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row class="addCate">
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        index-text="#"
        show-index
        :selection-type="false"
        :expand-type="false"
        border
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-show="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" v-show="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag size="mini" v-show="scope.row.cat_level===2" type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope>
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
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
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" @close="addCateDialogClosed">
      <el-form
        :model="addCateForm"
        :rules="rules"
        ref="addCateFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            :options="parentCateList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Cate",
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类
      cateList: [],
      // 商品分类总数
      total: 0,
      // 指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOk"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      // 是否显示添加分类对话框
      addCateDialogVisible: false,
      // 添加分类表单对象
      addCateForm: {
        cat_name: "",
        // 父级分类的id（一级二级三级对应1，2，3）
        cat_pid: 0,
        // 自己的分类等级
        cat_level: 0
      },
      // 通用验证规则
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      },
      // 获取的父级分类数据
      parentCateList: [],
      // 级联选择器的配置对象
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        childred: "childred",
        // 父子节点不关联 也就是指可以只选择父节点
        checkStrictly: true
      },
      // 级联选择器父级分类的id数据
      selectedKeys: []
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败");

      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    // 监听pagesize发生改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听页码发生变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 点击添加分类按钮
    addCate() {
      // 打开添加分类按钮就调用函数 获取父级分类数据
      this.getParentCateList();
      this.addCateDialogVisible = true;
      // console.log(this.addCateForm);
    },
    // 获取父级分类数据
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 2
        }
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取父级分类数据失败");
      // console.log(res);
      this.parentCateList = res.data;
    },
    // 级联选择器发生改变
    parentCateChanged() {
      // console.log(this.selectedKeys);s
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys.slice(-1)[0];
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 点击确定添加按钮
    addCateConfirm() {
      // console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201)
          return this.$message.error("添加分类失败！");

        this.$message.success("添加分类成功!");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    // 添加分类对话框关闭清空数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
      this.selectedKeys = [];
    }
  }
};
</script>
<style scoped>
.addCate {
  margin-bottom: 10px;
}
.el-cascader {
  width: 100%;
}
</style>