
import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiryDate: string;
  penaltyPoints: number;
  employeeId: string;
  department: string;
  imageUrl?: string;
  licenseImageUrl?: string;
  status: 'active' | 'suspended' | 'inactive';
  notes?: string;
  createdAt: string;
}

interface DriverContextType {
  drivers: Driver[];
  addDriver: (driver: Omit<Driver, 'id' | 'createdAt'>) => void;
  updateDriver: (id: string, driverData: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  getDriverById: (id: string) => Driver | undefined;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

// Default license image URL
const DEFAULT_LICENSE_IMAGE = "https://res.cloudinary.com/dfjv35kht/image/upload/v1742397639/Driver_licence_number_ezde8n.png";

// Mock data for initial drivers
const initialDrivers: Driver[] = [
  {
    id: "d1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "085-123-4567",
    address: "123 Main Street, Cork",
    licenseNumber: "CK12345678",
    licenseType: "Class B",
    licenseExpiryDate: "2025-06-15",
    penaltyPoints: 2,
    employeeId: "EMP001",
    department: "Waste Management",
    imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    licenseImageUrl: DEFAULT_LICENSE_IMAGE,
    status: "active",
    notes: "Experienced driver with good safety record",
    createdAt: "2022-04-10T09:00:00Z"
  },
  {
    id: "d2",
    name: "Sarah O'Connor",
    email: "sarah.oconnor@example.com",
    phone: "086-234-5678",
    address: "45 High Street, Cork",
    licenseNumber: "CK23456789",
    licenseType: "Class C",
    licenseExpiryDate: "2024-09-20",
    penaltyPoints: 4,
    employeeId: "EMP002",
    department: "Parks and Recreation",
    imageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    licenseImageUrl: DEFAULT_LICENSE_IMAGE,
    status: "active",
    notes: "Specialist in heavy machinery operation",
    createdAt: "2021-08-15T14:30:00Z"
  },
  {
    id: "d3",
    name: "Michael Ryan",
    email: "michael.ryan@example.com",
    phone: "087-345-6789",
    address: "78 River View, Cork",
    licenseNumber: "CK34567890",
    licenseType: "Class D",
    licenseExpiryDate: "2023-12-05",
    penaltyPoints: 8,
    employeeId: "EMP003",
    department: "Road Maintenance",
    imageUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    licenseImageUrl: DEFAULT_LICENSE_IMAGE,
    status: "suspended",
    notes: "Recent traffic violation, under review",
    createdAt: "2022-01-18T10:15:00Z"
  },
  {
    id: "d4",
    name: "Emma Murphy",
    email: "emma.murphy@example.com",
    phone: "085-456-7890",
    address: "12 Oak Avenue, Cork",
    licenseNumber: "CK45678901",
    licenseType: "Class B",
    licenseExpiryDate: "2025-03-28",
    penaltyPoints: 0,
    employeeId: "EMP004",
    department: "Water Services",
    imageUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    licenseImageUrl: DEFAULT_LICENSE_IMAGE,
    status: "active",
    notes: "Perfect driving record",
    createdAt: "2022-06-22T08:45:00Z"
  }
];

export const DriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    // Load from localStorage or use initial data
    const savedDrivers = localStorage.getItem('drivers');
    
    if (savedDrivers) {
      setDrivers(JSON.parse(savedDrivers));
    } else {
      setDrivers(initialDrivers);
      localStorage.setItem('drivers', JSON.stringify(initialDrivers));
    }
  }, []);

  const addDriver = (driverData: Omit<Driver, 'id' | 'createdAt'>) => {
    const newDriver: Driver = {
      ...driverData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      licenseImageUrl: driverData.licenseImageUrl || DEFAULT_LICENSE_IMAGE
    };

    setDrivers(prevDrivers => {
      const updatedDrivers = [...prevDrivers, newDriver];
      localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
      return updatedDrivers;
    });

    toast.success(`Driver ${driverData.name} has been added`);
    return newDriver;
  };

  const updateDriver = (id: string, driverData: Partial<Driver>) => {
    setDrivers(prevDrivers => {
      const driverIndex = prevDrivers.findIndex(driver => driver.id === id);
      
      if (driverIndex === -1) {
        toast.error("Driver not found");
        return prevDrivers;
      }
      
      const updatedDrivers = [...prevDrivers];
      updatedDrivers[driverIndex] = {
        ...updatedDrivers[driverIndex],
        ...driverData,
      };
      
      localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
      toast.success(`Driver ${updatedDrivers[driverIndex].name} has been updated`);
      return updatedDrivers;
    });
  };

  const deleteDriver = (id: string) => {
    setDrivers(prevDrivers => {
      const driverToDelete = prevDrivers.find(driver => driver.id === id);
      
      if (!driverToDelete) {
        toast.error("Driver not found");
        return prevDrivers;
      }
      
      const updatedDrivers = prevDrivers.filter(driver => driver.id !== id);
      localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
      toast.success(`Driver ${driverToDelete.name} has been deleted`);
      return updatedDrivers;
    });
  };

  const getDriverById = (id: string) => {
    return drivers.find(driver => driver.id === id);
  };

  return (
    <DriverContext.Provider value={{ 
      drivers, 
      addDriver, 
      updateDriver, 
      deleteDriver,
      getDriverById
    }}>
      {children}
    </DriverContext.Provider>
  );
};

export const useDrivers = (): DriverContextType => {
  const context = useContext(DriverContext);
  if (context === undefined) {
    throw new Error('useDrivers must be used within a DriverProvider');
  }
  return context;
};
