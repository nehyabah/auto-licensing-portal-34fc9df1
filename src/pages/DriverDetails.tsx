
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useDrivers } from '@/context/DriverContext';
import { useLicense } from '@/context/LicenseContext';
import { Button } from '@/components/ui/button';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, 
  Calendar, AlertCircle, Clock, Award, FileText, 
  Building, BadgeCheck, Clipboard, Image
} from 'lucide-react';
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import LicenseCard from '@/components/LicenseCard';

const DriverDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { drivers, deleteDriver } = useDrivers();
  const { licenses } = useLicense();
  
  // Find the driver by ID
  const driver = drivers.find(d => d.id === id);
  
  // Get driver's licenses
  const driverLicenses = licenses.filter(license => 
    license.driverName === driver?.name
  );
  
  // Handle if driver not found
  if (!driver) {
    return (
      <div className="min-h-screen flex flex-col bg-secondary/30">
        <Navbar />
        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          <div className="flex flex-col space-y-8 animate-in-up">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/drivers')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">
                Driver Not Found
              </h1>
            </div>
            
            <Card className="glass">
              <CardContent className="p-6 flex flex-col items-center justify-center space-y-4 py-10">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-primary" />
                </div>
                <p className="text-muted-foreground text-center">
                  The driver you are looking for could not be found.
                </p>
                <Button 
                  onClick={() => navigate('/admin/drivers')}
                  className="mt-2"
                >
                  Return to Driver List
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'suspended':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  const handleDeleteDriver = () => {
    deleteDriver(driver.id);
    navigate('/admin/drivers');
  };
  
  const isNearExpiry = differenceInDays(parseISO(driver.licenseExpiryDate), new Date()) <= 90;
  const isHighPenalty = driver.penaltyPoints >= 7;
  
  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col space-y-8 animate-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/drivers')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">
                Driver Details
              </h1>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/drivers/edit/${driver.id}`)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive/20 hover:bg-destructive/10 gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete driver record?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {driver.name}'s record. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleDeleteDriver}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Driver Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold">Profile</CardTitle>
                <Badge className={getStatusColor(driver.status)}>
                  {driver.status}
                </Badge>
              </CardHeader>
              <CardContent className="pt-4 pb-0">
                <div className="flex flex-col items-center text-center mb-6">
                  {driver.imageUrl ? (
                    <Avatar className="h-24 w-24 mb-3">
                      <AvatarImage src={driver.imageUrl} alt={driver.name} />
                      <AvatarFallback className="text-lg">{getInitials(driver.name)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-24 w-24 bg-secondary/50 rounded-full flex items-center justify-center mb-3">
                      <Image className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  <h2 className="text-xl font-semibold">{driver.name}</h2>
                  <p className="text-muted-foreground">{driver.department}</p>
                </div>
                
                <Separator className="my-4" />
                
                <dl className="space-y-4">
                  <div className="flex items-start gap-3">
                    <dt className="flex gap-2 items-center min-w-[36px]">
                      <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                    </dt>
                    <dd className="text-sm">
                      <span className="block text-muted-foreground">Employee ID</span>
                      <span className="font-medium">{driver.employeeId}</span>
                    </dd>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <dt className="flex gap-2 items-center min-w-[36px]">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </dt>
                    <dd className="text-sm">
                      <span className="block text-muted-foreground">Email</span>
                      <span className="font-medium">{driver.email}</span>
                    </dd>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <dt className="flex gap-2 items-center min-w-[36px]">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </dt>
                    <dd className="text-sm">
                      <span className="block text-muted-foreground">Phone</span>
                      <span className="font-medium">{driver.phone}</span>
                    </dd>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <dt className="flex gap-2 items-center min-w-[36px]">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </dt>
                    <dd className="text-sm">
                      <span className="block text-muted-foreground">Address</span>
                      <span className="font-medium">{driver.address}</span>
                    </dd>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <dt className="flex gap-2 items-center min-w-[36px]">
                      <Building className="h-4 w-4 text-muted-foreground" />
                    </dt>
                    <dd className="text-sm">
                      <span className="block text-muted-foreground">Department</span>
                      <span className="font-medium">{driver.department}</span>
                    </dd>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <dt className="flex gap-2 items-center min-w-[36px]">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </dt>
                    <dd className="text-sm">
                      <span className="block text-muted-foreground">Added on</span>
                      <span className="font-medium">
                        {format(parseISO(driver.createdAt), 'PPP')}
                      </span>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            {/* License & Additional Info */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold">License Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <span className="font-semibold">License Type</span>
                      </div>
                      <span>{driver.licenseType}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="font-semibold">License Number</span>
                      </div>
                      <span>{driver.licenseNumber}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className={cn(
                          "h-5 w-5",
                          isNearExpiry ? "text-amber-500" : "text-primary"
                        )} />
                        <span className="font-semibold">Expiry Date</span>
                      </div>
                      <span className={cn(
                        isNearExpiry && "text-amber-600 dark:text-amber-400"
                      )}>
                        {format(parseISO(driver.licenseExpiryDate), 'PPP')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className={cn(
                          "h-5 w-5",
                          isHighPenalty ? "text-destructive" : "text-primary"
                        )} />
                        <span className="font-semibold">Penalty Points</span>
                      </div>
                      <span className={cn(
                        isHighPenalty && "text-destructive"
                      )}>
                        {driver.penaltyPoints} / 12
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {(isNearExpiry || isHighPenalty) && (
                      <div className="p-4 rounded-md bg-secondary/80 flex items-start gap-2">
                        {isHighPenalty ? (
                          <>
                            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                            <p className="text-sm">
                              This driver has {driver.penaltyPoints} penalty points, which is approaching the limit. Additional monitoring may be required.
                            </p>
                          </>
                        ) : isNearExpiry ? (
                          <>
                            <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-sm">
                              This license will expire in {differenceInDays(parseISO(driver.licenseExpiryDate), new Date())} days. Please ensure timely renewal.
                            </p>
                          </>
                        ) : null}
                      </div>
                    )}
                    
                    {driver.notes && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clipboard className="h-5 w-5 text-primary" />
                          <span className="font-semibold">Notes</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 p-3 bg-secondary/50 rounded-md">
                          {driver.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">License History</h3>
                  
                  <Tabs defaultValue="active" className="w-full">
                    <TabsList>
                      <TabsTrigger value="active">Active License</TabsTrigger>
                      <TabsTrigger value="history">License History</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="active" className="mt-4">
                      {driverLicenses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {driverLicenses
                            .filter(license => license.status === 'approved')
                            .slice(0, 1)
                            .map(license => (
                              <LicenseCard 
                                key={license.id} 
                                license={license} 
                                showActions={false} 
                              />
                            ))}
                        </div>
                      ) : (
                        <Card className="bg-secondary/50">
                          <CardContent className="py-4 flex flex-col items-center justify-center text-center">
                            <p className="text-muted-foreground">
                              No active license found. The driver may need to upload a license document.
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="history" className="mt-4">
                      {driverLicenses.length > 1 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {driverLicenses
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(1)
                            .map(license => (
                              <LicenseCard 
                                key={license.id} 
                                license={license} 
                                showActions={false} 
                              />
                            ))}
                        </div>
                      ) : (
                        <Card className="bg-secondary/50">
                          <CardContent className="py-4 flex flex-col items-center justify-center text-center">
                            <p className="text-muted-foreground">
                              No license history available for this driver.
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverDetails;
