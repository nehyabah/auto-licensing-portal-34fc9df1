
import React from 'react';
import Navbar from '@/components/Navbar';
import LicenseForm from '@/components/LicenseForm';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useLicense } from '@/context/LicenseContext';
import LicenseCard from '@/components/LicenseCard';
import { Info, FileText } from 'lucide-react';

const LicenseUpload: React.FC = () => {
  const { user } = useAuth();
  const { getDriverLicenses } = useLicense();
  
  const driverLicenses = user ? getDriverLicenses(user.id) : [];
  const hasPendingLicense = driverLicenses.some(license => license.status === 'pending');
  
  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar />
      
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col space-y-8 animate-in">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              License Upload
            </h1>
            <p className="text-muted-foreground mt-1">
              Submit your driver license details for verification
            </p>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {hasPendingLicense ? (
                <div className="space-y-6">
                  <Card className="glass border-amber-500/60">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Info className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-lg">Pending Approval</h3>
                          <p className="text-muted-foreground">
                            You already have a license submission awaiting approval. Please wait for 
                            your current submission to be processed before submitting a new one.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <h2 className="text-xl font-semibold">Your Pending License</h2>
                  
                  {driverLicenses
                    .filter(license => license.status === 'pending')
                    .map(license => (
                      <LicenseCard key={license.id} license={license} />
                    ))
                  }
                </div>
              ) : (
                <LicenseForm />
              )}
            </div>
            
            {/* Information and Instructions */}
            <div className="space-y-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>License Submission Guide</CardTitle>
                  <CardDescription>
                    Important information about submitting your license
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Required Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Make sure to provide accurate information from your driver license.
                      Incorrect information may result in processing delays.
                    </p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Document Upload</h3>
                      <p className="text-sm text-muted-foreground">
                        Please upload a clear photo or scan of your driver license. 
                        We accept PDF, JPG, or PNG files. Make sure all details are clearly visible.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Approval Process</h3>
                    <p className="text-sm text-muted-foreground">
                      After submission, your line manager will review and approve your license details.
                      You'll receive a notification once your submission has been processed.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">License Types</h3>
                    <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                      <li>Car (Class B): Standard driver license for passenger vehicles</li>
                      <li>Truck (Class C): Required for commercial trucks and larger vehicles</li>
                      <li>Bus (Class D): Required for passenger-carrying vehicles</li>
                      <li>Motorcycle (Class A): For motorcycles and mopeds</li>
                      <li>Commercial (Class CE): For commercial vehicle operation</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Penalty Points</h3>
                    <p className="text-sm text-muted-foreground">
                      If you have accumulated 7 or more penalty points, your manager will be notified
                      automatically to assess additional risk management procedures.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {driverLicenses.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">License History</h2>
                  
                  {driverLicenses
                    .filter(license => license.status !== 'pending')
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map(license => (
                      <LicenseCard key={license.id} license={license} />
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LicenseUpload;
