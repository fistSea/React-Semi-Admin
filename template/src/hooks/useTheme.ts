import { useLocalStorage } from "./useLocalStorage";
import type { ThemeMode } from "@/types";

/**
 * 主题切换Hook - 仅使用本地存储，不包含状态管理
 * @returns [theme, toggleTheme]
 */
export function useTheme(): [ThemeMode, () => void] {
  const [theme, setTheme] = useLocalStorage<ThemeMode>("theme", "light");

  // 切换主题
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return [theme, toggleTheme];
}
  