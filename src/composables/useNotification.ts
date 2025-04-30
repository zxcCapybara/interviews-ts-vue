import { ref } from 'vue'

export const useNotification = () => {
  const isNotificationOpen = ref<boolean>(false)
  const errorMessage = ref<string>('')

  const openNotification = (msg: string) => {
    errorMessage.value = msg
    isNotificationOpen.value = true
    setTimeout(() => closeNotification(), 3000)
  }

  const closeNotification = () => (isNotificationOpen.value = false)

  return {
    isNotificationOpen,
    errorMessage,
    openNotification,
    closeNotification,
  }
}
