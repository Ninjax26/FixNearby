import useToast from '../hooks/useToast';

const Toast = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type} px-4 py-3 rounded-lg shadow-lg text-white max-w-sm animate-slide-in`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;
