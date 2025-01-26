import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const FAQs = [
  {
    id: 1,
    question: "I can't register for an event",
    category: "registration"
  },
  {
    id: 2,
    question: "Payment failed but amount deducted",
    category: "payment"
  },
  {
    id: 3,
    question: "Unable to download certificate",
    category: "certificate"
  },
  {
    id: 4,
    question: "Event attendance not marked",
    category: "attendance"
  },
  {
    id: 5,
    question: "Other issue",
    category: "other"
  }
];

function ChatBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage("Hi! How can I help you today?", true);
      setStep(1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (user) {
      fetchComplaints();
    }
  }, [user]);

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/complaints/my-complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    }
  };

  const addMessage = (text, isBot = false, options = null) => {
    setMessages(prev => [...prev, { text, isBot, options }]);
  };

  const handleFAQSelect = (faq) => {
    setSelectedFAQ(faq);
    addMessage(faq.question, false);
    if (faq.category === 'other') {
      addMessage("Please describe your issue:", true);
      setStep(3);
    } else {
      addMessage("Please provide more details about your issue:", true);
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    try {
      const complaintData = {
        student_id: user.id,
        category: selectedFAQ?.category || 'other',
        complaint_text: input,
        status: 'pending'
      };

      await api.post('/complaints', complaintData);
      
      addMessage(input, false);
      addMessage("Thank you for submitting your complaint. We'll get back to you soon!", true);
      setInput('');
      setStep(4);
      fetchComplaints();
      toast.success('Complaint submitted successfully');
    } catch (error) {
      toast.error('Failed to submit complaint');
    }
  };

  const resetChat = () => {
    setMessages([]);
    setStep(0);
    setSelectedFAQ(null);
    setInput('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-primary text-white shadow-lg hover:scale-110 transition-transform duration-200"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 glass-card max-h-[600px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Campus Connect Support</h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={resetChat}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-xl ${
                  msg.isBot 
                    ? 'bg-gray-100 dark:bg-gray-800' 
                    : 'bg-primary text-white'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {step === 1 && (
              <div className="space-y-2">
                {FAQs.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => handleFAQSelect(faq)}
                    className="w-full p-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-between group"
                  >
                    <span>{faq.question}</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {step === 3 && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Type your message..."
                className="glass-input flex-1"
              />
              <button
                onClick={handleSubmit}
                className="btn btn-primary p-2"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Recent Complaints */}
          {complaints.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium mb-2">Recent Complaints</h4>
              <div className="space-y-2">
                {complaints.slice(0, 3).map((complaint) => (
                  <div
                    key={complaint.id}
                    className="text-sm p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{complaint.complaint_text}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        complaint.status === 'resolved' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ChatBot;