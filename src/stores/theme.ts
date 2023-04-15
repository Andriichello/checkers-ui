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
      document.body.setAttribute(ThemeConfig.attribute, theme);
      
      if (theme === null) {
        localStorage.removeItem(ThemeConfig.storage);
      } else {
        localStorage.setItem(ThemeConfig.storage, theme);
      }

      this.theme = theme;
    },
    resolve() {
      const theme = localStorage.getItem(ThemeConfig.storage);
      
      this.apply(theme ?? ThemeConfig.default());
    }
  },
})
