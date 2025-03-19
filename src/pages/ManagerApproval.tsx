
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useLicense } from '@/context/LicenseContext';
import LicenseCard from '@/components/LicenseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, CheckCheck, Users, Eye } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ManagerApproval: React.FC = () => {
  const { licenses, getPendingLicenses } = useLicense();
  const [searchTerm, setSearchTerm] = useState('');
  const [licenseType, setLicenseType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('pending');
  const isMobile = useIsMobile();
  
  const pendingLicenses = getPendingLicenses();
  const itemsPerPage = 8; // Show more items in list view
  
  // For debugging pending licenses
  useEffect(() => {
    console.log("ManagerApproval - Pending licenses:", pendingLicenses);
  }, [pendingLicenses]);
  
  // Get all licenses for the full list view
  const allLicenses = licenses.filter(license => {
    // Apply search filters to all licenses
    const matchesSearch = 
      license.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = licenseType === 'all' || license.licenseType === licenseType;
    
    return matchesSearch && matchesType;
  });
  
  // Filter pending licenses based on search and type
  const filteredPendingLicenses = pendingLicenses.filter(license => {
    const matchesSearch = 
      license.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = licenseType === 'all' || license.licenseType === licenseType;
    
    return matchesSearch && matchesType;
  });
  
  // Get licenses to display based on tab
  const licensesToDisplay = activeTab === 'pending' ? filteredPendingLicenses : allLicenses;
  
  // Calculate pagination
  const totalPages = Math.ceil(licensesToDisplay.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLicenses = licensesToDisplay.slice(startIndex, startIndex + itemsPerPage);
  
  const licenseTypes = ['all', ...new Set(licenses.map(license => license.licenseType))];
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col space-y-8 animate-in">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              License Approvals
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and manage license submissions from drivers
            </p>
          </div>
          
          <Tabs 
            defaultValue="pending" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <TabsList className="mb-2 sm:mb-0">
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <CheckCheck className="h-4 w-4" />
                  <span>Pending Approvals</span>
                  {pendingLicenses.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium">
                      {pendingLicenses.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>All Drivers</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by driver name or license number"
                  className="pl-9 bg-background/50"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
              </div>
              
              <div className="w-full sm:w-64">
                <Select
                  value={licenseType}
                  onValueChange={(value) => {
                    setLicenseType(value);
                    setCurrentPage(1); // Reset to first page on filter change
                  }}
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
              <TabsContent value="pending" className="mt-0">
                {filteredPendingLicenses.length > 0 ? (
                  <div>
                    <div className="space-y-3">
                      {paginatedLicenses.map(license => (
                        <LicenseCard 
                          key={license.id} 
                          license={license} 
                          showActions={true} 
                          variant="list-item"
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card className="glass">
                    <CardContent className={`${isMobile ? 'p-4' : 'p-6'} flex flex-col items-center justify-center space-y-4`}>
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
              </TabsContent>
              
              <TabsContent value="all" className="mt-0">
                {allLicenses.length > 0 ? (
                  <div>
                    <div className="space-y-3">
                      {paginatedLicenses.map(license => (
                        <LicenseCard 
                          key={license.id} 
                          license={license} 
                          showActions={license.status === 'pending'} 
                          variant="list-item"
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card className="glass">
                    <CardContent className={`${isMobile ? 'p-4' : 'p-6'} flex flex-col items-center justify-center space-y-4`}>
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-muted-foreground text-center">
                        No license records found.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </div>
            
            {/* Pagination */}
            {licensesToDisplay.length > itemsPerPage && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          isActive={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ManagerApproval;
