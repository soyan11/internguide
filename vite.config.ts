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
        main: 'index.html',
        internships: 'pages/internships.html',
        careerGuide: 'pages/career-guide.html',
        cvInterview: 'pages/cv-interview.html',     // កែតម្រូវឈ្មោះ file
        aboutContact: 'pages/about-contact.html',   // កែតម្រូវឈ្មោះ file
        login: 'pages/auth/login.html',
        signup: 'pages/auth/signup.html',
      },
    },
  },
})