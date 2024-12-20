import { Calendar, LayoutDashboard, Users, FileText, Settings, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Schedule",
    icon: Calendar,
    path: "/schedule",
  },
  {
    title: "Technicians",
    icon: Users,
    path: "/technicians",
  },
  {
    title: "Reports",
    icon: FileText,
    path: "/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <h1 className="text-xl font-bold text-primary">Eagle Vision</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <div className="flex items-center gap-3 text-red-600">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}