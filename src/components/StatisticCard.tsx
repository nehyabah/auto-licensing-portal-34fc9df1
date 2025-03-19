
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface StatisticCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  footer?: React.ReactNode;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
  footer
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className={cn("transition-all duration-300 hover-lift", className)}>
      <CardHeader className={cn("pb-2", isMobile && "p-4")}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn(isMobile && "px-4 py-2")}>
        <div className={cn("font-bold", isMobile ? "text-xl" : "text-2xl")}>
          {value}
        </div>
        {description && (
          <CardDescription className="mt-1 text-xs">
            {description}
          </CardDescription>
        )}
        {trend && (
          <div className="mt-2 flex items-center text-xs">
            <span
              className={cn(
                "flex items-center font-medium",
                trend.isPositive ? "text-green-500" : "text-destructive"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {trend.value}%
            </span>
            <span className="ml-1 text-muted-foreground">
              from last month
            </span>
          </div>
        )}
      </CardContent>
      {footer && (
        <CardFooter className={cn("pt-0", isMobile && "px-4 pb-4")}>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default StatisticCard;
