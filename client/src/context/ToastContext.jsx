import { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Toast from '../components/ui/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'info', duration = 5000 }) => {
    const id = uuidv4();
    setToasts((currentToasts) => [
      ...currentToasts,
      { id, message, type, duration },
    ]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  const toast = useCallback(
    (message, options = {}) => {
      return addToast({ message, ...options });
    },
    [addToast]
  );

  toast.success = (message, options = {}) =>
    addToast({ message, type: 'success', ...options });
  toast.error = (message, options = {}) =>
    addToast({ message, type: 'error', ...options });
  toast.warning = (message, options = {}) =>
    addToast({ message, type: 'warning', ...options });
  toast.info = (message, options = {}) =>
    addToast({ message, type: 'info', ...options });
  toast.remove = removeToast;

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-4 z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
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
