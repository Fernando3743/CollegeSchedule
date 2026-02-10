"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav-items";
import {
  GraduationCap,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight">USC Schedule</h1>
            <p className="text-xs text-muted-foreground">Ing. Sistemas Virtual</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive && "text-primary")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span>Toggle Theme</span>
        </Button>
      </div>
    </aside>
  );
}
