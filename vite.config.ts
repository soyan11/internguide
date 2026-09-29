import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        // Root / Home
        main: 'index.html',
        
        // Pages ក្នុង folder pages/
        internships: 'pages/internships.html',
        careerGuide: 'pages/career-guide.html',
        about: 'pages/about.html',           // ថែម About Page
        cv: 'pages/cv.html',                 // ថែម CV & Interview Page
        
        // Auth Pages ក្នុង folder pages/auth/
        login: 'pages/auth/login.html',
        signup: 'pages/auth/signup.html',
      },
    },
  },
})