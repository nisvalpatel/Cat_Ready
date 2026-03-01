"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Truck, FileText, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Fleet Overview", icon: LayoutDashboard },
  { href: "/dashboard/machines", label: "Machines", icon: Truck },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-cat-black text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <CATLogo className="h-6 w-auto" />
          <span className="font-heading font-black text-xl text-white">
            Ready
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded transition-colors",
                    isActive
                      ? "bg-cat-yellow text-cat-black"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-cat-yellow rounded flex items-center justify-center">
            <span className="text-sm font-bold text-cat-black">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              John Doe
            </p>
            <p className="text-xs text-white/50 truncate">
              Fleet Manager
            </p>
          </div>
          <button className="p-2 text-white/50 hover:text-white transition-colors">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function CATLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0 6C0 2.68629 2.68629 0 6 0H14V6H6V26H14V32H6C2.68629 32 0 29.3137 0 26V6Z"
        fill="white"
      />
      <path
        d="M24 0H40L50 32H42L40 24H24L22 32H14L24 0Z"
        fill="white"
      />
      <path
        d="M32 8L26 20H38L32 8Z"
        fill="#FFCD11"
      />
      <path
        d="M52 0H80V6H70V32H62V6H52V0Z"
        fill="white"
      />
    </svg>
  );
}
