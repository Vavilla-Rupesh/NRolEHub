import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../../lib/utils';

function StatsCard({ title, value, icon: Icon, trend, to }) {
  const Card = to ? Link : 'div';
  
  return (
    <Card
      to={to}
      className={cn(
        "card neumorphic hover:scale-105 transition-transform duration-300",
        to && "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-sm text-green-500">
          <ArrowUpRight className="h-4 w-4 mr-1" />
          <span>{trend} from last month</span>
        </div>
      )}
    </Card>
  );
}

export default StatsCard;