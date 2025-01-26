import React from 'react';
import { Trophy } from 'lucide-react';

export default function TopWinners({ winners }) {
  const getPosition = (index) => {
    switch (index) {
      case 0:
        return { text: '1st Place', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
      case 1:
        return { text: '2nd Place', color: 'bg-gray-100 text-gray-800 border-gray-200' };
      case 2:
        return { text: '3rd Place', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      default:
        return { text: `${index + 1}th Place`, color: 'bg-blue-100 text-blue-800 border-blue-200' };
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Winners Podium</h2>
      
      <div className="grid gap-4">
        {winners.map((winner, index) => {
          const { text, color } = getPosition(index);
          return (
            <div
              key={winner.id}
              className={`glass-card ${color} transform hover:scale-105 transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-white/50">
                    <Trophy className={`h-6 w-6 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-500' : 'text-amber-600'}`} />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{text}</p>
                    <p className="text-sm opacity-75">{winner.student_name}</p>
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  {winner.score} pts
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}