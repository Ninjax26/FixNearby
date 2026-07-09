import { useState, useEffect } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import IssueSubmissionForm from '../components/IssueSubmissionForm';
import IssueCard from '../components/IssueCard';
import IssueFilterBar from '../components/IssueFilterBar';
import SkeletonLoader from '../components/SkeletonLoader';
import { getNearbyIssues, upvoteIssue } from '../services/issueService';
import useToast from '../hooks/useToast';
import { AlertTriangle } from 'lucide-react';
import useGeolocation from '../hooks/useGeolocation';

const CATEGORIES = ['All', 'Traffic Light', 'Pothole', 'Street Light', 'Sidewalk', 'Drainage'];

const CivicIssues = () => {
  useDocumentTitle("Civic Issues");
  const { coords } = useGeolocation();
  const { showToast } = useToast();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [upvotingIds, setUpvotingIds] = useState(new Set());

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const lat = coords?.latitude || 40.7128;
      const lng = coords?.longitude || -74.0060;
      const data = await getNearbyIssues({
        latitude: lat,
        longitude: lng,
        category: filterCategory !== 'All' ? filterCategory : undefined,
        radiusKm: 10
      });
      const issueList = data?.data || data || [];
      setIssues(Array.isArray(issueList) ? issueList : []);
    } catch (error) {
      console.error('Failed to load issues:', error);
      showToast('Could not fetch neighborhood reports.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [coords, filterCategory]);

  const handleUpvote = async (id) => {
    setUpvotingIds(prev => new Set(prev).add(id));
    try {
      await upvoteIssue(id);
      showToast('Upvote recorded!', 'success');
      fetchIssues();
    } catch (error) {
      showToast(error.message || 'Already upvoted or failed to upvote.', 'error');
    } finally {
      setUpvotingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const filteredIssues = issues.filter(issue =>
    issue.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalIssues = issues.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Civic Reporting Portal
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Help improve your neighborhood. Report public issues like potholes, broken street lights, or road obstructions, and track their resolution status.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-xl bg-slate-100 p-1.5">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'list'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Reports {!loading && `(${totalIssues})`}
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'report'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Report New Issue
          </button>
        </div>
      </div>

      {activeTab === 'report' ? (
        <div className="animate-fadeIn">
          <IssueSubmissionForm onSubmitSuccess={() => {
            setActiveTab('list');
            fetchIssues();
          }} />
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          <IssueFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterCategory={filterCategory}
            onCategoryChange={setFilterCategory}
            categories={CATEGORIES}
            totalCount={totalIssues}
          />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(n => (
                <SkeletonLoader key={n} type="card" />
              ))}
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <AlertTriangle className="mx-auto text-amber-500 mb-4" size={48} />
              <h3 className="text-lg font-bold text-slate-900">No issues found</h3>
              <p className="text-slate-500 text-sm mt-1">Be the first to report an issue in this area!</p>
              <button
                onClick={() => setActiveTab('report')}
                className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
              >
                Report Issue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredIssues.map((issue) => (
                <IssueCard
                  key={issue._id}
                  issue={issue}
                  onUpvote={handleUpvote}
                  isUpvoting={upvotingIds.has(issue._id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CivicIssues;
