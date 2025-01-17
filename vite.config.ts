import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 3040
    },
    preview: {
        port: 3040,
    },
    plugins: [
        react(),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), 'src/shared/assets/icons')],
            symbolId: 'icon-[name]',
        }),
    ],
    
});
