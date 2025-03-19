
import { useState } from 'react';
import { z } from 'zod';
import { useLicense } from '@/context/LicenseContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

// Define the validation schema
const licenseFormSchema = z.object({
  licenseType: z.string().min(1, "License type is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  penaltyPoints: z.coerce.number()
    .min(0, "Penalty points cannot be negative")
    .max(12, "Penalty points cannot exceed 12"),
});

export type LicenseFormData = z.infer<typeof licenseFormSchema>;

export function useLicenseForm() {
  const { addLicense } = useLicense();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const submitLicense = async (data: LicenseFormData) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit a license.",
        variant: "destructive",
      });
      return false;
    }
    
    setLoading(true);
    
    try {
      // Ensure all required fields are present (handles TypeScript error)
      const licenseData = {
        licenseType: data.licenseType,
        licenseNumber: data.licenseNumber,
        expiryDate: data.expiryDate,
        penaltyPoints: data.penaltyPoints
      };
      
      // Add the license with the validated data
      addLicense(licenseData);
      
      toast({
        title: "License Submitted",
        description: "Your license has been submitted for approval.",
      });
      
      return true;
    } catch (error) {
      console.error("Error submitting license:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your license. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    submitLicense,
    loading,
    validate: (data: any) => {
      try {
        licenseFormSchema.parse(data);
        return { success: true, error: null };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const firstError = error.errors[0];
          return { 
            success: false, 
            error: firstError.message
          };
        }
        return { 
          success: false, 
          error: "Validation failed"
        };
      }
    }
  };
}
