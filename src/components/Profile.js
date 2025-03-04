import React, { useState, useEffect } from 'react';
import { 
  getCurrentUser, 
  fetchUserAttributes, 
  updateUserAttributes 
} from '@aws-amplify/auth';
import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const currentUser = await getCurrentUser();
      console.log('Current user:', currentUser);
      const attributes = await fetchUserAttributes();
      console.log('User attributes:', attributes);
      setUser(currentUser);
      setEmail(attributes.email || '');
      setName(attributes.name || '');
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert('No user data available to update.');
      return;
    }
    setSaving(true);
    try {
      // Filter out empty or undefined attributes
      const attributesToUpdate = {};
      if (email) attributesToUpdate.email = email;
      if (name) attributesToUpdate.name = name;

      if (Object.keys(attributesToUpdate).length === 0) {
        alert('No changes to save.');
        setSaving(false);
        return;
      }

      await updateUserAttributes(attributesToUpdate);
      alert('Profile updated successfully!');
      // Refresh attributes after update
      const attributes = await fetchUserAttributes();
      setEmail(attributes.email || '');
      setName(attributes.name || '');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="profile">
      <h2>Your Profile</h2>
      <div className="profile-field">
        <label>Username:</label>
        <input
          type="text"
          value={user?.username || 'N/A'}
          disabled
        />
      </div>
      <div className="profile-field">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={saving}
        />
      </div>
      <div className="profile-field">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={saving}
        />
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="save-button"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}

export default Profile;