import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from 'next/router' instead of 'next/navigation'
import { toast } from 'react-toastify';

interface ResetProps {
  onClose: () => void;
}

const Reset: React.FC<ResetProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email.');
      return;
    }
    setIsSending(true);
    try {
      if (!isCodeSent) {
        const response = await fetch('/api/auth/reset-password/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setIsSending(false);
          setIsCodeSent(true);
          toast.success('Password reset link sent successfully!', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
        } else {
          setIsSending(false);
          const data = await response.json();
          if (data.error === 'User not found') {
            toast.error('User not found. Please check your email address.', {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 1000,
            });
          } else {
            setIsSending(false);
            toast.error(data.error || 'An unexpected error occurred.', {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 1000,
            });
          }
        }
      } else {
        const response = await fetch('/api/auth/reset-password/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resetToken: resetCode, newPassword }),
        });

        if (response.ok) {
        
          toast.success('Password reset successful!', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
          onClose()
        } else {
            setIsSending(false);
          const data = await response.json();
          toast.error(data.error || 'An unexpected error occurred.', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
          });
        }
      }
    } catch (error) {
        
      console.error(error);
      toast.error('An unexpected error occurred.', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      setIsSending(false); // Make sure to set isSending to false in case of an error
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-400 to-indigo-500">
          <h3 className="text-2xl font-semibold text-white">Reset Password</h3>
          <button
            className="text-white hover:text-gray-200 focus:outline-none"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                name="email"
                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                placeholder="YourEmail@example.com"
              />
            </div>
            {isCodeSent && (
              <>
                <div>
                  <label htmlFor="resetCode" className="block text-sm font-medium text-gray-600">
                    Reset Code
                  </label>
                  <input
                    onChange={(e) => setResetCode(e.target.value)}
                    type="text"
                    id="resetCode"
                    name="resetCode"
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                    placeholder="Enter Reset Code"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600">
                    New Password
                  </label>
                  <input
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                    placeholder="Enter New Password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
                    Confirm Password
                  </label>
                  <input
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-indigo-500"
                    placeholder="Confirm New Password"
                  />
                </div>
              </>
            )}
            <button
              className="bg-indigo-500 text-white p-2 rounded-md w-full hover:bg-indigo-600 focus:outline-none focus:shadow-outline-indigo"
              type="submit"
              disabled={isSending} // Disable the button while sending
            >
              {isSending ? 'Sending...' : isCodeSent ? 'Reset Password' : 'Send Reset Code'}
            </button>
            <p className="mt-4 text-sm text-center">
              Remember your password?{' '}
              <span
                onClick={onClose}
                className="text-indigo-500 hover:underline cursor-pointer"
              >
                Sign In
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reset;
