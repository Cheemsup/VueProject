// 订单数据及其操作函数
const ORDERS_KEY = 'userOrders'

const generateOrderId = () => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 4)
  return `ORD${timestamp}${random}`.toUpperCase()
}

const formatDate = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const getOrders = () => {
  const ordersStr = localStorage.getItem(ORDERS_KEY)
  if (ordersStr) {
    return JSON.parse(ordersStr)
  }
  return []
}

export const saveOrders = (orders) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

export const createOrder = (cartItems, totalAmount) => {
  const orders = getOrders()
  
  const newOrder = {
    id: generateOrderId(),
    items: cartItems.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      discount: item.discount,
      quantity: item.quantity,
      unit: item.unit,
      subtotal: (item.price * item.discount * item.quantity).toFixed(2)
    })),
    totalAmount: totalAmount.toFixed(2),
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    status: '待发货',
    date: formatDate(),
    createTime: new Date().toISOString()
  }
  
  orders.unshift(newOrder)
  saveOrders(orders)
  
  return newOrder
}

export const updateOrderStatus = (orderId, newStatus) => {
  const orders = getOrders()
  const orderIndex = orders.findIndex(o => o.id === orderId)
  if (orderIndex > -1) {
    orders[orderIndex].status = newStatus
    saveOrders(orders)
    return true
  }
  return false
}

export const deleteOrder = (orderId) => {
  const orders = getOrders()
  const filteredOrders = orders.filter(o => o.id !== orderId)
  saveOrders(filteredOrders)
  return filteredOrders.length < orders.length
}

export const getOrderById = (orderId) => {
  const orders = getOrders()
  return orders.find(o => o.id === orderId)
}
