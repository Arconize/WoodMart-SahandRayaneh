import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        products: path.resolve(__dirname, 'pages/products.html'),
        product: path.resolve(__dirname, 'pages/product.html'),
        wishlist: path.resolve(__dirname, 'pages/wishlist.html'),
        cart: path.resolve(__dirname, 'pages/cart.html'),
      },
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
