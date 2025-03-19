
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLicense } from '@/context/LicenseContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const licenseSchema = z.object({
  licenseType: z.string({
    required_error: "Please select a license type",
  }),
  licenseNumber: z.string()
    .min(6, { message: "License number must be at least 6 characters" })
    .max(20, { message: "License number must not exceed 20 characters" }),
  expiryDate: z.date({
    required_error: "Please select an expiry date",
  }),
  penaltyPoints: z.coerce.number()
    .min(0, { message: "Penalty points cannot be negative" })
    .max(12, { message: "Penalty points cannot exceed 12" }),
  licenseDocument: z.instanceof(FileList).optional().refine(
    (files) => !files || files.length === 0 || Array.from(files).some(file => 
      ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)
    ), {
      message: "License document must be a PDF, JPEG, or PNG file",
    }
  ),
});

type LicenseFormValues = z.infer<typeof licenseSchema>;

const LicenseForm: React.FC = () => {
  const { addLicense } = useLicense();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<LicenseFormValues>({
    resolver: zodResolver(licenseSchema),
    defaultValues: {
      licenseType: "",
      licenseNumber: "",
      penaltyPoints: 0,
    },
  });

  const onSubmit = async (values: LicenseFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Format the expiry date to string before sending
      const formattedValues = {
        licenseType: values.licenseType,
        licenseNumber: values.licenseNumber,
        expiryDate: format(values.expiryDate, 'yyyy-MM-dd'),
        penaltyPoints: values.penaltyPoints,
      };

      // Handle file upload if present
      if (values.licenseDocument && values.licenseDocument.length > 0) {
        const file = values.licenseDocument[0];
        
        // Here we would typically upload the file to a storage service
        // For now, we'll mock this by adding the file name to our submission
        console.log('License document to upload:', file.name);
        
        // In a real app, we would:
        // 1. Upload the file to storage (S3, Firebase, etc.)
        // 2. Get back a URL
        // 3. Add that URL to our license data
      }

      console.log('Submitting license:', formattedValues);
      addLicense(formattedValues);
      
      toast({
        title: "License Submitted",
        description: "Your license has been submitted for approval.",
      });
      
      form.reset();
    } catch (error) {
      console.error('Error submitting license:', error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was a problem submitting your license. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-xl glass shadow-soft animate-in-up">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="licenseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select a license type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Car">Car (Class B)</SelectItem>
                      <SelectItem value="Truck">Truck (Class C)</SelectItem>
                      <SelectItem value="Bus">Bus (Class D)</SelectItem>
                      <SelectItem value="Motorcycle">Motorcycle (Class A)</SelectItem>
                      <SelectItem value="Commercial">Commercial (Class CE)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of driver license you currently hold.
                  </FormDescription>
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
                    <Input 
                      placeholder="e.g. D123456789" 
                      {...field}
                      className="bg-background/50"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your driver license number exactly as shown on your license.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiry Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-background/50",
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
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The expiration date of your driver license.
                  </FormDescription>
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
                      {...field}
                      className="bg-background/50"
                      min={0}
                      max={12}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your current penalty points (0-12).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="licenseDocument"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Upload License Document</FormLabel>
                  <FormControl>
                    <div className="grid w-full items-center gap-1.5">
                      <Input
                        id="license-document"
                        type="file"
                        className="cursor-pointer bg-background/50"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => onChange(e.target.files)}
                        {...fieldProps}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload a scanned copy or photo of your driver license (PDF, JPG, or PNG)
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full transition-all duration-300 hover:shadow-soft"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit License Details'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LicenseForm;
