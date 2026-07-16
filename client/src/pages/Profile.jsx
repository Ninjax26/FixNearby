import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { exportProfileData, updateProfile } from "../services/authService";
import useToast from "../hooks/useToast";
import { downloadJson } from "../utils/downloadJson";

const Profile = () => {
  const { user, login } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showToast("Name cannot be empty", "error");
      return;
    }

    setLoading(true);

    try {
      const updatedUser = await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      });
      
      login(updatedUser);
      showToast("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Save failed:", error);
      showToast(error.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const data = await exportProfileData();
      downloadJson({
        data,
        filename: `fixnearby-account-${new Date().toISOString().slice(0, 10)}.json`,
      });
      showToast('Account data downloaded successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to export account data', 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        My Settings
      </h1>

      <div className="bg-white shadow rounded-lg p-6">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              value={formData.email}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md shadow-sm text-gray-500 sm:text-sm cursor-not-allowed"
            />

            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>

            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
              
            </button>
          </div>
        </form>
      </div>

      <section className="mt-6 rounded-lg bg-white p-6 shadow" aria-labelledby="account-data-heading">
        <h2 id="account-data-heading" className="text-xl font-semibold text-gray-900">Your data</h2>
        <p className="mt-1 text-sm text-gray-500">
          Download a JSON copy of your account details and notification preferences.
        </p>
        <button
          type="button"
          onClick={handleExportData}
          disabled={exporting}
          className="mt-5 rounded border border-blue-600 px-4 py-2 font-bold text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {exporting ? 'Preparing download...' : 'Download My Data'}
        </button>
      </section>
    </div>
  );
};

export default Profile;
