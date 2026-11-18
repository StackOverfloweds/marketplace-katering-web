
import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const CART_STORAGE_KEY = 'marketplace_katering_cart'

/**
 * Load cart data from localStorage.
 *
 * @returns {Object|null}
 */
const loadCart = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)

    return savedCart ? JSON.parse(savedCart) : null
  } catch (error) {
    console.error('Gagal membaca keranjang:', error)
    return null
  }
}

export const useCartStore = defineStore('cart', () => {
  const savedCart = loadCart()

  const items = ref(savedCart?.items || [])
  const merchantProfileId = ref(savedCart?.merchantProfileId || null)
  const merchantName = ref(savedCart?.merchantName || null)

  /**
   * Calculate total quantity of all cart items.
   *
   * @returns {number}
   */
  const totalItems = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0),
  )

  /**
   * Calculate total cart subtotal.
   *
   * @returns {number}
   */
  const subtotal = computed(() =>
    items.value.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0,
    ),
  )

  /**
   * Check whether the cart contains items.
   *
   * @returns {boolean}
   */
  const isEmpty = computed(() => items.value.length === 0)

  /**
   * Persist cart data whenever its state changes.
   */
  watch(
    [items, merchantProfileId, merchantName],
    () => {
      try {
        if (items.value.length === 0) {
          localStorage.removeItem(CART_STORAGE_KEY)
          return
        }

        localStorage.setItem(
          CART_STORAGE_KEY,
          JSON.stringify({
            items: items.value,
            merchantProfileId: merchantProfileId.value,
            merchantName: merchantName.value,
          }),
        )
      } catch (error) {
        console.error('Gagal menyimpan keranjang:', error)
      }
    },
    { deep: true },
  )

  /**
   * Add a menu to the shopping cart.
   *
   * @param {Object} menu
   * @param {Object} merchant
   * @returns {{ success: boolean, message: string }}
   */
  const addItem = (menu, merchant) => {
    if (!menu?.id || !merchant?.id) {
      return {
        success: false,
        message: 'Data menu atau merchant tidak valid.',
      }
    }

    if (
      merchantProfileId.value &&
      merchantProfileId.value !== merchant.id
    ) {
      return {
        success: false,
        message: 'Keranjang hanya dapat berisi menu dari satu merchant.',
      }
    }

    if (!menu.is_available) {
      return {
        success: false,
        message: 'Menu sedang tidak tersedia.',
      }
    }

    merchantProfileId.value = merchant.id
    merchantName.value = merchant.company_name || merchant.full_name

    const existingItem = items.value.find(
      (item) => item.menuId === menu.id,
    )

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({
        menuId: menu.id,
        name: menu.name,
        price: Number(menu.price),
        photoUrl: menu.photo_url || null,
        quantity: 1,
      })
    }

    return {
      success: true,
      message: `${menu.name} berhasil ditambahkan ke pesanan.`,
    }
  }

  /**
   * Increase an item's quantity.
   *
   * @param {string} menuId
   * @returns {void}
   */
  const incrementItem = (menuId) => {
    const item = items.value.find((item) => item.menuId === menuId)

    if (item) {
      item.quantity += 1
    }
  }

  /**
   * Decrease an item's quantity.
   * Remove the item when its quantity reaches zero.
   *
   * @param {string} menuId
   * @returns {void}
   */
  const decrementItem = (menuId) => {
    const item = items.value.find((item) => item.menuId === menuId)

    if (!item) return

    if (item.quantity > 1) {
      item.quantity -= 1
    } else {
      removeItem(menuId)
    }
  }

  /**
   * Update an item's quantity directly.
   *
   * @param {string} menuId
   * @param {number} quantity
   * @returns {void}
   */
  const updateQuantity = (menuId, quantity) => {
    const item = items.value.find((item) => item.menuId === menuId)

    if (!item) return

    const parsedQuantity = Number(quantity)

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      removeItem(menuId)
      return
    }

    item.quantity = parsedQuantity
  }

  /**
   * Calculate subtotal for a specific item.
   *
   * @param {Object} item
   * @returns {number}
   */
  const getItemSubtotal = (item) => {
    return Number(item.price) * item.quantity
  }

  /**
   * Remove an item from the cart.
   *
   * @param {string} menuId
   * @returns {void}
   */
  const removeItem = (menuId) => {
    items.value = items.value.filter(
      (item) => item.menuId !== menuId,
    )

    if (items.value.length === 0) {
      clearCart()
    }
  }

  /**
   * Generate order items payload for the backend.
   *
   * @returns {Array<{menu_id: string, quantity: number}>}
   */
  const getOrderItemsPayload = () => {
    return items.value.map((item) => ({
      menu_id: item.menuId,
      quantity: item.quantity,
    }))
  }

  /**
   * Clear all cart data.
   *
   * @returns {void}
   */
  const clearCart = () => {
    items.value = []
    merchantProfileId.value = null
    merchantName.value = null

    localStorage.removeItem(CART_STORAGE_KEY)
  }

  return {
    items,
    merchantProfileId,
    merchantName,
    totalItems,
    subtotal,
    isEmpty,
    addItem,
    incrementItem,
    decrementItem,
    updateQuantity,
    getItemSubtotal,
    getOrderItemsPayload,
    removeItem,
    clearCart,
  }
})
    