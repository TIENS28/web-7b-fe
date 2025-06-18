import { useEffect } from 'react'
import { useThemeStore } from 'app/stores/themeStore'

/**
 * Hook để quản lý theme sử dụng Zustand
 * Cung cấp theme hiện tại và function để thay đổi theme
 */
export const useTheme = () => {
  const { theme, setTheme } = useThemeStore()

  useEffect(() => {
    // Cập nhật DOM classes khi theme thay đổi
    document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-green', 'dark')
    document.documentElement.classList.add(`theme-${theme}`)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, [theme])

  // Function để toggle theme giữa light và dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    
    // Cập nhật DOM classes
    document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-green', 'dark')
    document.documentElement.classList.add(`theme-${newTheme}`)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }

  // Function để set theme cụ thể
  const changeTheme = (newTheme: 'light' | 'dark' | 'green') => {
    setTheme(newTheme)
    
    // Cập nhật DOM classes
    document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-green', 'dark')
    document.documentElement.classList.add(`theme-${newTheme}`)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }

  return {
    theme,
    setTheme: changeTheme,
    toggleTheme,
    isLight: theme === 'light',
    isDark: theme === 'dark',
    isGreen: theme === 'green'
  }
} 
