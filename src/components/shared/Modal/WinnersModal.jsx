import React from 'react';
import Modal from '../Modal';
import { Trophy, AlertCircle } from 'lucide-react';

export default function WinnersModal({ isOpen, onClose, winners, subEventId }) {
  // Filter winners for this specific subevent
  const subEventWinners = winners?.filter(winner => winner.subevent_id === subEventId) || [];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Event Winners"
    >
      {subEventWinners.length > 0 ? (
        <div className="space-y-4">
          {subEventWinners.map((winner, index) => (
            <div
              key={winner.student_id}
              className={`p-4 rounded-lg border ${
                index === 0 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                index === 1 ? 'bg-gray-100 text-gray-800 border-gray-200' :
                'bg-amber-100 text-amber-800 border-amber-200'
              } transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/50 rounded-full">
                    <Trophy className={`h-6 w-6 ${
                      index === 0 ? 'text-yellow-500' : 
                      index === 1 ? 'text-gray-500' : 
                      'text-amber-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-bold text-lg">
                      {index === 0 ? '1st' : index === 1 ? '2nd' : '3rd'} Place
                    </p>
                    <p className="text-sm opacity-75">{winner.student_name}</p>
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  {winner.score} pts
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Winners Not Declared Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            The winners for this event haven't been announced. Check back later!
          </p>
        </div>
      )}
    </Modal>
  );
}