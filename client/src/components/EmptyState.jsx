import { Link } from 'react-router-dom';

const EmptyState = ({
  icon = '📭',
  title,
  description,
  primaryAction,
  secondaryAction,
  className = '',
}) => {
  return (
    <div className={`mx-auto max-w-2xl text-center py-16 px-8 sm:px-10 bg-white border border-gray-200 rounded-3xl shadow-sm ${className}`}>
      <div className="text-6xl mb-5">{icon}</div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-sm leading-6 text-gray-500 mb-8">{description}</p>

      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          {primaryAction && (
            primaryAction.to ? (
              <Link
                to={primaryAction.to}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                {primaryAction.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                {primaryAction.label}
              </button>
            )
          )}

          {secondaryAction && (
            secondaryAction.to ? (
              <Link
                to={secondaryAction.to}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
              >
                {secondaryAction.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
              >
                {secondaryAction.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
