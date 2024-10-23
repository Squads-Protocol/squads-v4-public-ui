import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

export default function LightDarkButton() {
  const { systemTheme, theme, setTheme } = useTheme();
  theme === "system" ? systemTheme : theme;
  function changeTheme() {
    theme == "dark" ? setTheme("light") : setTheme("dark");
  }
  return (
    <button onClick={changeTheme} className="transition duration-1000 flex">
      {theme == "dark" ? (
        <SunIcon className="w-6 h-6" />
      ) : (
        <MoonIcon className="w-6 h-6" />
      )}
    </button>
  );
}
