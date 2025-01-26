import React from 'react';
import { Trophy } from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function WinnerCard({ rank, student, score }) {
  const rankColors = {
    1: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    2: 'bg-gray-100 text-gray-800 border-gray-200',
    3: 'bg-amber-100 text-amber-800 border-amber-200'
  };

  const trophyColors = {
    1: 'text-yellow-500',
    2: 'text-gray-400',
    3: 'text-amber-600'
  };

  return (
    <div className={cn(
      'glass-card transform hover:scale-105 transition-all duration-300',
      rankColors[rank]
    )}>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <Trophy className={cn('h-8 w-8', trophyColors[rank])} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold truncate">{student.name}</p>
          <p className="text-sm opacity-75">{student.email}</p>
        </div>
        <div className="flex-shrink-0">
          <span className="text-2xl font-bold">{score}</span>
          <span className="text-sm ml-1">points</span>
        </div>
      </div>
    </div>
  );
}