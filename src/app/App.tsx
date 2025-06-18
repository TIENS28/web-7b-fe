import { useTheme } from '../shared/hooks/useTheme';
import { AuthProvider } from './providers/AuthProvider';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { AppRouter } from './router/AppRouter';
import { Toaster } from 'shared/components/shadcn/sonner';

function App() {
  // Khởi tạo theme hook để đảm bảo DOM được cập nhật
  useTheme();
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
            <main className="flex-grow">
              <Toaster />
              <AppRouter />
            </main>
          </div>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
