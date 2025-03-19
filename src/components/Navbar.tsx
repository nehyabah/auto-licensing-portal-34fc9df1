import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLicense } from '@/context/LicenseContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileUp,
  Bell,
  ClipboardCheck,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications } = useLicense();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter(
    n => n.userId === user?.id && !n.read
  ).length;

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['driver', 'manager', 'admin']
    },
    {
      name: 'License Upload',
      path: '/license-upload',
      icon: <FileUp className="w-5 h-5" />,
      roles: ['driver', 'admin']
    },
    {
      name: 'Approvals',
      path: '/manager-approval',
      icon: <ClipboardCheck className="w-5 h-5" />,
      roles: ['manager', 'admin']
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: (
        <div className="relative">
          <Bell className="w-5 h-5" />
          {unreadNotifications > 0 && (
            <Badge className="absolute -top-2 -right-2 min-w-[1.2rem] h-[1.2rem] flex items-center justify-center p-0">
              {unreadNotifications}
            </Badge>
          )}
        </div>
      ),
      roles: ['driver', 'manager', 'admin']
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const filteredNavItems = navItems.filter(
    item => user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="w-full bg-background/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img 
                src="https://res.cloudinary.com/dfjv35kht/image/upload/v1742396523/CORK-CITY-COUNCIL-LOGO-1_jnm9vr.jpg" 
                alt="Cork City Council" 
                className="h-8" 
              />
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {user && filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all hover-lift ${
                    location.pathname === item.path
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <div className="flex h-10 w-10 rounded-full items-center justify-center bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <Badge className="w-fit text-xs mt-1">{user.role}</Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
            )}
            
            <div className="flex md:hidden ml-2">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-primary"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background/90 backdrop-blur-md animate-in">
          {user && filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center px-3 py-2 rounded-md text-base font-medium transition-all ${
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground/70 hover:bg-primary/5 hover:text-primary'
              }`}
              onClick={closeMobileMenu}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          
          {user && (
            <button
              onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}
              className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/5 transition-all"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Log out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
