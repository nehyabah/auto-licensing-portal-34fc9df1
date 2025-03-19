import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";
import { useAuth } from './AuthContext';

export interface License {
  id: string;
  driverId: string;
  driverName: string;
  licenseType: string;
  licenseNumber: string;
  expiryDate: string;
  penaltyPoints: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

interface LicenseContextType {
  licenses: License[];
  notifications: Notification[];
  addLicense: (license: Omit<License, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'driverId' | 'driverName'>) => void;
  updateLicenseStatus: (licenseId: string, status: 'approved' | 'rejected') => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  getPendingLicenses: () => License[];
  getDriverLicenses: (driverId: string) => License[];
  getLicensesNearExpiry: () => License[];
  getHighPenaltyDrivers: () => License[];
}

const LicenseContext = createContext<LicenseContextType | undefined>(undefined);

// Sample data with more pending licenses
const initialLicenses: License[] = [
  {
    id: "1",
    driverId: "1",
    driverName: "John Driver",
    licenseType: "Car",
    licenseNumber: "D12345678",
    expiryDate: "2024-12-25",
    penaltyPoints: 3,
    status: "approved",
    createdAt: "2023-06-15T10:30:00Z",
    updatedAt: "2023-06-15T14:45:00Z",
  },
  {
    id: "2",
    driverId: "4",
    driverName: "Mike Smith",
    licenseType: "Truck",
    licenseNumber: "T98765432",
    expiryDate: "2024-08-10",
    penaltyPoints: 8,
    status: "approved",
    createdAt: "2023-05-20T09:15:00Z",
    updatedAt: "2023-05-21T11:30:00Z",
  },
  {
    id: "3",
    driverId: "5",
    driverName: "Lisa Jones",
    licenseType: "Bus",
    licenseNumber: "B55443322",
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days from now
    penaltyPoints: 2,
    status: "pending",
    createdAt: "2023-06-28T16:20:00Z",
    updatedAt: "2023-06-28T16:20:00Z",
  },
  {
    id: "4",
    driverId: "6",
    driverName: "Sarah Connor",
    licenseType: "Motorcycle",
    licenseNumber: "M12345678",
    expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 120 days from now
    penaltyPoints: 0,
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    driverId: "7",
    driverName: "Robert Chen",
    licenseType: "Commercial",
    licenseNumber: "C87654321",
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 180 days from now
    penaltyPoints: 1,
    status: "pending",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    driverId: "8",
    driverName: "Emily Rivera",
    licenseType: "HGV",
    licenseNumber: "H55566677",
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
    penaltyPoints: 3,
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    driverId: "9",
    driverName: "David Kim",
    licenseType: "PSV",
    licenseNumber: "P33344455",
    expiryDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 150 days from now
    penaltyPoints: 0,
    status: "pending",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "8",
    driverId: "10",
    driverName: "Karen Williams",
    licenseType: "HGV",
    licenseNumber: "H98765432",
    expiryDate: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    penaltyPoints: 2,
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "9",
    driverId: "11",
    driverName: "James Wilson",
    licenseType: "Car",
    licenseNumber: "C44556677",
    expiryDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    penaltyPoints: 1,
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const initialNotifications: Notification[] = [
  {
    id: "1",
    userId: "2", // Manager
    message: "New license submission requires your approval",
    type: "info",
    read: false,
    createdAt: "2023-06-28T16:25:00Z",
  },
  {
    id: "2",
    userId: "1", // Driver
    message: "Your license is approved",
    type: "success",
    read: true,
    createdAt: "2023-06-15T15:00:00Z",
  },
  {
    id: "3",
    userId: "2", // Manager
    message: "Driver Mike Smith has 8 penalty points",
    type: "warning",
    read: false,
    createdAt: "2023-05-21T11:35:00Z",
  },
  {
    id: "4",
    userId: "2", // Manager
    message: "New license submission from Sarah Connor requires approval",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    userId: "2", // Manager
    message: "New license submission from Robert Chen requires approval",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    userId: "2", // Manager
    message: "New license submission from Emily Rivera requires approval",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    userId: "2", // Manager
    message: "New license submission from David Kim requires approval",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const LicenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load data from localStorage or use initial data if not available
    const savedLicenses = localStorage.getItem('licenses');
    const savedNotifications = localStorage.getItem('notifications');
    
    setLicenses(savedLicenses ? JSON.parse(savedLicenses) : initialLicenses);
    setNotifications(savedNotifications ? JSON.parse(savedNotifications) : initialNotifications);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (licenses.length > 0) {
      localStorage.setItem('licenses', JSON.stringify(licenses));
    }
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [licenses, notifications]);

  const addLicense = (licenseData: Omit<License, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'driverId' | 'driverName'>) => {
    if (!user) return;
    
    const now = new Date().toISOString();
    const newLicense: License = {
      id: Date.now().toString(),
      driverId: user.id,
      driverName: user.name,
      ...licenseData,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    
    setLicenses(prev => [...prev, newLicense]);
    
    // Create notification for managers
    const newNotification: Notification = {
      id: Date.now().toString(),
      userId: "2", // Hardcoded for manager in this demo
      message: `New license submission from ${user.name} requires approval`,
      type: 'info',
      read: false,
      createdAt: now,
    };
    
    setNotifications(prev => [...prev, newNotification]);
    toast.success("License submitted successfully");
  };

  const updateLicenseStatus = (licenseId: string, status: 'approved' | 'rejected') => {
    setLicenses(prev => 
      prev.map(license => 
        license.id === licenseId 
          ? { 
              ...license, 
              status,
              updatedAt: new Date().toISOString(),
            } 
          : license
      )
    );
    
    // Find the license to get driver info
    const license = licenses.find(l => l.id === licenseId);
    if (license) {
      // Notify the driver about the status change
      const newNotification: Notification = {
        id: Date.now().toString(),
        userId: license.driverId,
        message: `Your license has been ${status}`,
        type: status === 'approved' ? 'success' : 'error',
        read: false,
        createdAt: new Date().toISOString(),
      };
      
      setNotifications(prev => [...prev, newNotification]);
    }
    
    toast.success(`License ${status} successfully`);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const clearAllNotifications = () => {
    if (!user) return;
    
    setNotifications(prev => 
      prev.filter(notification => notification.userId !== user.id)
    );
    
    toast.info("All notifications cleared");
  };

  const getPendingLicenses = () => {
    return licenses.filter(license => license.status === 'pending');
  };

  const getDriverLicenses = (driverId: string) => {
    return licenses.filter(license => license.driverId === driverId);
  };

  const getLicensesNearExpiry = () => {
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    
    return licenses.filter(license => {
      const expiryDate = new Date(license.expiryDate);
      return expiryDate <= threeMonthsFromNow && expiryDate > today;
    });
  };

  const getHighPenaltyDrivers = () => {
    return licenses.filter(license => license.penaltyPoints >= 7);
  };

  return (
    <LicenseContext.Provider 
      value={{ 
        licenses, 
        notifications, 
        addLicense, 
        updateLicenseStatus, 
        markNotificationAsRead, 
        clearAllNotifications,
        getPendingLicenses,
        getDriverLicenses,
        getLicensesNearExpiry,
        getHighPenaltyDrivers
      }}
    >
      {children}
    </LicenseContext.Provider>
  );
};

export const useLicense = (): LicenseContextType => {
  const context = useContext(LicenseContext);
  if (context === undefined) {
    throw new Error('useLicense must be used within a LicenseProvider');
  }
  return context;
};
