import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO, isValid } from 'date-fns';
import Navbar from '@/components/Navbar';
import { useDrivers, Driver } from '@/context/DriverContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, FormControl, FormField, FormItem, 
  FormLabel, FormMessage, FormDescription 
} from '@/components/ui/form';
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  ArrowLeft, Save, Image, CalendarIcon, UserPlus, License, FileText 
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, PopoverContent, PopoverTrigger 
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Form schema
const driverFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(7, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  licenseNumber: z.string().min(3, { message: "License number is required" }),
  licenseType: z.string({ required_error: "License type is required" }),
  licenseExpiryDate: z.date({ required_error: "Expiry date is required" }),
  penaltyPoints: z.coerce.number().min(0).max(12),
  employeeId: z.string().min(2, { message: "Employee ID is required" }),
  department: z.string({ required_error: "Department is required" }),
  imageUrl: z.string().optional(),
  licenseImageUrl: z.string().optional(),
  status: z.enum(["active", "suspended", "inactive"]),
  notes: z.string().optional(),
});

type DriverFormValues = z.infer<typeof driverFormSchema>;

const DEFAULT_LICENSE_IMAGE = "https://res.cloudinary.com/dfjv35kht/image/upload/v1742397639/Driver_licence_number_ezde8n.png";

const DriverForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addDriver, updateDriver, getDriverById } = useDrivers();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [licenseImagePreview, setLicenseImagePreview] = useState<string | null>(DEFAULT_LICENSE_IMAGE);
  
  const isEditMode = !!id;
  const existingDriver = isEditMode ? getDriverById(id) : undefined;
  
  // Initialize form
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      licenseNumber: "",
      licenseType: "",
      licenseExpiryDate: new Date(),
      penaltyPoints: 0,
      employeeId: "",
      department: "",
      imageUrl: "",
      licenseImageUrl: DEFAULT_LICENSE_IMAGE,
      status: "active",
      notes: "",
    },
  });
  
  // Set form values if in edit mode
  useEffect(() => {
    if (isEditMode && existingDriver) {
      const expiryDate = parseISO(existingDriver.licenseExpiryDate);
      
      form.reset({
        ...existingDriver,
        licenseExpiryDate: isValid(expiryDate) ? expiryDate : new Date(),
      });
      
      if (existingDriver.imageUrl) {
        setImagePreview(existingDriver.imageUrl);
      }
      
      if (existingDriver.licenseImageUrl) {
        setLicenseImagePreview(existingDriver.licenseImageUrl);
      }
    }
  }, [existingDriver, form, isEditMode]);
  
  // Submit handler
  const onSubmit = (data: DriverFormValues) => {
    try {
      // Convert the date to string format before saving
      const formattedData = {
        ...data,
        licenseExpiryDate: format(data.licenseExpiryDate, 'yyyy-MM-dd')
      };
      
      if (isEditMode && existingDriver) {
        updateDriver(existingDriver.id, formattedData);
        toast.success("Driver updated successfully");
      } else {
        addDriver(formattedData as Omit<Driver, 'id' | 'createdAt'>);
        toast.success("Driver added successfully");
      }
      navigate('/admin/drivers');
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };
  
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue('imageUrl', url);
    setImagePreview(url);
  };
  
  const handleLicenseImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value || DEFAULT_LICENSE_IMAGE;
    form.setValue('licenseImageUrl', url);
    setLicenseImagePreview(url);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
        <div className="flex flex-col space-y-8 animate-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/drivers')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">
                {isEditMode ? 'Edit Driver' : 'Add New Driver'}
              </h1>
            </div>
            
            <Button 
              type="submit"
              form="driver-form"
              className="gap-2"
            >
              {isEditMode ? (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Add Driver
                </>
              )}
            </Button>
          </div>
          
          <Form {...form}>
            <form 
              id="driver-form" 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-8 bg-card rounded-lg border p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter driver's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Full address" 
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Image URL</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input 
                              placeholder="Profile image URL" 
                              value={field.value || ''}
                              onChange={handleImageUrlChange}
                            />
                            {imagePreview && (
                              <div className="rounded-md overflow-hidden w-24 h-24 border">
                                <img 
                                  src={imagePreview} 
                                  alt="Profile preview" 
                                  className="w-full h-full object-cover"
                                  onError={() => setImagePreview(null)}
                                />
                              </div>
                            )}
                            {!imagePreview && (
                              <div className="rounded-md w-24 h-24 border flex items-center justify-center bg-secondary/40">
                                <Image className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Enter a URL for the driver's profile image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="licenseImageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Image URL</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Input 
                              placeholder="License image URL" 
                              value={field.value || DEFAULT_LICENSE_IMAGE}
                              onChange={handleLicenseImageUrlChange}
                            />
                            {licenseImagePreview && (
                              <div className="rounded-md overflow-hidden w-full max-w-xs border">
                                <img 
                                  src={licenseImagePreview} 
                                  alt="License preview" 
                                  className="w-full h-auto object-contain"
                                  onError={() => setLicenseImagePreview(DEFAULT_LICENSE_IMAGE)}
                                />
                              </div>
                            )}
                            {!licenseImagePreview && (
                              <div className="rounded-md w-full max-w-xs h-40 border flex items-center justify-center bg-secondary/40">
                                <License className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Enter a URL for the driver's license image (default provided)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Work & License Details</h3>
                  
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Employee ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Waste Management">Waste Management</SelectItem>
                            <SelectItem value="Parks and Recreation">Parks and Recreation</SelectItem>
                            <SelectItem value="Road Maintenance">Road Maintenance</SelectItem>
                            <SelectItem value="Water Services">Water Services</SelectItem>
                            <SelectItem value="Public Transport">Public Transport</SelectItem>
                            <SelectItem value="Administration">Administration</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Separator className="my-4" />
                  
                  <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Number</FormLabel>
                        <FormControl>
                          <Input placeholder="License number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="licenseType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select license type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Class B">Class B (Car)</SelectItem>
                            <SelectItem value="Class C">Class C (Truck)</SelectItem>
                            <SelectItem value="Class D">Class D (Bus)</SelectItem>
                            <SelectItem value="Class EC">Class EC (Heavy Goods)</SelectItem>
                            <SelectItem value="Class W">Class W (Work Vehicle)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="licenseExpiryDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>License Expiry Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="penaltyPoints"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Penalty Points (0-12)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0} 
                            max={12} 
                            placeholder="Penalty points" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driver Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes about the driver" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Include any relevant information about the driver that might be useful.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default DriverForm;
