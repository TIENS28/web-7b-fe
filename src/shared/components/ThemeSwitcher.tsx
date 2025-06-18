import { useTheme } from 'shared/hooks/useTheme'

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="ml-2 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-yellow-500 dark:text-blue-300 border border-gray-200 dark:border-gray-700 transition"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}
