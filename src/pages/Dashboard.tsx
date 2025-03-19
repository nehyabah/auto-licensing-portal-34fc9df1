import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLicense } from '@/context/LicenseContext';
import { useDrivers } from '@/context/DriverContext';
import Navbar from '@/components/Navbar';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, Calendar, AlertTriangle, CheckCircle, Clock, 
  FileText, UserCheck
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { licenses, getLicensesNearExpiry } = useLicense();
  const { drivers } = useDrivers();

  const licensesExpiringSoon = getLicensesNearExpiry();
  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter(driver => driver.status === 'active').length;
  const suspendedDrivers = drivers.filter(driver => driver.status === 'suspended').length;

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold tracking-tight mb-6">
            Dashboard
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <Card>
              <CardHeader>
                <CardTitle>Welcome, {user?.name}!</CardTitle>
                <CardDescription>
                  Here's a quick overview of your council operations.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>Total Drivers: {totalDrivers}</span>
                </div>
                <div className="flex items-center">
                  <UserCheck className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>Active Drivers: {activeDrivers}</span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>Suspended Drivers: {suspendedDrivers}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* License Overview */}
            <Card>
              <CardHeader>
                <CardTitle>License Overview</CardTitle>
                <CardDescription>
                  Key license statistics and upcoming expirations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                    <span>Total Licenses: {licenses.length}</span>
                  </div>
                  
                  {licensesExpiringSoon.length > 0 ? (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Expiring Soon:</h4>
                      {licensesExpiringSoon.map(license => (
                        <div 
                          key={license.id} 
                          className="flex items-center justify-between text-sm"
                        >
                          <span>
                            {license.driverName} - {format(parseISO(license.expiryDate), 'MMM d, yyyy')}
                          </span>
                          <Button variant="secondary" size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No licenses expiring in the next 3 months.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates and actions within the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>License approved for John Doe</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {format(new Date(), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                    <span>Driver Jane Smith has a suspended license</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {format(new Date(Date.now() - 86400000), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-blue-500 mr-2" />
                    <span>New license application submitted by Mike Brown</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {format(new Date(Date.now() - 172800000), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
