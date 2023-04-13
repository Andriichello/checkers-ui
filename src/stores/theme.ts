import { ThemeConfig } from '@/configs';
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: null,
  }),
  getters: {
    list: (state) => ThemeConfig.list(), 
  },
  actions: {
    apply(theme: string | null) {
      if (theme === null) {
        localStorage.removeItem('data-theme');
      } else {
        localStorage.setItem('data-theme', theme);
      }

      this.theme = theme;
    },
    resolve() {
      const theme = localStorage.getItem('data-theme');
      
      this.apply(theme ?? ThemeConfig.default());
    }
  },
})
