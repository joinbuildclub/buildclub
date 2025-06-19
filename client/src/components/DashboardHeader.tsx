import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import logoImage from "@/assets/logo.png";

// Community links data
const communityLinks = [
  {
    name: "Slack",
    url: "https://join.slack.com/t/joinbuildclub/shared_invite/zt-35oxsm40k-bokmXmq3VLq8g~T_vSNmTA",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
      </svg>
    ),
    color: "text-teal-500 hover:text-teal-600",
  },
  {
    name: "Twitter",
    url: "https://x.com/joinbuildclub",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: "text-blue-500 hover:text-blue-600",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/joinbuildclub",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    color: "text-pink-500 hover:text-pink-600",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/joinbuildclub",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: "text-sky-500 hover:text-sky-600",
  },
];

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
    <div className="bg-white border-b border-gray-200 shadow-sm dashboard-font">
      <div className="container max-w-7xl mx-auto py-4 px-6 sm:px-8 md:px-10">
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
          </div>

          {/* Right side: Social Media Links + User Avatar */}
          <div className="flex items-center">
            {/* Social Media Links */}
            <div className="hidden md:flex items-center mr-6">
              <TooltipProvider>
                {/* Other Social Links (reversed order) */}
                {communityLinks
                  .slice(1)
                  .reverse()
                  .map((link, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`transition-colors mr-5 ${link.color}`}
                          aria-label={link.name}
                        >
                          {link.icon}
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Join us on {link.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}

                {/* Discord CTA Button (closest to avatar) */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={communityLinks[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-teal-100 hover:bg-teal-200 text-teal-700 font-medium py-1.5 px-4 rounded-md transition-colors"
                      aria-label={communityLinks[0].name}
                    >
                      <span className="mr-1.5">{communityLinks[0].icon}</span>
                      <span>Join Slack</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with our community</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* User Avatar and Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-10 w-10 border border-gray-200">
                  <AvatarImage
                    src={user?.profilePicture || undefined}
                    alt={user?.username || "User"}
                  />
                  <AvatarFallback className="bg-[--color-green]/10 text-[--color-green] font-medium">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1">
                <DropdownMenuLabel className="px-4 py-2 text-sm font-medium">
                  <div>
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs font-normal text-gray-500 mt-1">
                    {user?.email}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="px-4 py-2 text-sm" asChild>
                  <Link href="/ideas">Community Ideas</Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="px-4 py-2 text-sm" asChild>
                  <Link href="/profile">Profile Settings</Link>
                </DropdownMenuItem>

                {user?.role === "admin" && (
                  <DropdownMenuItem className="px-4 py-2 text-sm" asChild>
                    <Link href="/admin">Admin Settings</Link>
                  </DropdownMenuItem>
                )}

                {/* Mobile-only social links */}
                <DropdownMenuSeparator className="md:hidden" />
                <div className="md:hidden px-4 py-2">
                  <div className="text-xs font-medium text-gray-500 mb-2">
                    Connect with us
                  </div>

                  {/* Slack CTA in dropdown */}
                  <a
                    href={communityLinks[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-teal-100 hover:bg-teal-200 text-teal-700 font-medium py-1.5 px-3 rounded-md transition-colors mb-2 text-sm"
                    aria-label={communityLinks[0].name}
                  >
                    <span className="mr-1.5">{communityLinks[0].icon}</span>
                    <span>Join Slack</span>
                  </a>

                  {/* Other social links */}
                  <div className="flex space-x-3">
                    {communityLinks.slice(1).map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`transition-colors ${link.color}`}
                        aria-label={link.name}
                      >
                        {link.icon}
                      </a>
                    ))}
                  </div>
                </div>

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
    </div>
  );
}
