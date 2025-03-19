
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Notification, useLicense } from '@/context/LicenseContext';
import { format, parseISO } from 'date-fns';
import { AlertTriangle, CheckCircle, Info, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { markNotificationAsRead } = useLicense();

  const getIconByType = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getColor = () => {
    switch (notification.type) {
      case 'success':
        return 'border-green-200 dark:border-green-900';
      case 'warning':
        return 'border-amber-200 dark:border-amber-900';
      case 'error':
        return 'border-red-200 dark:border-red-900';
      case 'info':
      default:
        return 'border-blue-200 dark:border-blue-900';
    }
  };

  const handleMarkAsRead = () => {
    markNotificationAsRead(notification.id);
  };

  return (
    <Card 
      className={cn(
        "w-full transition-all duration-300 relative overflow-hidden animate-in-up",
        getColor(),
        !notification.read && "bg-secondary/40"
      )}
    >
      <CardContent className="p-4">
        <div className="flex">
          <div className="mr-3 mt-0.5">
            {getIconByType()}
          </div>
          <div className="flex-1">
            <div className="flex flex-col">
              <p className="text-sm">{notification.message}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  {format(parseISO(notification.createdAt), 'PPP')}
                </div>
                
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleMarkAsRead}
                    className="text-xs h-7 px-2"
                  >
                    Mark as read
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationItem;
