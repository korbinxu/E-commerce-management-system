<template>
  <div class>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-button type="primary">添加角色</el-button>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom',i1===0?'bdtop':'','vcenter']"
              v-for="(item1,i1) in scope.row.children "
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级三级权限 -->
              <el-col :span="19">
                <!-- 第二次for循环渲染二级权限 -->
                <el-row
                  :class="[i2===0?'':'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 第三次循环渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描叙" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      @close="setRightsDialogClosed"
      width="50%"
    >
      <span>
        <el-tree
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeysList"
          ref="treeRef"
        ></el-tree>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRights()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Roles",
  data() {
    return {
      roleList: [],
      setRightDialogVisible: false,
      rightsList: [],
      // 树形结构控件属性绑定对象
      treeProps: {
        label: "authName",
        children: "children"
      },
      // 默认选中节点的id数组
      defKeysList: [],
      // 分配对话框的角色id
      roleId: ""
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.roleList = res.data;
      // console.log(this.roleList);
    },
    // 弹框是否删除这个权限
    async removeRightById(role, rightId) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmRes != "confirm") return this.$message.info("取消了删除操作");
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error("删除权限失败");
      // this.getRolesList();
      // 调用上面方法会刷新页面 关闭窗口  只需要把返回的数据(删除后的权限对象集合)重新赋值给本次的权限对象就行
      role.children = res.data;
    },
    // 展示分配权限对象框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败");
      this.rightsList = res.data;
      // console.log(this.rightsList);
      // 调用递归函数 获取所以的三级权限
      this.getDefKeysList(role, this.defKeysList);
      this.setRightDialogVisible = true;
    },
    // 通过递归获取当前三级权限的id并赋值给defKeysList
    getDefKeysList(node, arr) {
      // console.log(node);
      if (!node.children) return arr.push(node.id);
      node.children.forEach(item => this.getDefKeysList(item, arr));
    },
    // 关闭分配权限对话框时候 立马清空defKeysList的数据
    setRightsDialogClosed() {
      this.defKeysList = [];
    },
    // 添加分配的权限
    async addRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedNodes()
      ];
      const idStr = keys.join(",");
      // console.log(idStr);
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) return this.$message.error("分配权限失败");
      this.$message.success("分配权限成功");
      this.getRolesList();
      this.setRightDialogVisible = false;
    }
  }
};
</script>
<style scoped>
.el-tag {
  margin: 8px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>