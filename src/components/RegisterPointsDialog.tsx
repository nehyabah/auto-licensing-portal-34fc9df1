
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle } from 'lucide-react';
import { useDrivers } from '@/context/DriverContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const pointsSchema = z.object({
  points: z.coerce
    .number()
    .min(1, "Points must be at least 1")
    .max(12, "Points cannot exceed 12"),
  reason: z.string().min(3, "Reason is required").max(500, "Reason is too long"),
});

type PointsFormValues = z.infer<typeof pointsSchema>;

export function RegisterPointsDialog() {
  const { drivers, updateDriver } = useDrivers();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  
  // Hide this component from administrators and managers
  if (user?.role === 'admin' || user?.role === 'manager') {
    return null;
  }
  
  const form = useForm<PointsFormValues>({
    resolver: zodResolver(pointsSchema),
    defaultValues: {
      points: 1,
      reason: "",
    },
  });

  function onSubmit(data: PointsFormValues) {
    if (!user) {
      toast.error("You must be logged in to report penalty points");
      return;
    }
    
    // Find driver by matching the user email with the driver email
    // Log user info for debugging
    console.log("Current user:", user);
    console.log("All drivers:", drivers);
    
    // We need to find the driver that matches the current user
    // The email could be in different formats (lowercase, uppercase), so normalize them
    const driver = drivers.find(d => 
      d.email.toLowerCase() === user.email.toLowerCase()
    );
    
    if (!driver) {
      toast.error("Driver record not found for your account");
      console.log("No driver found for email:", user.email);
      return;
    }
    
    const newPenaltyPoints = driver.penaltyPoints + data.points;
    const exceededLimit = newPenaltyPoints > 12;
    
    // Update the driver with new penalty points
    updateDriver(driver.id, {
      penaltyPoints: exceededLimit ? 12 : newPenaltyPoints,
      notes: driver.notes 
        ? `${driver.notes}\n\n${new Date().toLocaleDateString()}: ${data.points} points added - ${data.reason}`
        : `${new Date().toLocaleDateString()}: ${data.points} points added - ${data.reason}`
    });
    
    if (exceededLimit) {
      toast.warning(`You now exceed the maximum penalty points. Consider consulting your manager.`);
    } else if (newPenaltyPoints >= 7) {
      toast.warning(`You now have ${newPenaltyPoints} penalty points. This is considered high risk.`);
    } else {
      toast.success(`Added ${data.points} penalty points to your record`);
    }
    
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start"
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          Report Penalty Points
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report Penalty Points</DialogTitle>
          <DialogDescription>
            Report penalty points that you've received on your license. It's important to keep your record up to date.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Penalty Points</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={12} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Explain why you received these points" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Points</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
