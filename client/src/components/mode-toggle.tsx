import { Button, type SemanticICONS } from "semantic-ui-react"
import { useTheme, type Theme } from "@/components/theme-provider";

function themeIcon(theme: Theme): SemanticICONS {
    switch (theme) {
        case "dark":
            return "moon"
        case "light":
            return "sun"
        default:
            return "computer"
    }
}

export function ModeToggle() {
  const { theme, mode, setTheme } = useTheme();
  const themes: Theme[]  = ["light", "dark", "system"]

  return (
        <Button basic
            inverted={mode === "dark"}
            onClick={() => {setTheme(themes[(themes.indexOf(theme) + 1) % themes.length])}}
            icon={themeIcon(theme)}
        />
  );
}
