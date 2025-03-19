
import React from 'react';

import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Bell, CalendarRange, CheckCheck, FileInput, UserRound, Users, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import StatisticCard from '@/components/StatisticCard';
import { useLicense } from '@/context/LicenseContext';
import { differenceInDays, parseISO, isBefore, addDays } from 'date-fns';
import { useDrivers } from '@/context/DriverContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { licenses, getPendingLicenses } = useLicense();
  const { drivers } = useDrivers();
  
  const pendingLicenses = getPendingLicenses();
  const isManager = user?.role === 'manager' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';
  
  // Calculate expiring licenses in next 30 days
  const today = new Date();
  const in30Days = addDays(today, 30);
  
  const expiringLicenses = licenses.filter(license => {
    const expiryDate = parseISO(license.expiryDate);
    return !isBefore(expiryDate, today) && isBefore(expiryDate, in30Days);
  });
  
  // High penalty point licenses
  const highPointLicenses = licenses.filter(license => 
    license.penaltyPoints >= 7
  );
  
  // Filter to get user's licenses
  const userLicenses = licenses.filter(license => license.driverName === user?.name);
  
  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col space-y-8 animate-in-up">
          {/* Welcome and header */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}
            </p>
          </div>
          
          {/* Quick Actions - Different for managers and drivers */}
          {isManager ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatisticCard 
                title="Total Licenses"
                value={licenses.length}
                description="Registered licenses"
                icon={<FileInput className="h-5 w-5" />}
              />
              
              <StatisticCard 
                title="Pending Approvals"
                value={pendingLicenses.length}
                description={`License${pendingLicenses.length !== 1 ? 's' : ''} awaiting review`}
                icon={<CheckCheck className="h-5 w-5" />}
              />
              
              <StatisticCard 
                title="Expiring Soon"
                value={expiringLicenses.length}
                description="Licenses expiring in 30 days"
                icon={<CalendarRange className="h-5 w-5" />}
              />
              
              <StatisticCard 
                title="Active Drivers"
                value={drivers.filter(d => d.status === 'active').length}
                description="Currently active drivers"
                icon={<UserRound className="h-5 w-5" />}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <StatisticCard 
                title="Your Licenses"
                value={userLicenses.length}
                description="Your registered licenses"
                icon={<FileInput className="h-5 w-5" />}
              />
              
              <StatisticCard 
                title="Expiring Soon"
                value={userLicenses.filter(license => {
                  const expiryDate = parseISO(license.expiryDate);
                  return !isBefore(expiryDate, today) && isBefore(expiryDate, in30Days);
                }).length}
                description="Your licenses expiring in 30 days"
                icon={<CalendarRange className="h-5 w-5" />}
              />
            </div>
          )}
          
          {/* Manager/Admin specific content */}
          {isManager && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pending Approvals Card */}
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl">Recent License Submissions</CardTitle>
                  {pendingLicenses.length > 0 && (
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                      {pendingLicenses.length} Pending
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  {pendingLicenses.length > 0 ? (
                    <div className="space-y-4">
                      {pendingLicenses.slice(0, 3).map(license => (
                        <div key={license.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                          <div>
                            <p className="font-medium">{license.driverName}</p>
                            <p className="text-sm text-muted-foreground">{license.licenseType} License • #{license.licenseNumber}</p>
                          </div>
                          <Button size="sm" onClick={() => navigate('/manager-approval')}>
                            Review
                          </Button>
                        </div>
                      ))}
                      
                      {pendingLicenses.length > 3 && (
                        <Button 
                          variant="ghost" 
                          className="w-full mt-2" 
                          onClick={() => navigate('/manager-approval')}
                        >
                          View all {pendingLicenses.length} pending approvals
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <CheckCheck className="h-10 w-10 text-primary/50 mb-2" />
                      <p className="text-muted-foreground">No pending license submissions to review.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Quick Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Quick Actions</CardTitle>
                  <CardDescription>Common tasks and actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => navigate('/manager-approval')}
                  >
                    <CheckCheck className="mr-2 h-4 w-4" />
                    Manage Approvals
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => navigate('/notifications')}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    View Notifications
                  </Button>
                  
                  {isAdmin && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => navigate('/admin/drivers')}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Manage Drivers
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* High Risk Drivers Alert - Show only to managers and admins */}
          {isManager && highPointLicenses.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>High Risk Drivers</AlertTitle>
              <AlertDescription>
                {highPointLicenses.length} driver{highPointLicenses.length !== 1 ? 's' : ''} with 7 or more penalty points. 
                These drivers may require additional monitoring.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Driver specific content */}
          {!isManager && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* License Status Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl">Your License Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {licenses.filter(license => license.driverName === user?.name).length > 0 ? (
                    <div className="space-y-4">
                      {licenses
                        .filter(license => license.driverName === user?.name)
                        .slice(0, 1)
                        .map(license => {
                          const daysUntilExpiry = differenceInDays(parseISO(license.expiryDate), new Date());
                          const isExpiring = daysUntilExpiry <= 30;
                          
                          return (
                            <div key={license.id} className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{license.licenseType} License</p>
                                  <p className="text-sm text-muted-foreground">#{license.licenseNumber}</p>
                                </div>
                                <Badge className={
                                  license.status === 'approved' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : license.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                }>
                                  {license.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-md bg-secondary/50">
                                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                                  <p className={
                                    isExpiring 
                                      ? 'font-medium text-amber-600 dark:text-amber-400'
                                      : 'font-medium'
                                  }>
                                    {parseISO(license.expiryDate).toLocaleDateString()}
                                  </p>
                                </div>
                                
                                <div className="p-3 rounded-md bg-secondary/50">
                                  <p className="text-sm text-muted-foreground">Penalty Points</p>
                                  <p className={
                                    license.penaltyPoints >= 7 
                                      ? 'font-medium text-destructive'
                                      : 'font-medium'
                                  }>
                                    {license.penaltyPoints} / 12
                                  </p>
                                </div>
                              </div>
                              
                              {isExpiring && (
                                <Alert>
                                  <CalendarRange className="h-4 w-4" />
                                  <AlertTitle>License Expiring Soon</AlertTitle>
                                  <AlertDescription>
                                    Your license will expire in {daysUntilExpiry} days. Please submit a renewal request.
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <FileInput className="h-10 w-10 text-primary/50 mb-4" />
                      <p className="text-muted-foreground mb-4">No license information found. Submit your license details to get started.</p>
                      <Button onClick={() => navigate('/license-upload')}>
                        Submit License
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Quick Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Quick Actions</CardTitle>
                  <CardDescription>Common tasks and actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => navigate('/license-upload')}
                  >
                    <FileInput className="mr-2 h-4 w-4" />
                    Upload License
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => navigate('/notifications')}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    View Notifications
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
