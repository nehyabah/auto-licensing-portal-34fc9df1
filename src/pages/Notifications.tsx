
import React from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useLicense } from '@/context/LicenseContext';
import NotificationItem from '@/components/NotificationItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const { notifications, clearAllNotifications } = useLicense();
  
  // Get user's notifications
  const userNotifications = notifications.filter(
    n => n.userId === user?.id
  ).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  const unreadNotifications = userNotifications.filter(n => !n.read);
  const readNotifications = userNotifications.filter(n => n.read);
  
  const handleClearAll = () => {
    clearAllNotifications();
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col space-y-8 animate-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <h1 className="text-2xl font-bold tracking-tight">
              Notifications
            </h1>
            
            {userNotifications.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearAll}
              >
                Clear all notifications
              </Button>
            )}
          </div>
          
          {/* Main Content */}
          <Tabs defaultValue={unreadNotifications.length > 0 ? "unread" : "all"} className="space-y-6">
            <TabsList>
              <TabsTrigger value="all" className="relative">
                All
                {userNotifications.length > 0 && (
                  <span className="ml-1 text-xs">({userNotifications.length})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread" className="relative">
                Unread
                {unreadNotifications.length > 0 && (
                  <span className="ml-1 text-xs">({unreadNotifications.length})</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">
                Read
                {readNotifications.length > 0 && (
                  <span className="ml-1 text-xs">({readNotifications.length})</span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4 mt-6">
              {userNotifications.length > 0 ? (
                <motion.div
                  className="space-y-4"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  <AnimatePresence>
                    {userNotifications.map((notification, index) => (
                      <motion.div key={notification.id} variants={item}>
                        <NotificationItem notification={notification} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <EmptyNotifications />
              )}
            </TabsContent>
            
            <TabsContent value="unread" className="space-y-4 mt-6">
              {unreadNotifications.length > 0 ? (
                <motion.div
                  className="space-y-4"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  <AnimatePresence>
                    {unreadNotifications.map((notification, index) => (
                      <motion.div key={notification.id} variants={item}>
                        <NotificationItem notification={notification} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <EmptyNotifications message="You don't have any unread notifications." />
              )}
            </TabsContent>
            
            <TabsContent value="read" className="space-y-4 mt-6">
              {readNotifications.length > 0 ? (
                <motion.div
                  className="space-y-4"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  <AnimatePresence>
                    {readNotifications.map((notification, index) => (
                      <motion.div key={notification.id} variants={item}>
                        <NotificationItem notification={notification} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <EmptyNotifications message="You don't have any read notifications." />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

const EmptyNotifications: React.FC<{ message?: string }> = ({ 
  message = "You don't have any notifications at this time." 
}) => {
  return (
    <Card className="glass">
      <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Bell className="h-6 w-6 text-primary" />
        </div>
        <p className="text-muted-foreground text-center">
          {message}
        </p>
      </CardContent>
    </Card>
  );
};

export default Notifications;
