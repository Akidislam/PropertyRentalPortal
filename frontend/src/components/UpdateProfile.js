import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/api';
import '../styles/updateprofile.css';
import { FaTimes, FaUser, FaPhone, FaLock, FaCamera, FaEnvelope } from 'react-icons/fa';

const UpdateProfile = ({ onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: {
          'x-auth-token': token
        }
      });

      if (response.data) {
        setFormData(prevData => ({
          ...prevData,
          name: response.data.name || '',
          email: response.data.email || '',
          phoneNumber: response.data.phoneNumber || ''
        }));
        if (response.data.profilePicture) {
          setPreviewUrl(`${BASE_URL}${response.data.profilePicture}`);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.response?.data?.message || 'Failed to fetch profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formDataToSend = new FormData();
      if (formData.name) formDataToSend.append('name', formData.name);
      if (formData.phoneNumber) formDataToSend.append('phoneNumber', formData.phoneNumber);
      if (formData.password) formDataToSend.append('password', formData.password);
      if (profilePicture) formDataToSend.append('profilePicture', profilePicture);

      const response = await axios.put(`${BASE_URL}/api/auth/profile`, formDataToSend, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        onUpdate(response.data);
        onClose();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleClose = (e) => {
    e.preventDefault();
    onClose();
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}>
          <FaTimes />
        </button>

        <div className="modal-header">
          <h2>Update Profile</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="profile-picture-preview">
            <img
              src={previewUrl || '/default-profile.png'}
              alt="Profile Preview"
              className="preview-image"
            />
            <label className="file-input-label">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
              <FaCamera className="camera-icon" />
            </label>
          </div>

          <div className="form-group">
            <label><FaUser /> Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label><FaEnvelope /> Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className="form-input"
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label><FaPhone /> Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label><FaLock /> New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter new password (optional)"
            />
          </div>

          <div className="form-group">
            <label><FaLock /> Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Confirm new password"
            />
          </div>

          <button type="submit" className="submit-button">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;