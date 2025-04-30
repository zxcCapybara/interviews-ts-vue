import { ref } from 'vue'

// Хук для форматирования номера телефона
export function usePhoneInput() {
  // Реактивная переменная для номера телефона
  const phone = ref<string>('')

  // Функция форматирования номера телефона
  const formatPhone = (event: Event): void => {
    const input = event.target as HTMLInputElement
    let value = input.value.replace(/\D/g, '') // Удаляем все нецифровые символы

    // Ограничиваем длину до 10 цифр (для формата (XXX) XXX-XXXX)
    value = value.slice(0, 10)

    // Форматируем в зависимости от длины
    let formatted = ''
    if (value.length > 0) {
      formatted += `(${value.slice(0, 3)}`
    }
    if (value.length > 3) {
      formatted += `) ${value.slice(3, 6)}`
    }
    if (value.length > 6) {
      formatted += `-${value.slice(6, 10)}`
    }

    // Обновляем значение
    phone.value = formatted
  }

  return {
    phone,
    formatPhone,
  }
}
