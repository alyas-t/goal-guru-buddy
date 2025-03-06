
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, MessageSquare, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const AppSidebar = () => {
  const { signOut } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-4">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-semibold text-sm">GG</span>
          </div>
          <span className="text-lg font-semibold">Goal Guru</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <nav className="space-y-1 px-2 mt-4">
          <NavLink to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/chat" className={`nav-item ${isActive('/chat') ? 'active' : ''}`}>
            <MessageSquare size={18} />
            <span>Coach Chat</span>
          </NavLink>
          
          <NavLink to="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </SidebarContent>
      
      <SidebarFooter className="px-3 py-4">
        <Button 
          variant="outline" 
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
