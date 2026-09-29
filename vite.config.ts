import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        internships: fileURLToPath(new URL('./pages/internships.html', import.meta.url)),
        careerGuide: fileURLToPath(new URL('./pages/career-guide.html', import.meta.url)),
        cvInterview: fileURLToPath(new URL('./pages/cv-interview.html', import.meta.url)),
        aboutContact: fileURLToPath(new URL('./pages/about-contact.html', import.meta.url)),
      },
    },
  },
});