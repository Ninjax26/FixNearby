import { MapPin, ThumbsUp, Clock } from 'lucide-react';

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'resolved':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'in-progress':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200';
  }
};

const IssueCard = ({ issue, onUpvote, isUpvoting }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition duration-200">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(issue.status)}`}>
            {issue.status?.toUpperCase() || 'OPEN'}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock size={12} />
            {new Date(issue.reportedAt || Date.now()).toLocaleDateString()}
          </span>
        </div>

        {issue.thumbnailUrl && (
          <img
            src={issue.thumbnailUrl}
            alt={issue.title}
            className="w-full h-40 object-cover rounded-xl mb-4"
          />
        )}

        <h3 className="text-xl font-bold text-slate-900 mb-2">{issue.title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {issue.description}
        </p>
      </div>

      <div className="border-t border-slate-100 pt-4 flex items-center justify-between mt-auto">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
          <MapPin size={14} className="text-slate-400" />
          {issue.category}
        </span>

        <button
          onClick={(e) => { e.preventDefault(); onUpvote(issue._id); }}
          disabled={isUpvoting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition disabled:opacity-50"
        >
          <ThumbsUp size={14} />
          Upvote ({issue.upvotes || 0})
        </button>
      </div>
    </div>
  );
};

export default IssueCard;
