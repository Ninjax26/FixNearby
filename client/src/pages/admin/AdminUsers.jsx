import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import api from '../../services/apiClient';

const AdminUsers = () => {
  useDocumentTitle('User Management');
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('users');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [uRes, wRes] = await Promise.allSettled([
          api.get('/admin/users'),
          api.get('/admin/workers'),
        ]);
        if (uRes.status === 'fulfilled') setUsers(uRes.value.data?.users || []);
        if (wRes.status === 'fulfilled') setWorkers(wRes.value.data?.workers || []);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const items = tab === 'users' ? users : workers;
  const filtered = items.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase()) ||
    item.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{tab === 'users' ? 'Users' : 'Workers'} Management</h1>

      <div className="flex gap-4 mb-6">
        <div className="flex gap-2">
          <button onClick={() => setTab('users')} className={`px-4 py-2 rounded-xl text-sm font-semibold ${tab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Users ({users.length})</button>
          <button onClick={() => setTab('workers')} className={`px-4 py-2 rounded-xl text-sm font-semibold ${tab === 'workers' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Workers ({workers.length})</button>
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">{tab === 'workers' ? 'Category' : 'Role'}</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-gray-600">{item.email}</td>
                  <td className="px-6 py-4">{tab === 'workers' ? item.category : item.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (item.status === 'available' || item.status === 'online') ? 'bg-green-100 text-green-700' :
                      item.status === 'offline' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'
                    }`}>{item.status || 'offline'}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
