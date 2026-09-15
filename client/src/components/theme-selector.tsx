import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/use-theme';
import { Monitor, Moon, Sun } from 'lucide-react';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const themeIcons = {
    system: <Monitor />,
    light: <Sun />,
    dark: <Moon />,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            title="Theme"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground shrink-0 hover:flex"
          >
            {themeIcons[theme]}
          </Button>
        }
      />

      <DropdownMenuContent>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setTheme('system')}
        >
          {themeIcons['system']}
          <span>System</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setTheme('light')}
        >
          {themeIcons['light']}
          <span>Light</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setTheme('dark')}
        >
          {themeIcons['dark']}
          <span>Dark</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
