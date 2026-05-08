import { useState } from "react";
import useToast from "../hooks/useToast";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

const Profile = () => {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Handle API update logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Save failed:', error);
      showToast('Failed to save changes. Please try again.', 'error');
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // TODO: (50% built) Load authenticated user's data from global state or API.
  // Example: const { user } = useAuth();
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Settings</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <form className="space-y-6">
          {/* TODO: Tie inputs to component state and handle form submission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" defaultValue="John Customer" className="input-base" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" defaultValue="john@example.com" disabled className="input-base" />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="tel" placeholder="(555) 123-4567" className="input-base" />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button type="button" onClick={handleSave} disabled={loading} className="btn-primary">
            <button type="button" onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow disabled:opacity-50 disabled:cursor-not-allowed">
              <span className={`btn-text ${loading ? 'hidden' : ''}`}>Save Changes</span>
              <span className={`btn-loader ${loading ? '' : 'hidden'}`}>Loading...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
