import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', message, duration = 5000 }) => {
    const id = uuidv4();
    setToasts((prevToasts) => [...prevToasts, { id, type, message }]);
    
    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (message, type = 'info', duration) => {
      return addToast({ type, message, duration });
    },
    [addToast]
  );

  toast.success = (message, duration) =>
    addToast({ type: 'success', message, duration });
  toast.error = (message, duration) =>
    addToast({ type: 'error', message, duration });
  toast.info = (message, duration) =>
    addToast({ type: 'info', message, duration });
  toast.warning = (message, duration) =>
    addToast({ type: 'warning', message, duration });
  toast.remove = removeToast;

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 w-80">
        {toasts.map(({ id, type, message }) => (
          <div
            key={id}
            className={`p-4 rounded-lg shadow-lg text-white ${
              type === 'success'
                ? 'bg-green-500'
                : type === 'error'
                ? 'bg-red-500'
                : type === 'warning'
                ? 'bg-yellow-500'
                : 'bg-blue-500'
            }`}
          >
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium">{message}</p>
              <button
                onClick={() => removeToast(id)}
                className="ml-4 text-white hover:text-gray-200 focus:outline-none"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
