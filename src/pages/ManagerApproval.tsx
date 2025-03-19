
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useLicense } from '@/context/LicenseContext';
import LicenseCard from '@/components/LicenseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, CheckCheck, Users, GridIcon, ListIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ManagerApproval: React.FC = () => {
  const { licenses, getPendingLicenses } = useLicense();
  const [searchTerm, setSearchTerm] = useState('');
  const [licenseType, setLicenseType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('pending');
  const isMobile = useIsMobile();
  
  const pendingLicenses = getPendingLicenses();
  const itemsPerPage = isMobile ? 4 : 6;
  
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
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={viewMode === 'grid' ? 'bg-secondary' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <GridIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={viewMode === 'table' ? 'bg-secondary' : ''}
                  onClick={() => setViewMode('table')}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>
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
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginatedLicenses.map(license => (
                          <LicenseCard 
                            key={license.id} 
                            license={license} 
                            showActions={true} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Driver</TableHead>
                              <TableHead>License Type</TableHead>
                              <TableHead>License Number</TableHead>
                              <TableHead>Expiry Date</TableHead>
                              <TableHead>Points</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedLicenses.length > 0 ? (
                              paginatedLicenses.map(license => (
                                <TableRow key={license.id}>
                                  <TableCell className="font-medium">{license.driverName}</TableCell>
                                  <TableCell>{license.licenseType}</TableCell>
                                  <TableCell>{license.licenseNumber}</TableCell>
                                  <TableCell>{format(parseISO(license.expiryDate), 'PP')}</TableCell>
                                  <TableCell>{license.penaltyPoints}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(license.status)}>
                                      {license.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="h-8 text-destructive border-destructive/20 hover:bg-destructive/10"
                                        onClick={() => {
                                          const { updateLicenseStatus } = useLicense();
                                          updateLicenseStatus(license.id, 'rejected');
                                        }}
                                      >
                                        Reject
                                      </Button>
                                      <Button 
                                        size="sm"
                                        className="h-8"
                                        onClick={() => {
                                          const { updateLicenseStatus } = useLicense();
                                          updateLicenseStatus(license.id, 'approved');
                                        }}
                                      >
                                        Approve
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                  No pending licenses match your search criteria
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
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
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginatedLicenses.map(license => (
                          <LicenseCard 
                            key={license.id} 
                            license={license} 
                            showActions={license.status === 'pending'} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Driver</TableHead>
                              <TableHead>License Type</TableHead>
                              <TableHead>License Number</TableHead>
                              <TableHead>Expiry Date</TableHead>
                              <TableHead>Points</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedLicenses.length > 0 ? (
                              paginatedLicenses.map(license => (
                                <TableRow key={license.id}>
                                  <TableCell className="font-medium">{license.driverName}</TableCell>
                                  <TableCell>{license.licenseType}</TableCell>
                                  <TableCell>{license.licenseNumber}</TableCell>
                                  <TableCell>{format(parseISO(license.expiryDate), 'PP')}</TableCell>
                                  <TableCell>{license.penaltyPoints}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(license.status)}>
                                      {license.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    {license.status === 'pending' && (
                                      <div className="flex space-x-2">
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          className="h-8 text-destructive border-destructive/20 hover:bg-destructive/10"
                                          onClick={() => {
                                            const { updateLicenseStatus } = useLicense();
                                            updateLicenseStatus(license.id, 'rejected');
                                          }}
                                        >
                                          Reject
                                        </Button>
                                        <Button 
                                          size="sm"
                                          className="h-8"
                                          onClick={() => {
                                            const { updateLicenseStatus } = useLicense();
                                            updateLicenseStatus(license.id, 'approved');
                                          }}
                                        >
                                          Approve
                                        </Button>
                                      </div>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                  No licenses match your search criteria
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
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
