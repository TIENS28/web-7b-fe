import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(),
    ],
    resolve: {
        alias: {
            'shared': path.resolve(__dirname, 'src/shared'),
            'public': path.resolve(__dirname, 'src/public'),
            'admin': path.resolve(__dirname, 'src/admin'),
            'app': path.resolve(__dirname, 'src/app'),
            'locales': path.resolve(__dirname, 'src/locales'),
            // Thêm các alias khác nếu cần
        },
    },
    build: {
        // Cập nhật target để hỗ trợ top-level await (ES2022)
        target: 'es2022'
    }
});
