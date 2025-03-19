
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPen } from 'lucide-react';
import { useDrivers } from '@/context/DriverContext';
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
  driverId: z.string().min(1, "Driver is required"),
  points: z.coerce
    .number()
    .min(1, "Points must be at least 1")
    .max(12, "Points cannot exceed 12"),
  reason: z.string().min(3, "Reason is required").max(500, "Reason is too long"),
});

type PointsFormValues = z.infer<typeof pointsSchema>;

export function RegisterPointsDialog() {
  const { drivers, updateDriver } = useDrivers();
  const [open, setOpen] = useState(false);
  
  const form = useForm<PointsFormValues>({
    resolver: zodResolver(pointsSchema),
    defaultValues: {
      driverId: "",
      points: 1,
      reason: "",
    },
  });

  function onSubmit(data: PointsFormValues) {
    const driver = drivers.find(d => d.id === data.driverId);
    
    if (!driver) {
      toast.error("Driver not found");
      return;
    }
    
    const newPenaltyPoints = driver.penaltyPoints + data.points;
    const exceededLimit = newPenaltyPoints > 12;
    
    // Update the driver with new penalty points
    updateDriver(data.driverId, {
      penaltyPoints: exceededLimit ? 12 : newPenaltyPoints,
      notes: driver.notes 
        ? `${driver.notes}\n\n${new Date().toLocaleDateString()}: ${data.points} points added - ${data.reason}`
        : `${new Date().toLocaleDateString()}: ${data.points} points added - ${data.reason}`
    });
    
    if (exceededLimit) {
      toast.warning(`${driver.name} now exceeds the maximum penalty points. Consider suspending their license.`);
    } else if (newPenaltyPoints >= 7) {
      toast.warning(`${driver.name} now has ${newPenaltyPoints} penalty points. This is considered high risk.`);
    } else {
      toast.success(`Added ${data.points} penalty points to ${driver.name}`);
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
          <UserPen className="mr-2 h-4 w-4" />
          Register Penalty Points
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register Penalty Points</DialogTitle>
          <DialogDescription>
            Add penalty points to a driver's record. Points accumulate and may lead to license suspension.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="driverId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      {...field}
                    >
                      <option value="" disabled>Select a driver</option>
                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} - Current points: {driver.penaltyPoints}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Textarea {...field} placeholder="Explain why points are being added" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Register Points</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
