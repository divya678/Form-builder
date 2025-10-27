import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Home, LayoutDashboard } from "lucide-react";
import Link from "next/link";

// Menu items.
const items = [
  { href: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/builder", label: "Builder", icon: <Home size={18} /> },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>Form Builder</SidebarHeader>
      {/* <SidebarTrigger /> */}
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 py-2 px-3 hover:bg-zinc-800 rounded-md transition"
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
