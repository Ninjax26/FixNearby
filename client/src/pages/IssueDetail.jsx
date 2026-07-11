import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, ThumbsUp, Clock, AlertTriangle } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { getIssueById, upvoteIssue } from '../services/issueService';
import useToast from '../hooks/useToast';
import SkeletonLoader from '../components/SkeletonLoader';

const statusStyles = {
  open: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

const IssueDetail = () => {
  const { id } = useParams();
  useDocumentTitle('Issue Details');
  const { showToast } = useToast();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upvoting, setUpvoting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getIssueById(id);
        setIssue(data.data || data);
      } catch (err) {
        showToast('Failed to load issue details.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, showToast]);

  const handleUpvote = async () => {
    setUpvoting(true);
    try {
      const res = await upvoteIssue(id);
      setIssue(prev => ({ ...prev, upvotes: res.upvotes || (prev?.upvotes || 0) + 1 }));
      showToast('Upvote recorded!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to upvote.', 'error');
    } finally {
      setUpvoting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <SkeletonLoader type="card" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <AlertTriangle className="mx-auto text-amber-500 mb-4" size={48} />
        <h2 className="text-xl font-bold">Issue not found</h2>
        <Link to="/civic-issues" className="text-blue-600 hover:underline mt-4 inline-block">&larr; Back to Civic Issues</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/civic-issues" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6">
        <ArrowLeft size={16} /> Back to Civic Issues
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              <Clock size={14} className="inline mr-1" />
              Reported {new Date(issue.reportedAt || issue.createdAt).toLocaleDateString()}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[issue.status] || 'bg-gray-100 text-gray-800'}`}>
            {issue.status}
          </span>
        </div>

        {issue.thumbnailUrl && (
          <img src={issue.thumbnailUrl} alt={issue.title} className="w-full rounded-xl max-h-96 object-cover" />
        )}

        <p className="text-gray-700 leading-relaxed">{issue.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
          {issue.latitude && issue.longitude && (
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
            </span>
          )}
          <span className="font-semibold text-gray-700">{issue.category}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <ThumbsUp size={18} className="text-blue-600" />
            <span className="font-bold text-lg">{issue.upvotes || 0}</span>
            <span className="text-sm text-gray-500">upvotes</span>
          </div>
          <button
            onClick={handleUpvote}
            disabled={upvoting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            <ThumbsUp size={16} />
            {upvoting ? 'Upvoting...' : 'Upvote'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueDetail;
