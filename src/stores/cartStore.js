
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const merchantProfileId = ref(null)
  const merchantName = ref(null)

  const totalItems = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0),
  )

  const subtotal = computed(() =>
    items.value.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0,
    ),
  )

  /**
   * Add a menu to the shopping cart.
   *
   * @param {Object} menu
   * @param {Object} merchant
   * @returns {{ success: boolean, message: string }}
   */
  const addItem = (menu, merchant) => {
    if (
      merchantProfileId.value &&
      merchantProfileId.value !== merchant.id
    ) {
      return {
        success: false,
        message: 'Keranjang hanya dapat berisi menu dari satu merchant.',
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
   * Remove an item from the cart.
   *
   * @param {string} menuId
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
   * Clear all cart items.
   */
  const clearCart = () => {
    items.value = []
    merchantProfileId.value = null
    merchantName.value = null
  }

  return {
    items,
    merchantProfileId,
    merchantName,
    totalItems,
    subtotal,
    addItem,
    removeItem,
    clearCart,
  }
})
