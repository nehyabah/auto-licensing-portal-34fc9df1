import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from "sonner";
import { ArrowLeft, UploadCloud } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Driver, useDrivers } from '@/context/DriverContext';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Invalid email address.',
  }),
  phone: z.string().min(8, {
    message: 'Phone number must be at least 8 characters.',
  }),
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  licenseNumber: z.string().min(5, {
    message: 'License number must be at least 5 characters.',
  }),
  licenseType: z.string().min(2, {
    message: 'License type must be at least 2 characters.',
  }),
  licenseExpiryDate: z.date(),
  penaltyPoints: z.number().min(0, {
    message: 'Penalty points must be at least 0.',
  }).max(12, {
    message: 'Penalty points cannot be more than 12.',
  }),
  employeeId: z.string().min(3, {
    message: 'Employee ID must be at least 3 characters.',
  }),
  department: z.string().min(3, {
    message: 'Department must be at least 3 characters.',
  }),
  imageUrl: z.string().optional(),
  status: z.enum(['active', 'suspended', 'inactive']),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const DriverForm = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { drivers, addDriver, updateDriver, getDriverById } = useDrivers();
  const driver = id ? getDriverById(id) : undefined;

  useEffect(() => {
    setIsMounted(true);
    if (driver?.imageUrl) {
      setImagePreview(driver.imageUrl);
    }
  }, [driver]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: driver?.name || '',
      email: driver?.email || '',
      phone: driver?.phone || '',
      address: driver?.address || '',
      licenseNumber: driver?.licenseNumber || '',
      licenseType: driver?.licenseType || '',
      licenseExpiryDate: driver?.licenseExpiryDate ? new Date(driver.licenseExpiryDate) : new Date(),
      penaltyPoints: driver?.penaltyPoints || 0,
      employeeId: driver?.employeeId || '',
      department: driver?.department || '',
      imageUrl: driver?.imageUrl || '',
      status: driver?.status || 'active',
      notes: driver?.notes || '',
    },
    mode: 'onChange',
  });

  const isLoading = form.formState.isSubmitting;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Read the file and convert it to a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('imageUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoBack = () => {
    navigate('/admin/drivers');
  };

  const handleSubmit = (data: FormData) => {
    try {
      // Convert Date to string format for licenseExpiryDate if it exists
      const driverData: Partial<Driver> = {
        ...data,
        licenseExpiryDate: data.licenseExpiryDate ? data.licenseExpiryDate.toISOString().split('T')[0] : undefined
      };
      
      if (id) {
        updateDriver(id, driverData);
        navigate(`/admin/drivers/${id}`);
      } else {
        // Add a new driver - need to ensure all required fields are present
        // Cast partial driver data to full driver data (minus id and createdAt)
        const newDriverData = driverData as Omit<Driver, 'id' | 'createdAt'>;
        addDriver(newDriverData);
        navigate('/admin/drivers');
      }
      toast.success(`Driver ${data.name} ${id ? 'updated' : 'added'} successfully`);
    } catch (error) {
      console.error('Error saving driver:', error);
      toast.error('Failed to save driver information');
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleGoBack} 
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{id ? 'Edit Driver' : 'Add Driver'}</h1>
      </div>

      <div className="mb-6">
        <div className="flex flex-col items-center mb-4">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-2 flex items-center justify-center border">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Driver preview" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <UploadCloud className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <Label htmlFor="image-upload" className="cursor-pointer">
            <span className="text-sm text-blue-600 hover:underline">
              {imagePreview ? 'Change image' : 'Upload image'}
            </span>
            <Input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange}
            />
          </Label>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Driver Name" {...field} />
                </FormControl>
                <FormDescription>This is the driver's full name.</FormDescription>
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
                  <Input placeholder="mail@example.com" {...field} />
                </FormControl>
                <FormDescription>This is the driver's email address.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="083-000-0000" {...field} />
                </FormControl>
                <FormDescription>This is the driver's phone number.</FormDescription>
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
                  <Input placeholder="123 Main Street, Anytown" {...field} />
                </FormControl>
                <FormDescription>This is the driver's home address.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="licenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Number</FormLabel>
                <FormControl>
                  <Input placeholder="License Number" {...field} />
                </FormControl>
                <FormDescription>This is the driver's license number.</FormDescription>
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
                <FormControl>
                  <Input placeholder="License Type" {...field} />
                </FormControl>
                <FormDescription>e.g., Class A, Class B</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="licenseExpiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Expiry Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ? field.value.toISOString().split('T')[0] : ''} onChange={(e) => field.onChange(new Date(e.target.value))} />
                </FormControl>
                <FormDescription>The date the driver's license expires.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="penaltyPoints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Penalty Points</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Current penalty points on the driver's license.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID</FormLabel>
                <FormControl>
                  <Input placeholder="Employee ID" {...field} />
                </FormControl>
                <FormDescription>The driver's employee identification number.</FormDescription>
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
                <FormControl>
                  <Input placeholder="Department" {...field} />
                </FormControl>
                <FormDescription>The department the driver belongs to.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    {...field}
                  />
                </FormControl>
                <FormDescription>URL to the driver's image.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" {...field}>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </FormControl>
                <FormDescription>The current status of the driver.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional notes about the driver"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Any additional information about the driver.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={handleGoBack}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {id ? 'Update Driver' : 'Add Driver'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DriverForm;
