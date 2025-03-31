import { Link } from "wouter";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import logoImage from "../assets/buildclub-logo.png";

export default function DashboardHeader() {
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) {
      return `${user.firstName[0]}`.toUpperCase();
    }
    if (user?.username) {
      return `${user.username[0]}`.toUpperCase();
    }
    return "BC";
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container max-w-7xl mx-auto py-4 px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <img 
                src={logoImage} 
                alt="BuildClub Logo" 
                className="h-10 cursor-pointer"
              />
            </Link>
            <div className="ml-4 flex flex-col">
              <span className="text-xl font-bold tracking-tight text-gray-900">Dashboard</span>
              <span className="text-sm text-gray-600">
                Welcome back, {user?.firstName || user?.username || "there"}!
              </span>
            </div>
          </div>
          
          {/* User Avatar and Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarImage src={user?.profilePicture || undefined} alt={user?.username || "User"} />
                <AvatarFallback className="bg-[--color-green]/10 text-[--color-green] font-medium">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1">
              <DropdownMenuLabel className="px-4 py-2 text-sm font-medium">
                <div>{user?.firstName} {user?.lastName}</div>
                <div className="text-xs font-normal text-gray-500 mt-1">{user?.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="px-4 py-2 text-sm" asChild>
                <Link href="/profile">
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              
              {user?.role === "admin" && (
                <DropdownMenuItem className="px-4 py-2 text-sm" asChild>
                  <Link href="/admin">
                    Admin Settings
                  </Link>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="px-4 py-2 text-sm text-red-600 focus:text-red-700 focus:bg-red-50"
                onClick={handleLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}