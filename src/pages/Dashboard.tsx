
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useLicense } from '@/context/LicenseContext';
import { Button } from '@/components/ui/button';
import LicenseCard from '@/components/LicenseCard';
import StatisticCard from '@/components/StatisticCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NotificationItem from '@/components/NotificationItem';
import { Link } from 'react-router-dom';
import { FileCheck, AlertTriangle, Clock, User, Users, FileUp, Bell } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    licenses, 
    notifications, 
    getPendingLicenses, 
    getDriverLicenses,
    getLicensesNearExpiry,
    getHighPenaltyDrivers
  } = useLicense();

  // Get relevant data based on user role
  const pendingLicenses = getPendingLicenses();
  const driverLicenses = user ? getDriverLicenses(user.id) : [];
  const expiringLicenses = getLicensesNearExpiry();
  const highPenaltyDrivers = getHighPenaltyDrivers();
  
  const userNotifications = notifications.filter(
    n => n.userId === user?.id
  ).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);
  
  const isManager = user?.role === 'manager' || user?.role === 'admin';
  const isDriver = user?.role === 'driver' || user?.role === 'admin';

  // Statistics for different roles
  const getManagerStats = () => {
    return [
      {
        title: "Total Drivers",
        value: licenses.length > 0 ? new Set(licenses.map(l => l.driverId)).size : 0,
        icon: <Users className="h-5 w-5" />,
        trend: { value: 12, isPositive: true }
      },
      {
        title: "Pending Approvals",
        value: pendingLicenses.length,
        icon: <FileCheck className="h-5 w-5" />,
        description: pendingLicenses.length === 0 ? "All clear!" : "Requires your attention"
      },
      {
        title: "Licenses Expiring Soon",
        value: expiringLicenses.length,
        icon: <Clock className="h-5 w-5" />,
        description: "Within the next 90 days"
      },
      {
        title: "High Penalty Drivers",
        value: highPenaltyDrivers.length,
        icon: <AlertTriangle className="h-5 w-5" />,
        description: "7 or more penalty points"
      }
    ];
  };

  const getDriverStats = () => {
    const activeDriverLicense = driverLicenses.length > 0 ? 
      driverLicenses.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0] : null;
    
    return [
      {
        title: "License Status",
        value: activeDriverLicense ? activeDriverLicense.status.charAt(0).toUpperCase() + activeDriverLicense.status.slice(1) : "None",
        icon: <FileCheck className="h-5 w-5" />,
        description: activeDriverLicense ? `Last updated: ${new Date(activeDriverLicense.updatedAt).toLocaleDateString()}` : "No license on file"
      },
      {
        title: "Penalty Points",
        value: activeDriverLicense ? `${activeDriverLicense.penaltyPoints}/12` : "N/A",
        icon: <AlertTriangle className="h-5 w-5" />,
        description: activeDriverLicense && activeDriverLicense.penaltyPoints >= 7 ? "High - requires attention" : "Within safe limits"
      },
      {
        title: "Days Until Expiry",
        value: activeDriverLicense ? differenceInDays(parseISO(activeDriverLicense.expiryDate), new Date()) : "N/A",
        icon: <Clock className="h-5 w-5" />,
        description: activeDriverLicense ? `Expires on ${new Date(activeDriverLicense.expiryDate).toLocaleDateString()}` : "No active license"
      },
      {
        title: "Notifications",
        value: userNotifications.filter(n => !n.read).length,
        icon: <Bell className="h-5 w-5" />,
        description: userNotifications.filter(n => !n.read).length > 0 ? "Unread messages" : "All caught up!"
      }
    ];
  };

  // Use the appropriate stats based on user role
  const stats = isManager ? getManagerStats() : getDriverStats();

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col space-y-8 animate-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome, {user?.name}
            </h1>
            
            <div className="flex space-x-2">
              {isDriver && (
                <Button asChild>
                  <Link to="/license-upload">
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload License
                  </Link>
                </Button>
              )}
              
              {isManager && pendingLicenses.length > 0 && (
                <Button asChild variant="outline">
                  <Link to="/manager-approval">
                    <FileCheck className="mr-2 h-4 w-4" />
                    View Approvals ({pendingLicenses.length})
                  </Link>
                </Button>
              )}
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <StatisticCard
                key={i}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                description={stat.description}
                trend={stat.trend}
                className={`stagger-${i + 1} animate-in-up`}
              />
            ))}
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* License information */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold">License Information</h2>
              
              {isDriver && (
                <div className="space-y-4">
                  {driverLicenses.length > 0 ? (
                    driverLicenses.map(license => (
                      <LicenseCard key={license.id} license={license} />
                    ))
                  ) : (
                    <Card className="glass">
                      <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileUp className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-muted-foreground text-center">
                          You haven't uploaded any license information yet.
                        </p>
                        <Button asChild>
                          <Link to="/license-upload">Upload License</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
              
              {isManager && (
                <div className="space-y-4">
                  {pendingLicenses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pendingLicenses.slice(0, 4).map(license => (
                        <LicenseCard 
                          key={license.id} 
                          license={license} 
                          showActions={true} 
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="glass">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-center space-x-4">
                          <FileCheck className="h-6 w-6 text-primary" />
                          <p className="text-muted-foreground">
                            No pending license approvals at this time.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {pendingLicenses.length > 4 && (
                    <div className="text-center">
                      <Button variant="outline" asChild>
                        <Link to="/manager-approval">
                          View all {pendingLicenses.length} pending approvals
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Recent Notifications */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Recent Notifications</h2>
              
              <div className="space-y-4">
                {userNotifications.length > 0 ? (
                  userNotifications.map((notification, index) => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                    />
                  ))
                ) : (
                  <Card className="glass">
                    <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bell className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-muted-foreground text-center">
                        You don't have any notifications at this time.
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                {userNotifications.length > 0 && (
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/notifications">
                      View all notifications
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
