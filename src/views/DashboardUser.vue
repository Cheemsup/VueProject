<template>
  <div class="dashboard-container">
    <el-container class="layout-container">
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <h2>我的超市</h2>
        </div>
        <el-menu
          :default-active="activeCategory"
          class="sidebar-menu"
          @select="handleCategorySelect"
        >
          <el-menu-item index="all">
            <el-icon><Shop /></el-icon>
            <span>全部商品</span>
          </el-menu-item>
          <el-menu-item
            v-for="cat in categories"
            :key="cat.id"
            :index="cat.id"
          >
            <el-icon><component :is="cat.icon" /></el-icon>
            <span>{{ cat.name }}</span>
          </el-menu-item>
        </el-menu>

        <div class="cart-summary" @click="showCart = true">
          <el-icon><ShoppingCart /></el-icon>
          <span>购物车</span>
          <el-badge :value="cartCount" :hidden="cartCount === 0" />
        </div>
      </el-aside>

      <el-container>
        <el-header class="header">
          <div class="header-left">
            <span class="page-title">购物</span>
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
                  <el-dropdown-item command="orders">我的订单</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main class="main-content">
          <div class="content-wrapper">
            <div class="filter-bar">
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

              <div class="filter-controls">
                <el-popover
                  placement="bottom-start"
                  :width="300"
                  trigger="click"
                >
                  <template #reference>
                    <el-button>
                      <el-icon><Filter /></el-icon>
                      筛选
                      <el-badge v-if="activeFilterCount > 0" :value="activeFilterCount" />
                    </el-button>
                  </template>
                  <div class="filter-content">
                    <div class="filter-section">
                      <h4>价格区间</h4>
                      <el-slider
                        v-model="pendingPriceRange"
                        range
                        :min="0"
                        :max="50"
                        :step="1"
                        :format-tooltip="formatPriceTooltip"
                      />
                      <div class="price-labels">
                        <span>¥{{ pendingPriceRange[0] }}</span>
                        <span>¥{{ pendingPriceRange[1] }}</span>
                      </div>
                    </div>

                    <div class="filter-section">
                      <h4>商品标签</h4>
                      <el-check-tag
                        v-for="tag in allTags"
                        :key="tag"
                        :checked="pendingSelectedTags.includes(tag)"
                        @change="toggleTag(tag)"
                        class="tag-filter-item"
                      >
                        {{ tag }}
                      </el-check-tag>
                    </div>

                    <div class="filter-actions">
                      <el-button size="small" @click="clearFilters">清除筛选</el-button>
                      <el-button type="primary" size="small" @click="applyFilters">应用</el-button>
                    </div>
                  </div>
                </el-popover>
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
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Shop,
  ShoppingCart,
  Avatar,
  ArrowDown,
  Search,
  Star,
  Goods,
  Plus,
  Delete,
  Coffee,
  Milk,
  Food,
  Apple,
  Biscuit,
  Filter
} from '@element-plus/icons-vue'
import { categories, products, hotProducts, getProductsByCategory } from '@/data/products.js'

export default {
  name: 'DashboardUser',
  components: {
    Shop,
    ShoppingCart,
    Avatar,
    ArrowDown,
    Search,
    Star,
    Goods,
    Plus,
    Delete,
    Coffee,
    Milk,
    Food,
    Apple,
    Biscuit,
    Filter
  },
  setup() {
    const router = useRouter()
    const activeCategory = ref('all')
    const currentUser = ref('')
    const searchKeyword = ref('')
    const showCart = ref(false)
    const imageLoadFailed = ref(new Set())

    const priceRange = ref([0, 50])
    const selectedTags = ref([])
    const pendingPriceRange = ref([0, 50])
    const pendingSelectedTags = ref([])

    const cartItems = ref([])

    onMounted(() => {
      const username = localStorage.getItem('username')
      currentUser.value = username || '用户'

      const savedCart = localStorage.getItem('cartItems')
      if (savedCart) {
        cartItems.value = JSON.parse(savedCart)
      }
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

    const handleCategorySelect = (index) => {
      activeCategory.value = index
      searchKeyword.value = ''
    }

    const formatPriceTooltip = (val) => {
      return `¥${val}`
    }

    const toggleTag = (tag) => {
      const index = pendingSelectedTags.value.indexOf(tag)
      if (index > -1) {
        pendingSelectedTags.value.splice(index, 1)
      } else {
        pendingSelectedTags.value.push(tag)
      }
    }

    const clearFilters = () => {
      pendingPriceRange.value = [0, 50]
      pendingSelectedTags.value = []
      priceRange.value = [0, 50]
      selectedTags.value = []
    }

    const applyFilters = () => {
      priceRange.value = [...pendingPriceRange.value]
      selectedTags.value = [...pendingSelectedTags.value]
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
      ElMessage.success('结算功能开发中...')
    }

    const handleCommand = (command) => {
      if (command === 'logout') {
        localStorage.removeItem('username')
        localStorage.removeItem('userRole')
        localStorage.removeItem('cartItems')
        router.push('/login')
      } else if (command === 'orders') {
        ElMessage.info('订单功能开发中...')
      } else if (command === 'profile') {
        ElMessage.info('个人信息功能开发中...')
      }
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
      imageLoadFailed,
      handleCategorySelect,
      formatPriceTooltip,
      toggleTag,
      clearFilters,
      applyFilters,
      handleImageError,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      handleCheckout,
      handleCommand
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
  display: flex;
  flex-direction: column;
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
  flex: 1;
}

.cart-summary {
  padding: 20px;
  background-color: #35a070;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cart-summary:hover {
  background-color: #2d8f62;
}

.cart-summary .el-icon {
  font-size: 20px;
}

.cart-summary span {
  font-size: 14px;
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

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
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

.filter-bar {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input {
  width: 300px;
}

.filter-controls .el-button {
  display: flex;
  align-items: center;
  gap: 5px;
}

.filter-content {
  padding: 10px 0;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #303133;
  font-weight: 600;
}

.price-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #606266;
}

.tag-filter-item {
  margin: 0 8px 8px 0;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
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
</style>
