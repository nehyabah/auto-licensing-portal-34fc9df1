
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useLicense } from '@/context/LicenseContext';
import LicenseCard from '@/components/LicenseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, CheckCheck } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const ManagerApproval: React.FC = () => {
  const { getPendingLicenses } = useLicense();
  const [searchTerm, setSearchTerm] = useState('');
  const [licenseType, setLicenseType] = useState<string>('all');
  
  const pendingLicenses = getPendingLicenses();
  
  const filteredLicenses = pendingLicenses.filter(license => {
    const matchesSearch = 
      license.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = licenseType === 'all' || license.licenseType === licenseType;
    
    return matchesSearch && matchesType;
  });
  
  const licenseTypes = ['all', ...new Set(pendingLicenses.map(license => license.licenseType))];
  
  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col space-y-8 animate-in">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              License Approvals
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and approve license submissions from drivers
            </p>
          </div>
          
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by driver name or license number"
                className="pl-9 bg-background/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-64">
              <Select
                value={licenseType}
                onValueChange={setLicenseType}
              >
                <SelectTrigger className="bg-background/50">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by license type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {licenseTypes.map(type => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type === 'all' ? 'All Types' : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="space-y-6">
            {filteredLicenses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLicenses.map(license => (
                  <LicenseCard 
                    key={license.id} 
                    license={license} 
                    showActions={true} 
                  />
                ))}
              </div>
            ) : (
              <Card className="glass">
                <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCheck className="h-6 w-6 text-primary" />
                  </div>
                  
                  {pendingLicenses.length === 0 ? (
                    <p className="text-muted-foreground text-center">
                      There are no pending license submissions to approve.
                    </p>
                  ) : (
                    <div className="text-center">
                      <p className="text-muted-foreground">
                        No results match your search criteria.
                      </p>
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          setSearchTerm('');
                          setLicenseType('all');
                        }}
                        className="mt-2"
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerApproval;
