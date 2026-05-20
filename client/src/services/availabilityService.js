import axios from 'axios';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  return { Authorization: `Bearer ${token}` };
};

// Worker updates their status
export const updateAvailabilityStatus = async (status) => {
  const res = await axios.put(
    '/api/availability/status',
    { availabilityStatus: status },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

// Fetch a worker's status
export const getWorkerStatus = async (workerId) => {
  const res = await axios.get(`/api/availability/status/${workerId}`);
  return res.data;
};