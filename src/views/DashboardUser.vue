<template>
  <div class="dashboard-container">
    <el-container class="layout-container">
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <h2>用户中心</h2>
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
          <el-menu-item index="profile">
            <el-icon><User /></el-icon>
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="orders">
            <el-icon><Document /></el-icon>
            <span>我的订单</span>
          </el-menu-item>
          <el-menu-item index="settings">
            <el-icon><Setting /></el-icon>
            <span>设置</span>
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
            <div v-if="activeMenu === 'dashboard'" class="shopping-content">
              <div class="category-nav">
                <el-radio-group v-model="activeCategory" size="default">
                  <el-radio-button label="all">全部商品</el-radio-button>
                  <el-radio-button
                    v-for="cat in categories"
                    :key="cat.id"
                    :label="cat.id"
                  >
                    <el-icon><component :is="cat.icon" /></el-icon>
                    {{ cat.name }}
                  </el-radio-button>
                </el-radio-group>
                <div class="nav-right">
                  <el-input
                    v-model="searchKeyword"
                    placeholder="搜索商品..."
                    clearable
                    class="search-input"
                  >
                    <template #prefix>
                      <el-icon><Search /></el-icon>
                    </template>
                  </el-input>
                  <el-badge :value="cartCount" :hidden="cartCount === 0" class="cart-badge">
                    <el-button @click="showCart = true">
                      <el-icon><ShoppingCart /></el-icon>
                      购物车
                    </el-button>
                  </el-badge>
                </div>
              </div>

              <div v-if="activeCategory === 'all' && !searchKeyword && activeFilterCount === 0" class="hot-section">
                <h3 class="section-title">
                  <el-icon><Star /></el-icon>
                  热销推荐
                </h3>
                <div class="products-grid">
                  <div
                    v-for="product in hotProducts"
                    :key="product.id"
                    class="product-card"
                    @click="addToCart(product)"
                  >
                    <div class="product-image">
                      <img v-if="product.image" :src="product.image" :alt="product.name" @error="handleImageError" />
                      <div v-else class="image-placeholder">
                        <el-icon><Goods /></el-icon>
                      </div>
                      <div v-if="product.discount < 1" class="discount-tag">
                        {{ Math.round(product.discount * 10) }}折
                      </div>
                    </div>
                    <div class="product-info">
                      <h4 class="product-name">{{ product.name }}</h4>
                      <p class="product-desc">{{ product.description }}</p>
                      <div class="product-price">
                        <span class="current-price">¥{{ (product.price * product.discount).toFixed(2) }}</span>
                        <span v-if="product.discount < 1" class="original-price">¥{{ product.price.toFixed(2) }}</span>
                      </div>
                      <div class="product-tags">
                        <el-tag v-for="tag in product.tags" :key="tag" size="small" type="info">{{ tag }}</el-tag>
                      </div>
                    </div>
                    <div class="product-action">
                      <el-button type="primary" @click.stop="addToCart(product)">
                        <el-icon><Plus /></el-icon>
                        加入购物车
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="products-section">
                <h3 class="section-title">
                  <el-icon><Shop /></el-icon>
                  {{ currentCategoryName }}
                </h3>
                <div v-if="filteredProducts.length > 0" class="products-grid">
                  <div
                    v-for="product in filteredProducts"
                    :key="product.id"
                    class="product-card"
                    @click="addToCart(product)"
                  >
                    <div class="product-image">
                      <img v-if="product.image" :src="product.image" :alt="product.name" @error="handleImageError" />
                      <div v-else class="image-placeholder">
                        <el-icon><Goods /></el-icon>
                      </div>
                      <div v-if="product.discount < 1" class="discount-tag">
                        {{ Math.round(product.discount * 10) }}折
                      </div>
                    </div>
                    <div class="product-info">
                      <h4 class="product-name">{{ product.name }}</h4>
                      <p class="product-desc">{{ product.description }}</p>
                      <div class="product-price">
                        <span class="current-price">¥{{ (product.price * product.discount).toFixed(2) }}</span>
                        <span v-if="product.discount < 1" class="original-price">¥{{ product.price.toFixed(2) }}</span>
                        <span class="unit">/{{ product.unit }}</span>
                      </div>
                      <div class="product-tags">
                        <el-tag v-for="tag in product.tags" :key="tag" size="small" type="info">{{ tag }}</el-tag>
                      </div>
                    </div>
                    <div class="product-action">
                      <el-button type="primary" @click.stop="addToCart(product)">
                        <el-icon><Plus /></el-icon>
                        加入购物车
                      </el-button>
                    </div>
                  </div>
                </div>
                <el-empty v-else description="暂无商品" />
              </div>
            </div>
            
            <div v-else-if="activeMenu === 'profile'" class="page-content">
              <h2>个人信息</h2>
              <el-form label-width="100px" class="profile-form">
                <el-form-item label="用户名">
                  <el-input v-model="userInfo.username" disabled />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="userInfo.email" />
                </el-form-item>
                <el-form-item label="手机号">
                  <el-input v-model="userInfo.phone" />
                </el-form-item>
                <el-form-item label="地址">
                  <el-input v-model="userInfo.address" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary">保存修改</el-button>
                </el-form-item>
              </el-form>
            </div>
            
            <div v-else-if="activeMenu === 'orders'" class="page-content">
              <h2>我的订单</h2>
              <el-empty v-if="orders.length === 0" description="暂无订单" />
              <div v-else class="orders-list">
                <div v-for="order in orders" :key="order.id" class="order-card">
                  <div class="order-header">
                    <div class="order-info">
                      <span class="order-id">订单号：{{ order.id }}</span>
                      <span class="order-date">{{ order.date }}</span>
                    </div>
                    <el-tag :type="getStatusType(order.status)" size="large">
                      {{ order.status }}
                    </el-tag>
                  </div>
                  <div class="order-items">
                    <div v-for="item in order.items" :key="item.productId" class="order-item">
                      <span class="item-name">{{ item.name }}</span>
                      <span class="item-quantity">x{{ item.quantity }}</span>
                      <span class="item-price">¥{{ item.subtotal }}</span>
                    </div>
                  </div>
                  <div class="order-footer">
                    <div class="order-summary">
                      共 <strong>{{ order.itemCount }}</strong> 件商品
                      <span class="order-total">合计：<strong>¥{{ order.totalAmount }}</strong></span>
                    </div>
                    <el-button type="primary" size="small" @click="viewOrderDetail(order)">
                      查看详情
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else-if="activeMenu === 'settings'" class="page-content">
              <h2>账户设置</h2>
              <el-form label-width="120px">
                <el-form-item label="通知设置">
                  <el-switch v-model="settings.notifications" />
                </el-form-item>
                <el-form-item label="消息提醒">
                  <el-switch v-model="settings.messageAlert" />
                </el-form-item>
                <el-form-item label="语言">
                  <el-select v-model="settings.language">
                    <el-option label="中文" value="zh" />
                    <el-option label="English" value="en" />
                  </el-select>
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

    <el-drawer
      v-model="showCart"
      title="购物车"
      direction="rtl"
      size="400px"
    >
      <div class="cart-content">
        <div v-if="cartItems.length === 0" class="cart-empty">
          <el-empty description="购物车是空的" />
        </div>
        <div v-else>
          <div class="cart-items">
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
              <div class="cart-item-info">
                <span class="cart-item-name">{{ item.name }}</span>
                <span class="cart-item-price">¥{{ (item.price * item.discount).toFixed(2) }}</span>
              </div>
              <div class="cart-item-controls">
                <el-input-number
                  v-model="item.quantity"
                  :min="1"
                  :max="item.stock"
                  size="small"
                  @change="updateCartQuantity(item)"
                />
                <el-button type="danger" size="small" @click="removeFromCart(item)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
          <div class="cart-footer">
            <div class="cart-total">
              <span>总计：</span>
              <span class="total-price">¥{{ cartTotal.toFixed(2) }}</span>
            </div>
            <el-button type="primary" class="checkout-btn" @click="handleCheckout">
              去结算
            </el-button>
          </div>
        </div>
      </div>
    </el-drawer>

    <el-drawer
      v-model="showOrderDetail"
      title="订单详情"
      direction="rtl"
      size="450px"
    >
      <div v-if="currentOrderDetail" class="order-detail-content">
        <div class="detail-section">
          <div class="detail-row">
            <span class="detail-label">订单号</span>
            <span class="detail-value">{{ currentOrderDetail.id }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">下单时间</span>
            <span class="detail-value">{{ currentOrderDetail.date }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">订单状态</span>
            <el-tag :type="getStatusType(currentOrderDetail.status)">
              {{ currentOrderDetail.status }}
            </el-tag>
          </div>
        </div>
        
        <div class="detail-section">
          <h4>商品清单</h4>
          <div class="detail-items">
            <div v-for="item in currentOrderDetail.items" :key="item.productId" class="detail-item">
              <div class="detail-item-info">
                <span class="detail-item-name">{{ item.name }}</span>
                <span class="detail-item-spec">¥{{ item.price }}/{{ item.unit }}</span>
              </div>
              <div class="detail-item-right">
                <span class="detail-item-quantity">x{{ item.quantity }}</span>
                <span class="detail-item-subtotal">¥{{ item.subtotal }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="detail-footer">
          <div class="detail-total-row">
            <span>商品数量</span>
            <span>{{ currentOrderDetail.itemCount }} 件</span>
          </div>
          <div class="detail-total-row total-amount">
            <span>订单总额</span>
            <span class="amount-value">¥{{ currentOrderDetail.totalAmount }}</span>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  HomeFilled, 
  User, 
  Document, 
  Setting, 
  Fold, 
  Avatar, 
  ArrowDown,
  Shop,
  ShoppingCart,
  Search,
  Star,
  Goods,
  Plus,
  Delete,
  Coffee,
  Milk,
  Food,
  Apple,
  Biscuit
} from '@element-plus/icons-vue'
import { categories, products, hotProducts, getProductsByCategory } from '@/data/products.js'
import { getOrders, createOrder } from '@/data/orders.js'

export default {
  name: 'DashboardUser',
  components: {
    HomeFilled,
    User,
    Document,
    Setting,
    Fold,
    Avatar,
    ArrowDown,
    Shop,
    ShoppingCart,
    Search,
    Star,
    Goods,
    Plus,
    Delete,
    Coffee,
    Milk,
    Food,
    Apple,
    Biscuit
  },
  setup() {
    const router = useRouter()
    const activeMenu = ref('dashboard')
    const currentUser = ref('')
    const isCollapsed = ref(false)
    
    const activeCategory = ref('all')
    const searchKeyword = ref('')
    const showCart = ref(false)
    const priceRange = ref([0, 50])
    const selectedTags = ref([])
    const pendingPriceRange = ref([0, 50])
    const pendingSelectedTags = ref([])
    const cartItems = ref([])
    
    const userInfo = ref({
      username: '',
      email: 'user@example.com',
      phone: '13800138000',
      address: '北京市朝阳区'
    })
    
    const orders = ref([])
    const showOrderDetail = ref(false)
    const currentOrderDetail = ref(null)
    
    const settings = ref({
      notifications: true,
      messageAlert: true,
      language: 'zh'
    })
    
    const allTags = computed(() => {
      const tags = new Set()
      products.forEach(p => p.tags.forEach(tag => tags.add(tag)))
      return Array.from(tags).sort()
    })
    
    const activeFilterCount = computed(() => {
      let count = 0
      if (priceRange.value[0] > 0 || priceRange.value[1] < 50) count++
      if (selectedTags.value.length > 0) count += selectedTags.value.length
      return count
    })
    
    const currentCategoryName = computed(() => {
      if (searchKeyword.value) return '搜索结果'
      if (activeCategory.value === 'all') return '全部商品'
      const cat = categories.find(c => c.id === activeCategory.value)
      return cat ? cat.name : '商品'
    })
    
    const filteredProducts = computed(() => {
      let result = getProductsByCategory(activeCategory.value)
      
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase()
        result = result.filter(p =>
          p.name.toLowerCase().includes(keyword) ||
          p.description.toLowerCase().includes(keyword) ||
          p.tags.some(tag => tag.toLowerCase().includes(keyword))
        )
      }
      
      result = result.filter(p => {
        const finalPrice = p.price * p.discount
        return finalPrice >= priceRange.value[0] && finalPrice <= priceRange.value[1]
      })
      
      if (selectedTags.value.length > 0) {
        result = result.filter(p =>
          selectedTags.value.some(tag => p.tags.includes(tag))
        )
      }
      
      return result
    })
    
    const cartCount = computed(() => {
      return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
    })
    
    const cartTotal = computed(() => {
      return cartItems.value.reduce((sum, item) => {
        return sum + item.price * item.discount * item.quantity
      }, 0)
    })
    
    onMounted(() => {
      const username = localStorage.getItem('username')
      currentUser.value = username || '用户'
      userInfo.value.username = username || '用户'
      
      const savedCart = localStorage.getItem('cartItems')
      if (savedCart) {
        cartItems.value = JSON.parse(savedCart)
      }
      
      orders.value = getOrders()
    })
    
    const handleMenuSelect = (index) => {
      activeMenu.value = index
    }
    
    const handleCommand = (command) => {
      if (command === 'logout') {
        localStorage.removeItem('username')
        localStorage.removeItem('userRole')
        localStorage.removeItem('cartItems')
        router.push('/login')
      } else if (command === 'profile') {
        activeMenu.value = 'profile'
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
        '配送中': 'primary',
        '已完成': 'success',
        '已取消': 'danger'
      }
      return statusMap[status] || 'info'
    }
    
    const handleImageError = (e) => {
      e.target.style.display = 'none'
      e.target.nextElementSibling && (e.target.nextElementSibling.style.display = 'flex')
    }
    
    const addToCart = (product) => {
      const existingItem = cartItems.value.find(item => item.id === product.id)
      
      if (existingItem) {
        if (existingItem.quantity < existingItem.stock) {
          existingItem.quantity++
          ElMessage.success(`已增加 ${product.name} 数量`)
        } else {
          ElMessage.warning(` ${product.name} 库存不足`)
        }
      } else {
        cartItems.value.push({
          ...product,
          quantity: 1
        })
        ElMessage.success(`已加入购物车：${product.name}`)
      }
      
      saveCart()
    }
    
    const updateCartQuantity = (item) => {
      saveCart()
    }
    
    const removeFromCart = (item) => {
      const index = cartItems.value.findIndex(i => i.id === item.id)
      if (index > -1) {
        cartItems.value.splice(index, 1)
        ElMessage.info(`已移除 ${item.name}`)
        saveCart()
      }
    }
    
    const saveCart = () => {
      localStorage.setItem('cartItems', JSON.stringify(cartItems.value))
    }
    
    const handleCheckout = () => {
      if (cartItems.value.length === 0) {
        ElMessage.warning('购物车是空的')
        return
      }
      
      const newOrder = createOrder(cartItems.value, cartTotal.value)
      
      orders.value = getOrders()
      
      cartItems.value = []
      localStorage.removeItem('cartItems')
      
      showCart.value = false
      
      ElMessage.success(`订单 ${newOrder.id} 下单成功！`)
      
      activeMenu.value = 'orders'
    }
    
    const viewOrderDetail = (order) => {
      currentOrderDetail.value = order
      showOrderDetail.value = true
    }
    
    return {
      categories,
      products,
      hotProducts,
      activeCategory,
      currentUser,
      searchKeyword,
      showCart,
      cartItems,
      cartCount,
      cartTotal,
      currentCategoryName,
      filteredProducts,
      allTags,
      priceRange,
      selectedTags,
      pendingPriceRange,
      pendingSelectedTags,
      activeFilterCount,
      handleImageError,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      handleCheckout,
      activeMenu,
      userInfo,
      orders,
      settings,
      handleMenuSelect,
      handleCommand,
      toggleSidebar,
      getStatusType,
      showOrderDetail,
      currentOrderDetail,
      viewOrderDetail
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
  background-color: #42b983;
  color: #fff;
  overflow-x: hidden;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: #35a070;
  color: #fff;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.sidebar-menu {
  border-right: none;
  background-color: #42b983;
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

.welcome-card {
  display: flex;
  align-items: center;
  padding: 30px;
  background: linear-gradient(135deg, #42b983 0%, #35a070 100%);
  border-radius: 8px;
  color: white;
  margin-bottom: 30px;
}

.welcome-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 40px;
}

.welcome-text h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.welcome-text p {
  margin: 0;
  opacity: 0.9;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.action-card {
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #e0e0e0;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.3);
  border-color: #42b983;
}

.action-card .el-icon {
  font-size: 40px;
  color: #42b983;
}

.action-card span {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.page-content h2 {
  margin: 0 0 20px 0;
  color: #303133;
}

.profile-form {
  max-width: 500px;
}

.shopping-content {
  width: 100%;
}

.category-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding: 18px 24px;
  background: linear-gradient(135deg, #f5faf7 0%, #e8f5ed 100%);
  border-radius: 12px;
  border: 1px solid #d4edda;
  box-shadow: 0 2px 12px rgba(66, 185, 131, 0.1);
  flex-wrap: wrap;
  gap: 15px;
}

.category-nav :deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-nav :deep(.el-radio-button__inner) {
  border: none;
  background-color: #fff;
  color: #606266;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.category-nav :deep(.el-radio-button__inner:hover) {
  color: #42b983;
  background-color: #f0f9f4;
}

.category-nav :deep(.el-radio-button:first-child .el-radio-button__inner) {
  border-radius: 8px;
}

.category-nav :deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 8px;
}

.category-nav :deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  background: linear-gradient(135deg, #42b983 0%, #35a070 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.4);
}

.category-nav :deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner:hover) {
  background: linear-gradient(135deg, #35a070 0%, #2d8f62 100%);
}

.category-nav :deep(.el-icon) {
  margin-right: 6px;
  font-size: 16px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-input {
  width: 280px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.search-input :deep(.el-input__wrapper:hover),
.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.2);
}

.cart-badge {
  display: flex;
  align-items: center;
}

.cart-badge :deep(.el-button) {
  background: linear-gradient(135deg, #42b983 0%, #35a070 100%);
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(66, 185, 131, 0.3);
  transition: all 0.3s ease;
}

.cart-badge :deep(.el-button:hover) {
  background: linear-gradient(135deg, #35a070 0%, #2d8f62 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.4);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 18px;
}

.section-title .el-icon {
  color: #42b983;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.2);
  border-color: #42b983;
}

.product-image {
  width: 100%;
  height: 160px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.product-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f2f5 0%, #e0e0e0 100%);
}

.image-placeholder .el-icon {
  font-size: 60px;
  color: #b0b0b0;
}

.discount-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #f56c6c;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.product-info {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-desc {
  margin: 0 0 10px 0;
  font-size: 12px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
}

.current-price {
  font-size: 20px;
  font-weight: bold;
  color: #f56c6c;
}

.original-price {
  font-size: 12px;
  color: #c0c4cc;
  text-decoration: line-through;
}

.unit {
  font-size: 12px;
  color: #909399;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 10px;
}

.product-action {
  padding: 0 15px 15px;
}

.product-action .el-button {
  width: 100%;
  background-color: #42b983;
  border-color: #42b983;
}

.product-action .el-button:hover {
  background-color: #35a070;
  border-color: #35a070;
}

.hot-section {
  margin-bottom: 40px;
}

.products-section {
  margin-bottom: 20px;
}

.cart-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cart-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
}

.cart-item {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.cart-item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.cart-item-name {
  font-size: 14px;
  color: #303133;
}

.cart-item-price {
  font-size: 14px;
  color: #f56c6c;
  font-weight: bold;
}

.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cart-footer {
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  background-color: #f5f5f5;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 16px;
}

.total-price {
  font-size: 24px;
  font-weight: bold;
  color: #f56c6c;
}

.checkout-btn {
  width: 100%;
  background-color: #42b983;
  border-color: #42b983;
}

.checkout-btn:hover {
  background-color: #35a070;
  border-color: #35a070;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  transition: all 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 4px 16px rgba(66, 185, 131, 0.15);
  border-color: #42b983;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f5faf7 0%, #e8f5ed 100%);
  border-bottom: 1px solid #e0e0e0;
}

.order-info {
  display: flex;
  gap: 20px;
  align-items: center;
}

.order-id {
  font-weight: 600;
  color: #303133;
}

.order-date {
  color: #909399;
  font-size: 14px;
}

.order-items {
  padding: 16px 20px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dashed #e0e0e0;
}

.order-item:last-child {
  border-bottom: none;
}

.item-name {
  color: #303133;
  font-weight: 500;
}

.item-quantity {
  color: #909399;
  margin: 0 20px;
}

.item-price {
  color: #f56c6c;
  font-weight: bold;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fafafa;
  border-top: 1px solid #e0e0e0;
}

.order-summary {
  display: flex;
  align-items: center;
  gap: 20px;
  color: #606266;
}

.order-total {
  color: #303133;
}

.order-total strong {
  color: #f56c6c;
  font-size: 18px;
}

.order-detail-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-section {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #303133;
  font-size: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.detail-label {
  color: #909399;
  font-size: 14px;
}

.detail-value {
  color: #303133;
  font-weight: 500;
}

.detail-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.detail-item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item-name {
  color: #303133;
  font-weight: 500;
}

.detail-item-spec {
  color: #909399;
  font-size: 12px;
}

.detail-item-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.detail-item-quantity {
  color: #606266;
}

.detail-item-subtotal {
  color: #f56c6c;
  font-weight: bold;
}

.detail-footer {
  padding: 20px;
  margin-top: auto;
  background: #f5f5f5;
}

.detail-total-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  color: #606266;
}

.detail-total-row.total-amount {
  border-top: 1px solid #e0e0e0;
  margin-top: 10px;
  padding-top: 15px;
}

.amount-value {
  color: #f56c6c;
  font-size: 22px;
  font-weight: bold;
}
</style>
