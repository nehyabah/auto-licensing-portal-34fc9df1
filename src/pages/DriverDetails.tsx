
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
  Building, BadgeCheck, Clipboard, Image, ChevronLeft,
  Building2, UsersRound, SquareUserRound, ShieldAlert,
  Globe, ChevronRight
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">
                Driver Not Found
              </h1>
            </div>
            
            <Card className="glass border-none shadow-lg bg-gradient-to-br from-background to-secondary/30">
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

  // Sample license image for the preview
  const licenseImageUrl = "https://res.cloudinary.com/dfjv35kht/image/upload/v1742397639/Driver_licence_number_ezde8n.png";
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/20">
      <Navbar />
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/drivers')}
                className="rounded-full hover:bg-primary/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">
                Driver Profile
              </h1>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/drivers/edit/${driver.id}`)}
                className="rounded-full gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-full text-destructive border-destructive/20 hover:bg-destructive/10 gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-none bg-gradient-to-br from-background to-secondary/30 shadow-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete driver record?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete {driver.name}'s record. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
            <Card className="lg:col-span-1 overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-secondary/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-secondary/40">
                <CardTitle className="text-xl font-semibold">Profile</CardTitle>
                <Badge className={cn("rounded-full px-3", getStatusColor(driver.status))}>
                  {driver.status}
                </Badge>
              </CardHeader>
              <CardContent className="pt-6 pb-0">
                <div className="flex flex-col items-center text-center mb-6">
                  {driver.imageUrl ? (
                    <div className="relative">
                      <Avatar className="h-28 w-28 mb-3 ring-4 ring-primary/10 ring-offset-2 ring-offset-background">
                        <AvatarImage src={driver.imageUrl} alt={driver.name} />
                        <AvatarFallback className="text-lg bg-primary/20">{getInitials(driver.name)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 right-0 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md">
                        <BadgeCheck className="h-4 w-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 w-28 bg-secondary/50 rounded-full flex items-center justify-center mb-3 ring-4 ring-primary/10 ring-offset-2 ring-offset-background">
                      <SquareUserRound className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <h2 className="text-2xl font-semibold mt-3">{driver.name}</h2>
                  <p className="text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Building2 className="h-3.5 w-3.5" /> {driver.department}
                  </p>
                </div>
                
                <Separator className="my-5" />
                
                <dl className="space-y-4.5">
                  <div className="flex items-center justify-between px-1">
                    <dt className="flex gap-2 items-center">
                      <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                        <BadgeCheck className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">Employee ID</span>
                    </dt>
                    <dd className="text-sm font-medium">{driver.employeeId}</dd>
                  </div>
                  
                  <div className="flex items-center justify-between px-1">
                    <dt className="flex gap-2 items-center">
                      <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">Email</span>
                    </dt>
                    <dd className="text-sm font-medium truncate max-w-[12rem]">{driver.email}</dd>
                  </div>
                  
                  <div className="flex items-center justify-between px-1">
                    <dt className="flex gap-2 items-center">
                      <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">Phone</span>
                    </dt>
                    <dd className="text-sm font-medium">{driver.phone}</dd>
                  </div>
                  
                  <div className="flex items-center justify-between px-1">
                    <dt className="flex gap-2 items-center">
                      <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">Address</span>
                    </dt>
                    <dd className="text-sm font-medium truncate max-w-[12rem]">{driver.address}</dd>
                  </div>
                  
                  <div className="flex items-center justify-between px-1">
                    <dt className="flex gap-2 items-center">
                      <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                        <Building className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">Department</span>
                    </dt>
                    <dd className="text-sm font-medium">{driver.department}</dd>
                  </div>
                  
                  <div className="flex items-center justify-between px-1">
                    <dt className="flex gap-2 items-center">
                      <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">Member Since</span>
                    </dt>
                    <dd className="text-sm font-medium">
                      {format(parseISO(driver.createdAt), 'dd MMM yyyy')}
                    </dd>
                  </div>
                </dl>
              </CardContent>
              <CardFooter className="px-6 pt-5 pb-6 flex justify-center mt-6 bg-secondary/20">
                <Button variant="secondary" className="w-full rounded-full bg-white/80 hover:bg-white">
                  <UsersRound className="h-4 w-4 mr-2" />
                  View Team
                </Button>
              </CardFooter>
            </Card>
            
            {/* License & Additional Info */}
            <Card className="lg:col-span-2 overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-secondary/30">
              <CardHeader className="pb-2 border-b border-secondary/40">
                <CardTitle className="text-xl font-semibold">License Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="relative rounded-lg overflow-hidden shadow-lg border border-secondary/50 aspect-[1.58/1]">
                      <img 
                        src={licenseImageUrl} 
                        alt="Driver License" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                        <p className="text-sm font-medium">{driver.licenseType} License</p>
                        <p className="text-xs">#{driver.licenseNumber}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white/70 dark:bg-secondary/40 rounded-lg p-4 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-secondary/60 h-8 w-8 rounded-full flex items-center justify-center">
                            <Award className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">License Type</span>
                        </div>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                          {driver.licenseType}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-secondary/60 h-8 w-8 rounded-full flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">License Number</span>
                        </div>
                        <span className="text-sm font-medium">{driver.licenseNumber}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center",
                            isNearExpiry ? "bg-amber-100 dark:bg-amber-900/30" : "bg-secondary/60"
                          )}>
                            <Clock className={cn(
                              "h-4 w-4",
                              isNearExpiry ? "text-amber-600 dark:text-amber-400" : "text-primary"
                            )} />
                          </div>
                          <span className="font-medium">Expiry Date</span>
                        </div>
                        <span className={cn(
                          "text-sm font-medium",
                          isNearExpiry && "text-amber-600 dark:text-amber-400"
                        )}>
                          {format(parseISO(driver.licenseExpiryDate), 'dd MMM yyyy')}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center",
                            isHighPenalty ? "bg-red-100 dark:bg-red-900/30" : "bg-secondary/60"
                          )}>
                            <AlertCircle className={cn(
                              "h-4 w-4",
                              isHighPenalty ? "text-destructive" : "text-primary"
                            )} />
                          </div>
                          <span className="font-medium">Penalty Points</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-24 h-2 bg-secondary/60 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                driver.penaltyPoints <= 4 ? "bg-green-500" :
                                driver.penaltyPoints <= 8 ? "bg-amber-500" : "bg-red-500"
                              )}
                              style={{ width: `${(driver.penaltyPoints / 12) * 100}%` }}
                            ></div>
                          </div>
                          <span className={cn(
                            "text-sm font-medium",
                            isHighPenalty && "text-destructive"
                          )}>
                            {driver.penaltyPoints}/12
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {(isNearExpiry || isHighPenalty) && (
                      <div className={cn(
                        "rounded-lg p-4 shadow-md flex items-start gap-3",
                        isHighPenalty 
                          ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30" 
                          : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30"
                      )}>
                        {isHighPenalty ? (
                          <>
                            <div className="bg-red-100 dark:bg-red-900/30 h-9 w-9 rounded-full flex items-center justify-center shrink-0">
                              <ShieldAlert className="h-5 w-5 text-destructive" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-semibold text-destructive">High Penalty Points</h4>
                              <p className="text-sm">
                                This driver has {driver.penaltyPoints} penalty points, which is approaching the limit. Additional monitoring may be required.
                              </p>
                            </div>
                          </>
                        ) : isNearExpiry ? (
                          <>
                            <div className="bg-amber-100 dark:bg-amber-900/30 h-9 w-9 rounded-full flex items-center justify-center shrink-0">
                              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-semibold text-amber-600 dark:text-amber-400">License Expiring Soon</h4>
                              <p className="text-sm">
                                This license will expire in {differenceInDays(parseISO(driver.licenseExpiryDate), new Date())} days. Please ensure timely renewal.
                              </p>
                            </div>
                          </>
                        ) : null}
                      </div>
                    )}
                    
                    {driver.notes && (
                      <div className="rounded-lg bg-white/70 dark:bg-secondary/40 shadow-sm p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-secondary/60 h-8 w-8 rounded-full flex items-center justify-center">
                            <Clipboard className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">Notes</span>
                        </div>
                        <p className="text-sm bg-secondary/30 rounded-lg p-3">
                          {driver.notes}
                        </p>
                      </div>
                    )}
                    
                    <div className="rounded-lg bg-white/70 dark:bg-secondary/40 shadow-sm p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-secondary/60 h-8 w-8 rounded-full flex items-center justify-center">
                            <Globe className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">Activity Log</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 gap-1 hover:bg-primary/5 text-primary">
                          View All <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex gap-3 items-start">
                          <div className="bg-green-100 dark:bg-green-900/30 h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <BadgeCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">License Renewed</p>
                            <p className="text-xs text-muted-foreground">
                              {format(parseISO(driver.createdAt), 'dd MMM yyyy')} at {format(parseISO(driver.createdAt), 'HH:mm')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 items-start">
                          <div className="bg-blue-100 dark:bg-blue-900/30 h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                            <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Record Updated</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(Date.parse(driver.createdAt) + 86400000), 'dd MMM yyyy')} at {format(new Date(Date.parse(driver.createdAt) + 86400000), 'HH:mm')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-8" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">License History</h3>
                    <Button variant="outline" size="sm" className="rounded-full h-8 gap-1.5 border-primary/20 hover:border-primary/40 hover:bg-primary/5">
                      <FileText className="h-3.5 w-3.5" />
                      Download Records
                    </Button>
                  </div>
                  
                  <Tabs defaultValue="active" className="w-full">
                    <TabsList className="w-full max-w-md grid grid-cols-2 h-11 p-1 rounded-full bg-secondary/60 mb-2">
                      <TabsTrigger value="active" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-secondary">
                        Active License
                      </TabsTrigger>
                      <TabsTrigger value="history" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-secondary">
                        License History
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="active" className="mt-4 rounded-lg overflow-hidden border border-secondary/30">
                      <Table>
                        <TableHeader className="bg-secondary/30">
                          <TableRow className="hover:bg-transparent">
                            <TableHead>Type</TableHead>
                            <TableHead>License #</TableHead>
                            <TableHead>Issue Date</TableHead>
                            <TableHead>Expiry Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Points</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {driverLicenses.length > 0 ? (
                            driverLicenses
                              .filter(license => license.status === 'approved')
                              .slice(0, 1)
                              .map(license => (
                                <TableRow key={license.id}>
                                  <TableCell className="font-medium">{license.licenseType}</TableCell>
                                  <TableCell>{license.licenseNumber}</TableCell>
                                  <TableCell>{format(parseISO(license.createdAt), 'dd MMM yyyy')}</TableCell>
                                  <TableCell>{format(parseISO(license.expiryDate), 'dd MMM yyyy')}</TableCell>
                                  <TableCell>
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                      Active
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <span className={cn(
                                      "font-medium",
                                      license.penaltyPoints >= 7 && "text-destructive"
                                    )}>
                                      {license.penaltyPoints}/12
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <ChevronRight className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                No active license found. The driver may need to upload a license document.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TabsContent>
                    
                    <TabsContent value="history" className="mt-4 rounded-lg overflow-hidden border border-secondary/30">
                      <Table>
                        <TableHeader className="bg-secondary/30">
                          <TableRow className="hover:bg-transparent">
                            <TableHead>Type</TableHead>
                            <TableHead>License #</TableHead>
                            <TableHead>Issue Date</TableHead>
                            <TableHead>Expiry Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Points</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {driverLicenses.length > 1 ? (
                            driverLicenses
                              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                              .slice(1)
                              .map(license => (
                                <TableRow key={license.id}>
                                  <TableCell className="font-medium">{license.licenseType}</TableCell>
                                  <TableCell>{license.licenseNumber}</TableCell>
                                  <TableCell>{format(parseISO(license.createdAt), 'dd MMM yyyy')}</TableCell>
                                  <TableCell>{format(parseISO(license.expiryDate), 'dd MMM yyyy')}</TableCell>
                                  <TableCell>
                                    <Badge className={cn(
                                      license.status === 'approved' 
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" 
                                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                    )}>
                                      {license.status === 'approved' ? 'Expired' : 'Historical'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <span className="font-medium">
                                      {license.penaltyPoints}/12
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <ChevronRight className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                No license history available for this driver.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
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
