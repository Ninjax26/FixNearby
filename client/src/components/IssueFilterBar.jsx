import { Search, Filter } from 'lucide-react';

const IssueFilterBar = ({
  searchQuery,
  onSearchChange,
  filterCategory,
  onCategoryChange,
  categories,
  totalCount
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search reported issues..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <Filter className="text-slate-400 shrink-0" size={18} />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                filterCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat} {cat === 'All' && totalCount > 0 ? `(${totalCount})` : ''}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IssueFilterBar;
