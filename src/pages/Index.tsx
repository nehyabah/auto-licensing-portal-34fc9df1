
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { CheckCircle, ShieldCheck, Bell, FileText, Clock } from 'lucide-react';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const features = [
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Centralized License Management",
      description: "Store and manage driver license information in one secure location."
    },
    {
      icon: <Bell className="h-6 w-6 text-primary" />,
      title: "Automated Notifications",
      description: "Receive timely alerts for license renewals and penalty point thresholds."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Streamlined Approvals",
      description: "Efficient workflows for managers to verify and approve license submissions."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "GDPR Compliant",
      description: "Secure storage with strict data protection measures in place."
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Time-Saving Solution",
      description: "Reduce administrative overhead and eliminate paper-based processes."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="bg-gradient-to-b from-background to-secondary/50 py-20 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Fleet License Management System
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
              Simplify driver license management, automate compliance tracking, and 
              ensure regulatory adherence for Cork County Council's vehicle fleet.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              {isAuthenticated ? (
                <Button asChild size="lg" className="px-8 shadow-soft">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="px-8 shadow-soft">
                    <Link to="/signin">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </motion.div>

          <motion.div 
            className="mt-24"
            initial="hidden"
            animate="show"
            variants={container}
          >
            <h2 className="text-2xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div key={index} variants={item}>
                  <Card className="h-full glass hover-lift">
                    <CardContent className="p-6">
                      <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-24 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <p className="text-muted-foreground">
              Developed for Cork County Council to streamline driver license management and compliance.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
