import { defineConfig } from "vitest/config";


// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: "jsdom",
   "exclude": ["**/node_modules/**", "**/dist/**", "**/e2e/**",'**/*.{test,spec}.ts'],
    

    server: {
      deps: {
        // https://github.com/vercel/next.js/issues/77200
        inline: ['next-intl']
      }
    }


  },
  
    resolve: {
    alias: {
     '@/': new URL('./src/', import.meta.url).pathname, 
    },
  },
   
  
});



/*


    server: {
      deps: {
        // https://github.com/vercel/next.js/issues/77200
        inline: ['next-intl']
      }
    }

  resolve: {
    alias: {
     '@/': new URL('./src/', import.meta.url).pathname, 
    },
  },




*/