
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { License, useLicense } from '@/context/LicenseContext';
import { CalendarClock, AlertCircle, Award, Clock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface LicenseCardProps {
  license: License;
  showActions?: boolean;
}

const LicenseCard: React.FC<LicenseCardProps> = ({ 
  license,
  showActions = false
}) => {
  const { updateLicenseStatus } = useLicense();
  const { user } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  
  const isManager = user?.role === 'manager' || user?.role === 'admin';
  const isPending = license.status === 'pending';
  const isNearExpiry = differenceInDays(parseISO(license.expiryDate), new Date()) <= 90;
  const isHighPenalty = license.penaltyPoints >= 7;
  
  // Sample license image for the preview
  const licenseImageUrl = "https://res.cloudinary.com/dfjv35kht/image/upload/v1742397639/Driver_licence_number_ezde8n.png";
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const handleApprove = () => {
    updateLicenseStatus(license.id, 'approved');
    setShowPreview(false);
  };

  const handleReject = () => {
    updateLicenseStatus(license.id, 'rejected');
    setShowPreview(false);
  };

  const openPreview = () => {
    setShowPreview(true);
  };

  return (
    <>
      <Card className={cn(
        "w-full overflow-hidden transition-all duration-300 hover-lift",
        isHighPenalty && "border-destructive/40",
        isNearExpiry && !isHighPenalty && "border-amber-500/40"
      )}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-medium">
              {license.licenseType} License
            </CardTitle>
            <Badge className={cn("font-normal capitalize", getStatusColor(license.status))}>
              {license.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pb-4">
          <div className="space-y-3">
            <div className="flex items-center gap-x-2 text-sm">
              <span className="text-muted-foreground">License #:</span>
              <span className="font-medium">{license.licenseNumber}</span>
            </div>
            
            <div className="flex items-center gap-x-2 text-sm">
              <span className="text-muted-foreground">Driver:</span>
              <span className="font-medium">{license.driverName}</span>
            </div>
            
            <div className="flex items-center gap-x-2 text-sm">
              <span className="text-muted-foreground">Created:</span>
              <span>{format(parseISO(license.createdAt), 'PPP')}</span>
            </div>
            
            <div className="space-y-1 mt-3">
              <div className="flex justify-between">
                <div className="flex items-center gap-x-1.5 text-sm">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Expires:</span>
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  isNearExpiry && "text-amber-600 dark:text-amber-400"
                )}>
                  {format(parseISO(license.expiryDate), 'PPP')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <div className="flex items-center gap-x-1.5 text-sm">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Penalty Points:</span>
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  isHighPenalty && "text-destructive"
                )}>
                  {license.penaltyPoints} / 12
                </span>
              </div>
            </div>
            
            {(isNearExpiry || isHighPenalty) && (
              <div className="mt-3 flex items-start gap-2 p-2 rounded-md bg-secondary/80">
                {isHighPenalty ? (
                  <>
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs">
                      This driver has {license.penaltyPoints} penalty points, which is approaching the limit. Additional monitoring may be required.
                    </p>
                  </>
                ) : isNearExpiry ? (
                  <>
                    <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs">
                      This license will expire in {differenceInDays(parseISO(license.expiryDate), new Date())} days. Please ensure timely renewal.
                    </p>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </CardContent>
        
        {showActions && isManager && isPending && (
          <CardFooter className="pt-0 gap-3">
            <Button 
              onClick={openPreview} 
              variant="outline" 
              className="w-full flex items-center gap-1"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* License Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>License Preview</DialogTitle>
            <DialogDescription>
              Reviewing {license.driverName}'s {license.licenseType} License ({license.licenseNumber})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden border">
              <img 
                src={licenseImageUrl} 
                alt="License" 
                className="w-full h-auto object-contain"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Driver Information</h3>
                <div className="bg-secondary/50 p-3 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Name:</span>
                    <span className="text-sm font-medium">{license.driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">License #:</span>
                    <span className="text-sm font-medium">{license.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">License Type:</span>
                    <span className="text-sm font-medium">{license.licenseType}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-sm">License Details</h3>
                <div className="bg-secondary/50 p-3 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Expiry Date:</span>
                    <span className="text-sm font-medium">{format(parseISO(license.expiryDate), 'PPP')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Penalty Points:</span>
                    <span className={cn(
                      "text-sm font-medium",
                      isHighPenalty && "text-destructive"
                    )}>
                      {license.penaltyPoints} / 12
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Submission Date:</span>
                    <span className="text-sm font-medium">{format(parseISO(license.createdAt), 'PPP')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="space-x-2">
            <Button 
              onClick={handleReject} 
              variant="outline" 
              className="text-destructive border-destructive/20 hover:bg-destructive/10"
            >
              Reject License
            </Button>
            <Button 
              onClick={handleApprove}
            >
              Approve License
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LicenseCard;
