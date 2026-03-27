<template>
  <div class="dashboard-container">
    <el-container class="layout-container">
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <h2>管理系统</h2>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="dashboard">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="user">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="product">
            <el-icon><Goods /></el-icon>
            <span>产品管理</span>
          </el-menu-item>
          <el-menu-item index="order">
            <el-icon><Document /></el-icon>
            <span>订单管理</span>
          </el-menu-item>
          <el-menu-item index="settings">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-container>
        <el-header class="header">
          <div class="header-left">
            <el-button text @click="toggleSidebar">
              <el-icon><Fold /></el-icon>
            </el-button>
          </div>
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <el-icon><Avatar /></el-icon>
                {{ currentUser }}
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                  <el-dropdown-item command="settings">设置</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        
        <el-main class="main-content">
          <div class="content-wrapper">
            <div v-if="activeMenu === 'dashboard'" class="dashboard-content">
              <h1>欢迎回来，{{ currentUser }}！</h1>
              <div class="stats-cards">
                <div class="stat-card">
                  <div class="stat-icon" style="background: #409eff;">
                    <el-icon><User /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-number">1,234</div>
                    <div class="stat-label">用户总数</div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon" style="background: #67c23a;">
                    <el-icon><Goods /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-number">567</div>
                    <div class="stat-label">产品数量</div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon" style="background: #e6a23c;">
                    <el-icon><Document /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-number">890</div>
                    <div class="stat-label">订单总数</div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon" style="background: #f56c6c;">
                    <el-icon><Money /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-number">¥12,345</div>
                    <div class="stat-label">今日收入</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else-if="activeMenu === 'user'" class="page-content">
              <h2>用户管理</h2>
              <el-table :data="users" style="width: 100%">
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="username" label="用户名" width="120" />
                <el-table-column prop="email" label="邮箱" width="180" />
                <el-table-column prop="role" label="角色" width="100" />
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="scope">
                    <el-tag :type="scope.row.status === '正常' ? 'success' : 'danger'">
                      {{ scope.row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template #default>
                    <el-button size="small">编辑</el-button>
                    <el-button size="small" type="danger">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            
            <div v-else-if="activeMenu === 'product'" class="page-content">
              <h2>产品管理</h2>
              <el-table :data="products" style="width: 100%">
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="name" label="产品名称" width="150" />
                <el-table-column prop="price" label="价格" width="100" />
                <el-table-column prop="stock" label="库存" width="100" />
                <el-table-column prop="category" label="分类" width="100" />
                <el-table-column label="操作">
                  <template #default>
                    <el-button size="small">编辑</el-button>
                    <el-button size="small" type="danger">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            
            <div v-else-if="activeMenu === 'order'" class="page-content">
              <h2>订单管理</h2>
              <el-table :data="orders" style="width: 100%">
                <el-table-column prop="id" label="订单号" width="120" />
                <el-table-column prop="customer" label="客户" width="120" />
                <el-table-column prop="amount" label="金额" width="100" />
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="scope">
                    <el-tag :type="getStatusType(scope.row.status)">
                      {{ scope.row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="date" label="日期" width="120" />
                <el-table-column label="操作">
                  <template #default>
                    <el-button size="small">查看</el-button>
                    <el-button size="small" type="primary">发货</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            
            <div v-else-if="activeMenu === 'settings'" class="page-content">
              <h2>系统设置</h2>
              <el-form label-width="120px">
                <el-form-item label="系统名称">
                  <el-input v-model="settings.systemName" />
                </el-form-item>
                <el-form-item label="管理员邮箱">
                  <el-input v-model="settings.adminEmail" />
                </el-form-item>
                <el-form-item label="开启注册">
                  <el-switch v-model="settings.allowRegister" />
                </el-form-item>
                <el-form-item label="维护模式">
                  <el-switch v-model="settings.maintenanceMode" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary">保存设置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  HomeFilled, 
  User, 
  Goods, 
  Document, 
  Setting, 
  Fold, 
  Avatar, 
  ArrowDown,
  Money
} from '@element-plus/icons-vue'

export default {
  name: 'Dashboard',
  components: {
    HomeFilled,
    User,
    Goods,
    Document,
    Setting,
    Fold,
    Avatar,
    ArrowDown,
    Money
  },
  setup() {
    const router = useRouter()
    const activeMenu = ref('dashboard')
    const currentUser = ref('')
    const isCollapsed = ref(false)
    
    const users = ref([
      { id: 1, username: 'admin', email: 'admin@example.com', role: '管理员', status: '正常' },
      { id: 2, username: 'user', email: 'user@example.com', role: '用户', status: '正常' },
      { id: 3, username: 'test', email: 'test@example.com', role: '用户', status: '禁用' }
    ])
    
    const products = ref([
      { id: 1, name: '产品A', price: 99.99, stock: 100, category: '电子产品' },
      { id: 2, name: '产品B', price: 199.99, stock: 50, category: '电子产品' },
      { id: 3, name: '产品C', price: 299.99, stock: 30, category: '家居用品' }
    ])
    
    const orders = ref([
      { id: 'ORD001', customer: '张三', amount: 199.99, status: '待发货', date: '2024-01-15' },
      { id: 'ORD002', customer: '李四', amount: 99.99, status: '已发货', date: '2024-01-14' },
      { id: 'ORD003', customer: '王五', amount: 299.99, status: '已完成', date: '2024-01-13' }
    ])
    
    const settings = ref({
      systemName: '管理系统',
      adminEmail: 'admin@example.com',
      allowRegister: true,
      maintenanceMode: false
    })
    
    onMounted(() => {
      const username = localStorage.getItem('username')
      currentUser.value = username || '用户'
    })
    
    const handleMenuSelect = (index) => {
      activeMenu.value = index
    }
    
    const handleCommand = (command) => {
      if (command === 'logout') {
        localStorage.removeItem('username')
        router.push('/login')
      } else if (command === 'profile') {
        alert('个人信息功能开发中...')
      } else if (command === 'settings') {
        activeMenu.value = 'settings'
      }
    }
    
    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value
    }
    
    const getStatusType = (status) => {
      const statusMap = {
        '待发货': 'warning',
        '已发货': 'primary',
        '已完成': 'success',
        '已取消': 'danger'
      }
      return statusMap[status] || 'info'
    }
    
    return {
      activeMenu,
      currentUser,
      users,
      products,
      orders,
      settings,
      handleMenuSelect,
      handleCommand,
      toggleSidebar,
      getStatusType
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
  width: 100%;
}

.layout-container {
  height: 100%;
}

.sidebar {
  background-color: #304156;
  color: #fff;
  overflow-x: hidden;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: #2b3a4a;
  color: #fff;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.sidebar-menu {
  border-right: none;
  background-color: #304156;
}

.sidebar-menu .el-menu-item {
  color: #fff;
}

.sidebar-menu .el-menu-item:hover {
  background-color: #263445;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #409eff;
  color: #fff;
}

.sidebar-menu .el-menu-item .el-icon {
  color: #fff;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 200px;
}

.header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
  font-size: 14px;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}

.content-wrapper {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  min-height: calc(100vh - 140px);
}

.dashboard-content h1 {
  margin: 0 0 30px 0;
  color: #303133;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  color: #fff;
  font-size: 28px;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.page-content h2 {
  margin: 0 0 20px 0;
  color: #303133;
}
</style>
