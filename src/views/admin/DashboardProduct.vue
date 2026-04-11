<template>
  <div class="page-content">
    <h2>产品管理</h2>
    <div class="filter-bar">
      <div class="filter-left">
        <div class="filter-item">
          <label>搜索：</label>
          <el-input
            v-model="productSearch"
            placeholder="请输入产品名称或ID"
            clearable
            @clear="handleSearchClear"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="filter-item">
          <label>分类：</label>
          <el-select
            v-model="productCategory"
            placeholder="请选择分类"
            clearable
            @change="handleCategoryChange"
          >
            <el-option label="全部" value="" />
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </div>
      </div>
      <div class="filter-right">
        <el-button-group>
          <el-button :type="viewMode === 'large' ? 'primary' : 'default'" @click="viewMode = 'large'">
            <el-icon><Grid /></el-icon>
          </el-button>
          <el-button :type="viewMode === 'small' ? 'primary' : 'default'" @click="viewMode = 'small'">
            <el-icon><List /></el-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div class="category-bar">
      <div class="category-scroll">
        <div 
          class="category-item" 
          :class="{ active: productCategory === '' }"
          @click="productCategory = ''; handleCategoryChange()"
        >
          全部
        </div>
        <div 
          v-for="cat in categories" 
          :key="cat.id"
          class="category-item"
          :class="{ active: productCategory === cat.id }"
          @click="productCategory = cat.id; handleCategoryChange()"
        >
          {{ cat.name }}
        </div>
      </div>
    </div>
    <div class="product-grid" :class="{ 'small-mode': viewMode === 'small' }">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <div class="product-image">
          <img v-if="product.image" :src="product.image" :alt="product.name" />
          <el-icon v-else><Goods /></el-icon>
        </div>
        <div class="product-info">
          <div class="product-id">ID: {{ product.id }}</div>
          <div class="product-name">{{ product.name }}</div>
          <div class="product-price">¥{{ product.price }}/{{ product.unit }}</div>
          <div class="product-stock">
            <el-tag :type="product.stock > 50 ? 'success' : product.stock > 20 ? 'warning' : 'danger'" size="small">
              库存: {{ product.stock }}
            </el-tag>
          </div>
          <div class="product-category">
            <el-tag type="info" size="small">
              {{ getCategoryName(product.category) }}
            </el-tag>
          </div>
        </div>
        <div class="product-actions">
          <el-button size="small" type="primary" @click="showProductDetail(product)">详情</el-button>
        </div>
      </div>
    </div>

    <el-dialog v-model="detailDialogVisible" title="产品详情" width="700px" class="product-detail-dialog">
      <div v-if="selectedProduct" class="product-detail">
        <div class="detail-layout">
          <div class="detail-image">
            <img v-if="selectedProduct.image" :src="selectedProduct.image" :alt="selectedProduct.name" />
            <el-icon v-else class="no-image-icon"><Goods /></el-icon>
          </div>
          <div class="detail-info">
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">产品ID</span>
                <span class="detail-value">{{ selectedProduct.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">产品名称</span>
                <span class="detail-value">{{ selectedProduct.name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">分类</span>
                <el-tag type="info" size="small">{{ getCategoryName(selectedProduct.category) }}</el-tag>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="detail-label">价格</span>
                <span class="detail-value price">¥{{ selectedProduct.price }}/{{ selectedProduct.unit }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">库存</span>
                <el-tag :type="selectedProduct.stock > 50 ? 'success' : selectedProduct.stock > 20 ? 'warning' : 'danger'" size="small">
                  {{ selectedProduct.stock }} {{ selectedProduct.unit }}
                </el-tag>
              </div>
              <div class="detail-item" v-if="selectedProduct.discount < 1">
                <span class="detail-label">折扣</span>
                <el-tag type="warning" size="small">{{ (selectedProduct.discount * 10).toFixed(1) }}折</el-tag>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item" v-if="selectedProduct.barCode">
                <span class="detail-label">条码</span>
                <span class="detail-value">{{ selectedProduct.barCode }}</span>
              </div>
              <div class="detail-item" v-if="selectedProduct.description" :span="2">
                <span class="detail-label">描述</span>
                <span class="detail-value">{{ selectedProduct.description }}</span>
              </div>
            </div>
            <div class="detail-row tags-row" v-if="selectedProduct.tags && selectedProduct.tags.length">
              <div class="detail-item full-width">
                <span class="detail-label center-label">标签</span>
                <div class="detail-tags centered">
                  <el-tag v-for="tag in selectedProduct.tags" :key="tag" size="small">
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { Goods, Search, Grid, List } from '@element-plus/icons-vue'
import { products as productsData, categories as categoriesData } from '../../data/products'

export default {
  name: 'DashboardProduct',
  components: { Goods, Search, Grid, List },
  setup() {
    const products = productsData
    const categories = categoriesData
    const productSearch = ref('')
    const productCategory = ref('')
    const filteredProducts = ref([...products])
    const selectedProduct = ref(null)
    const detailDialogVisible = ref(false)
    const viewMode = ref('large')

    const getCategoryName = (categoryId) => {
      const category = categories.find(c => c.id === categoryId)
      return category ? category.name : categoryId
    }

    const filterProducts = () => {
      filteredProducts.value = products.filter(product => {
        const matchSearch = productSearch.value === '' ||
          product.name.toLowerCase().includes(productSearch.value.toLowerCase()) ||
          product.id.toString().includes(productSearch.value)
        const matchCategory = productCategory.value === '' ||
          product.category === productCategory.value
        return matchSearch && matchCategory
      })
    }

    const handleSearchClear = () => {
      productSearch.value = ''
      filterProducts()
    }

    const handleCategoryChange = () => {
      filterProducts()
    }

    const showProductDetail = (product) => {
      selectedProduct.value = product
      detailDialogVisible.value = true
    }

    watch(productSearch, () => { filterProducts() }, { immediate: true })

    return {
      products,
      categories,
      productSearch,
      productCategory,
      filteredProducts,
      selectedProduct,
      detailDialogVisible,
      viewMode,
      getCategoryName,
      handleSearchClear,
      handleCategoryChange,
      showProductDetail
    }
  }
}
</script>

<style scoped>
.page-content h2 {
  margin: 0 0 20px 0;
  color: #303133;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.filter-left {
  display: flex;
  gap: 20px;
  flex: 1;
}

.filter-right {
  flex-shrink: 0;
}

.category-bar {
  margin-bottom: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f2f5;
}

.category-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0;
  scrollbar-width: thin;
}

.category-scroll::-webkit-scrollbar {
  height: 4px;
}

.category-scroll::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 2px;
}

.category-item {
  flex-shrink: 0;
  padding: 8px 20px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.category-item:hover {
  border-color: #409eff;
  color: #409eff;
  background: #ecf5ff;
}

.category-item.active {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
  font-weight: 500;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.filter-item label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  white-space: nowrap;
  min-width: 60px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  padding: 10px 0;
}

.product-grid.small-mode {
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.product-grid.small-mode .product-card {
  border-radius: 8px;
}

.product-grid.small-mode .product-image {
  height: 80px;
}

.product-grid.small-mode .product-image .el-icon {
  font-size: 28px;
}

.product-grid.small-mode .product-info {
  padding: 6px 8px;
}

.product-grid.small-mode .product-id {
  font-size: 10px;
}

.product-grid.small-mode .product-name {
  font-size: 12px;
}

.product-grid.small-mode .product-price {
  font-size: 11px;
}

.product-grid.small-mode .product-stock,
.product-grid.small-mode .product-category {
  display: none;
}

.product-grid.small-mode .product-actions {
  margin-top: 4px;
}

.product-grid.small-mode .product-actions .el-button {
  font-size: 12px;
  padding: 4px 8px;
}

.product-card {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.product-image {
  height: 130px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-image .el-icon {
  font-size: 50px;
  opacity: 0.8;
}

.product-info {
  padding: 10px 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-id {
  font-size: 11px;
  color: #909399;
  font-weight: 500;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.product-price {
  font-size: 13px;
  font-weight: 600;
  color: #f56c6c;
}

.product-stock,
.product-category {
  margin-top: 2px;
}

.product-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.product-actions .el-button {
  flex: 1;
}

.product-detail {
  padding: 20px 0;
}

.detail-layout {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.detail-image {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image-icon {
  font-size: 60px;
  color: #fff;
  opacity: 0.8;
}

.detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

.detail-row {
  display: flex;
  gap: 24px;
  align-items: stretch;
}

.detail-row.tags-row {
  justify-content: center;
  margin-top: 5px;
  border-top: 1px solid #f0f2f5;
  padding-top: 15px;
}

.detail-row .detail-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.detail-row .detail-item.full-width {
  flex: 1 1 100%;
  text-align: center;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
}

.detail-label.center-label {
  text-align: center;
}

.detail-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  line-height: 1.4;
}

.detail-value.price {
  font-size: 20px;
  font-weight: 700;
  color: #f56c6c;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.detail-tags.centered {
  justify-content: center;
}
</style>

<style>
.product-detail-dialog .el-dialog__header {
  padding: 20px 24px 10px !important;
  text-align: left !important;
}

.product-detail-dialog .el-dialog__title {
  font-size: 18px !important;
  font-weight: 600 !important;
  color: #303133 !important;
}

.product-detail-dialog .el-dialog__body {
  padding: 15px 24px 20px !important;
}

.product-detail-dialog .el-dialog__footer {
  padding: 0 24px 20px !important;
  border-top: 1px solid #f0f2f5;
  margin-top: 0 !important;
}

.product-detail-dialog .el-dialog__headerbtn {
  top: 18px !important;
  right: 20px !important;
}
</style>
