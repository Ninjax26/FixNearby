import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateNotificationPreferences, updateProfile } from "../services/authService";
import useToast from "../hooks/useToast";

const Profile = () => {
  const { user, token, login } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    email: user?.notificationPreferences?.email ?? true,
    sms: user?.notificationPreferences?.sms ?? true,
    push: user?.notificationPreferences?.push ?? true,
  });

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

  const handleSavePreferences = async () => {
    setPreferencesLoading(true);
    try {
      const updatedPreferences = await updateNotificationPreferences(preferences);
      setPreferences(updatedPreferences);
      login({ ...user, token, notificationPreferences: updatedPreferences });
      showToast('Notification preferences updated!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to update notification preferences', 'error');
    } finally {
      setPreferencesLoading(false);
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

      <section className="mt-6 bg-white shadow rounded-lg p-6" aria-labelledby="notification-settings-heading">
        <h2 id="notification-settings-heading" className="text-xl font-semibold text-gray-900">Notifications</h2>
        <p className="mt-1 text-sm text-gray-500">Choose how FixNearby may contact you.</p>
        <div className="mt-5 space-y-4">
          {[
            ['email', 'Email notifications'],
            ['sms', 'SMS notifications'],
            ['push', 'Push notifications'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-gray-700">{label}</span>
              <input
                type="checkbox"
                checked={preferences[key]}
                onChange={(event) => setPreferences((current) => ({
                  ...current,
                  [key]: event.target.checked,
                }))}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={handleSavePreferences}
          disabled={preferencesLoading}
          className="mt-6 rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {preferencesLoading ? 'Saving...' : 'Save Notification Preferences'}
        </button>
      </section>
    </div>
  );
};

export default Profile;
