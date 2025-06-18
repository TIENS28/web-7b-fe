import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../src/app/App'
import 'app/index.css'
// import 'app/styles/themes.css'
import { useThemeStore } from 'app/stores/themeStore'
import { I18nProvider } from './app/providers/I18nProvider'; // Import I18nProvider


// Khởi tạo theme từ localStorage
const theme = useThemeStore.getState().theme
document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-green', 'dark')
document.documentElement.classList.add(`theme-${theme}`)
if (theme === 'dark') {
  document.documentElement.classList.add('dark')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
)
