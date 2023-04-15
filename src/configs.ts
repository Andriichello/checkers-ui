export class ThemeConfig {
    /** Local storage key name */
    public static storage = 'data-theme';
    /** HTML element attribute name */
    public static attribute = 'data-theme';
    
    /** List of available themes */
    public static list(): string[] {
        return ['dark', 'light'];
    }

     /** Dark theme name */
     public static dark(): string {
        return 'dark';
    }

    /** Default theme */
    public static default(): string {
        return this.list()[0];
    }   
}