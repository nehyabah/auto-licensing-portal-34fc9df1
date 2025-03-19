
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDrivers } from '@/context/DriverContext';
import Navbar from '@/components/Navbar';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Edit, Trash2, Mail, Phone, 
  MapPin, FileText, CalendarClock, Flag, AlertCircle,
  BadgeInfo, Building, User
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger, 
  DialogFooter, DialogClose 
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const DriverDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDriverById, deleteDriver } = useDrivers();
  
  const driver = getDriverById(id);
  
  if (!driver) {
    return (
      <div className="min-h-screen flex flex-col bg-secondary/30">
        <Navbar />
        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/drivers')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Driver Not Found</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center text-center p-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Driver Not Found</h2>
                <p className="text-muted-foreground mb-4">
                  The driver you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => navigate('/admin/drivers')}>
                  Return to Drivers List
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }
  
  const handleDelete = () => {
    deleteDriver(driver.id);
    toast.success("Driver has been deleted");
    navigate('/admin/drivers');
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
  
  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
        <div className="flex flex-col space-y-8 animate-in fade-in">
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Driver</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete {driver.name}? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      variant="destructive" 
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="default" 
                onClick={() => navigate(`/admin/drivers/edit/${driver.id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Driver Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Driver information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-background">
                    {driver.imageUrl ? (
                      <img 
                        src={driver.imageUrl} 
                        alt={driver.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                        <User className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold">{driver.name}</h2>
                  <Badge className={`mt-2 ${getStatusColor(driver.status)}`}>
                    {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                  </Badge>
                  
                  <div className="mt-4 text-left space-y-3 w-full">
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm break-all">{driver.email}</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm">{driver.phone}</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm break-all">{driver.address}</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <BadgeInfo className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Employee ID</span>
                    </div>
                    <span className="text-sm">{driver.employeeId}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Department</span>
                    </div>
                    <span className="text-sm">{driver.department}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Added On</span>
                    </div>
                    <span className="text-sm">
                      {format(parseISO(driver.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* License Details */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>License Details</CardTitle>
                <CardDescription>
                  Driver's license information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">License Number</span>
                      </div>
                      <span className="text-sm font-mono">{driver.licenseNumber}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <BadgeInfo className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">License Type</span>
                      </div>
                      <span className="text-sm">{driver.licenseType}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Expiry Date</span>
                      </div>
                      <span className="text-sm">
                        {format(parseISO(driver.licenseExpiryDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Penalty Points</span>
                      </div>
                      <span className="text-sm font-mono">{driver.penaltyPoints} / 12</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">License Image</h3>
                    <div className="rounded-md border overflow-hidden">
                      <img 
                        src={driver.licenseImageUrl || "https://res.cloudinary.com/dfjv35kht/image/upload/v1742397639/Driver_licence_number_ezde8n.png"} 
                        alt="Driver's License" 
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Notes</h3>
                  <div className="p-3 rounded-md border bg-secondary/20 min-h-24">
                    <p className="text-sm text-muted-foreground">
                      {driver.notes || "No additional notes for this driver."}
                    </p>
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

export default DriverDetails;
