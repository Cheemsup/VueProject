export const categories = [
  { id: 'drinks', name: '饮料', icon: 'Coffee' },
  { id: 'snacks', name: '零食', icon: 'Biscuit' },
  { id: 'daily', name: '日用品', icon: 'Goods' },
  { id: 'fresh', name: '生鲜', icon: 'Apple' },
  { id: 'dairy', name: '乳制品', icon: 'Milk' },
  { id: 'instant', name: '速食', icon: 'Food' }
]

export const products = [
  {
    id: 'P001',
    name: '农夫山泉',
    category: 'drinks',
    price: 2.00,
    unit: '瓶',
    stock: 500,
    image: '/src/assets/products/drinks/water.png',
    description: '550ml 饮用天然水',
    barCode: '6920552655001',
    discount: 1,
    isHot: true,
    tags: ['热销', '解渴']
  },
  {
    id: 'P002',
    name: '可口可乐',
    category: 'drinks',
    price: 3.00,
    unit: '瓶',
    stock: 300,
    image: '/src/assets/products/drinks/cola.png',
    description: '330ml 可乐',
    barCode: '6920552655002',
    discount: 0.95,
    isHot: true,
    tags: ['热销', '碳酸']
  },
  {
    id: 'P003',
    name: '康师傅冰红茶',
    category: 'drinks',
    price: 3.50,
    unit: '瓶',
    stock: 200,
    image: '/src/assets/products/drinks/iceTea.png',
    description: '500ml 冰红茶',
    barCode: '6920552655003',
    discount: 1,
    isHot: false,
    tags: ['茶饮']
  },
  {
    id: 'P004',
    name: '统一绿茶',
    category: 'drinks',
    price: 3.00,
    unit: '瓶',
    stock: 180,
    image: '/src/assets/products/drinks/greenTea.png',
    description: '500ml 绿茶',
    barCode: '6920552655004',
    discount: 1,
    isHot: false,
    tags: ['茶饮', '健康']
  },
  {
    id: 'P005',
    name: '乐事薯片',
    category: 'snacks',
    price: 6.50,
    unit: '袋',
    stock: 150,
    image: '/src/assets/products/snacks/chips.png',
    description: '组合装 120g',
    barCode: '6920552655005',
    discount: 1,
    isHot: true,
    tags: ['热销', '膨化']
  },
  {
    id: 'P006',
    name: '奥利奥饼干',
    category: 'snacks',
    price: 7.80,
    unit: '盒',
    stock: 120,
    image: '/src/assets/products/snacks/orio.png',
    description: '巧克力味夹心饼干 388g',
    barCode: '6920552655006',
    discount: 0.9,
    isHot: false,
    tags: ['饼干', '甜点']
  },
  {
    id: 'P007',
    name: '卫龙辣条',
    category: 'snacks',
    price: 2.50,
    unit: '袋',
    stock: 200,
    image: '/src/assets/products/snacks/lajiao.png',
    description: '大面筋 65g',
    barCode: '6920552655007',
    discount: 1,
    isHot: true,
    tags: ['辣味', '童年']
  },
  {
    id: 'P008',
    name: '手抽纸巾',
    category: 'daily',
    price: 9.90,
    unit: '提',
    stock: 100,
    image: '/src/assets/products/daily/tissue.png',
    description: '抽纸 3层120抽*3包',
    barCode: '6920552655008',
    discount: 1,
    isHot: false,
    tags: ['生活用纸']
  },
  {
    id: 'P009',
    name: '雕牌洗洁精',
    category: 'daily',
    price: 12.80,
    unit: '瓶',
    stock: 80,
    image: '/src/assets/products/daily/detergent.png',
    description: '1.5kg 柠檬香型',
    barCode: '6920552655009',
    discount: 0.85,
    isHot: false,
    tags: ['清洁', '厨房']
  },
  {
    id: 'P010',
    name: '六神花露水',
    category: 'daily',
    price: 15.00,
    unit: '瓶',
    stock: 60,
    image: '/src/assets/products/daily/deet.png',
    description: '195ml 驱蚊型',
    barCode: '6920552655010',
    discount: 1,
    isHot: false,
    tags: ['驱蚊', '夏季']
  },
  {
    id: 'P011',
    name: '新鲜鸡蛋',
    category: 'fresh',
    price: 15.00,
    unit: '盒',
    stock: 50,
    image: '/src/assets/products/fresh/eggs.png',
    description: '土鸡蛋 12枚',
    barCode: '6920552655011',
    discount: 1,
    isHot: true,
    tags: ['生鲜', '营养']
  },
  {
    id: 'P012',
    name: '新鲜西红柿',
    category: 'fresh',
    price: 4.50,
    unit: '斤',
    stock: 40,
    image: '/src/assets/products/fresh/tomato.png',
    description: '500g 约2-3个',
    barCode: '6920552655012',
    discount: 1,
    isHot: false,
    tags: ['蔬菜', '新鲜']
  },
  {
    id: 'P013',
    name: '伊利纯牛奶',
    category: 'dairy',
    price: 12.00,
    unit: '箱',
    stock: 70,
    image: '/src/assets/products/dairy/milk.png',
    description: '250ml*12盒',
    barCode: '6920552655013',
    discount: 0.95,
    isHot: true,
    tags: ['牛奶', '补钙']
  },
  {
    id: 'P014',
    name: '蒙牛酸奶',
    category: 'dairy',
    price: 15.80,
    unit: '箱',
    stock: 45,
    image: '/src/assets/products/dairy/yogurt.png',
    description: '100g*12杯',
    barCode: '6920552655014',
    discount: 1,
    isHot: false,
    tags: ['酸奶', '益生菌']
  },
  {
    id: 'P015',
    name: '康师傅红烧牛肉面',
    category: 'instant',
    price: 4.50,
    unit: '袋',
    stock: 200,
    image: '/src/assets/products/instant/noodles.png',
    description: '方便面 103g',
    barCode: '6920552655015',
    discount: 1,
    isHot: true,
    tags: ['速食', '泡面']
  },
  {
    id: 'P016',
    name: '统一老坛酸菜面',
    category: 'instant',
    price: 4.50,
    unit: '袋',
    stock: 180,
    image: '/src/assets/products/instant/suancai.png',
    description: '方便面 105g',
    barCode: '6920552655016',
    discount: 0.9,
    isHot: false,
    tags: ['速食', '泡面', '酸菜']
  },
  {
    id: 'P017',
    name: '桂格燕麦片',
    category: 'instant',
    price: 22.00,
    unit: '袋',
    stock: 60,
    image: '/src/assets/products/instant/oat.png',
    description: '即食燕麦片 1kg',
    barCode: '6920552655017',
    discount: 1,
    isHot: false,
    tags: ['早餐', '健康']
  },
  {
    id: 'P018',
    name: '农夫果园',
    category: 'drinks',
    price: 4.20,
    unit: '瓶',
    stock: 100,
    image: '/src/assets/products/drinks/juice.png',
    description: '100%果汁 450ml',
    barCode: '6920552655018',
    discount: 1,
    isHot: false,
    tags: ['果汁', '健康']
  }
]

export const hotProducts = products.filter(p => p.isHot)

export const getProductsByCategory = (categoryId) => {
  if (!categoryId || categoryId === 'all') {
    return products
  }
  return products.filter(p => p.category === categoryId)
}

export const getProductById = (id) => {
  return products.find(p => p.id === id)
}
