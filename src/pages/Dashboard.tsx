
import React from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useLicense } from '@/context/LicenseContext';
import { useDrivers } from '@/context/DriverContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import StatisticCard from '@/components/StatisticCard';
import { Button } from '@/components/ui/button';
import { 
  License, Upload, UserCheck, AlertTriangle, 
  Users, PlusCircle, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { licenses, getPendingLicenses } = useLicense();
  const { drivers } = useDrivers();

  const pendingLicenses = getPendingLicenses();
  const expiringSoonCount = licenses.filter(
    license => new Date(license.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'manager' 
              ? 'Manage driver licenses and approvals' 
              : user?.role === 'admin' 
                ? 'Manage driver information and system data'
                : 'View and manage your driver license information'}
          </p>
        </div>
        
        {user?.role === 'manager' && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatisticCard
                title="Total Licenses"
                value={licenses.length}
                description="All registered licenses"
                icon={<License className="h-4 w-4" />}
              />
              
              <StatisticCard
                title="Pending Approvals"
                value={pendingLicenses.length}
                description="Licenses awaiting review"
                icon={<UserCheck className="h-4 w-4" />}
              />
              
              <StatisticCard
                title="Expiring Soon"
                value={expiringSoonCount}
                description="Expires in next 30 days"
                icon={<AlertTriangle className="h-4 w-4" />}
              />
              
              <StatisticCard
                title="Total Drivers"
                value={drivers.length}
                description="Active drivers in system"
                icon={<Users className="h-4 w-4" />}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-medium">License Approvals</h3>
                    <p className="text-sm text-muted-foreground">
                      {pendingLicenses.length === 0 
                        ? "No pending license approvals" 
                        : `${pendingLicenses.length} licenses awaiting your approval`}
                    </p>
                    
                    <Button 
                      variant="default" 
                      className="mt-2" 
                      asChild
                    >
                      <Link to="/manager-approval">
                        Review Licenses
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Add more cards for managers */}
            </div>
          </>
        )}
        
        {user?.role === 'admin' && (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatisticCard
                title="Total Drivers"
                value={drivers.length}
                description="All registered drivers"
                icon={<Users className="h-4 w-4" />}
              />
              
              <StatisticCard
                title="Active Drivers"
                value={drivers.filter(d => d.status === 'active').length}
                description="Currently active drivers"
                icon={<UserCheck className="h-4 w-4" />}
              />
              
              <StatisticCard
                title="Suspended"
                value={drivers.filter(d => d.status === 'suspended').length}
                description="Temporarily suspended"
                icon={<AlertTriangle className="h-4 w-4" />}
              />
              
              <StatisticCard
                title="Inactive"
                value={drivers.filter(d => d.status === 'inactive').length}
                description="No longer active"
                icon={<Users className="h-4 w-4" />}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-medium">Driver Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage driver information and records
                    </p>
                    
                    <Button 
                      variant="default" 
                      className="mt-2" 
                      asChild
                    >
                      <Link to="/admin/drivers">
                        View All Drivers
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-medium">Add New Driver</h3>
                    <p className="text-sm text-muted-foreground">
                      Register a new driver in the system
                    </p>
                    
                    <Button 
                      variant="default" 
                      className="mt-2" 
                      asChild
                    >
                      <Link to="/admin/drivers/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Driver
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Add more admin cards */}
            </div>
          </>
        )}
        
        {user?.role === 'driver' && (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg font-medium">Your License</h3>
                  <p className="text-sm text-muted-foreground">
                    View or update your license information
                  </p>
                  
                  <Button 
                    variant="default" 
                    className="mt-2" 
                    asChild
                  >
                    <Link to="/license-upload">
                      <License className="mr-2 h-4 w-4" />
                      Manage License
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg font-medium">Upload New License</h3>
                  <p className="text-sm text-muted-foreground">
                    Submit a new or renewed license for approval
                  </p>
                  
                  <Button 
                    variant="default" 
                    className="mt-2" 
                    asChild
                  >
                    <Link to="/license-upload">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload License
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Notifications section could go here */}
      </main>
    </div>
  );
};

export default Dashboard;
