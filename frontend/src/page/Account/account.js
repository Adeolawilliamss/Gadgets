/* eslint-disable */
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaBriefcase,
  FaStar,
  FaCreditCard,
  FaCog,
} from 'react-icons/fa';
import axiosInstance from '../../utils/axios';

const Account = () => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photo, setPhoto] = useState(null);
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [photoPreview, setPhotoPreview] = useState(
    user?.photo ? `/img/users/${user.photo}` : null
  );
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (photo) formData.append('photo', photo);

    try {
      await axiosInstance.patch('/users/updateMe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showAlert('success', 'Profile updated successfully!');
      navigate('/account');
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Update failed');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return showAlert('error', 'Passwords do not match');
    }

    try {
      await axiosInstance.patch(
        '/users/updatePassword',
        {
          passwordCurrent,
          password,
          passwordConfirm: confirmPassword,
        },
      );
      showAlert('success', 'Password updated successfully!');
      navigate('/account');
    } catch (err) {
      showAlert(
        'error',
        err.response?.data?.message || 'Password update failed'
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Sidebar */}
      <nav className="md:w-1/4 w-full bg-white shadow rounded-xl p-4">
        <ul className="space-y-4 text-gray-700 text-lg">
          <li className="flex items-center gap-2 font-semibold bg-gray-200 rounded px-3 py-2">
            <FaCog /> Settings
          </li>
          <li className="flex items-center gap-2 hover:bg-gray-200 rounded px-3 py-2 cursor-pointer">
            <FaBriefcase /> My bookings
          </li>
          <li className="flex items-center gap-2 hover:bg-gray-200 rounded px-3 py-2 cursor-pointer">
            <FaStar /> My reviews
          </li>
          <li className="flex items-center gap-2 hover:bg-gray-200 rounded px-3 py-2 cursor-pointer">
            <FaCreditCard /> Billing
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-1 bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-6">Your Account Settings</h2>
        <form onSubmit={handleSettingsSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email Address</label>
            <input
              type="email"
              className="w-full border px-4 py-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Profile Photo</label>

            {photoPreview && (
              <div className="mb-4">
                <img
                  src={photoPreview}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover border shadow"
                />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setPhoto(file);
                  setPhotoPreview(URL.createObjectURL(file));
                }
              }}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Save Settings
          </button>
        </form>

        <hr className="my-8" />
        <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Current Password</label>
            <input
              type="password"
              className="w-full border px-4 py-2 rounded"
              value={passwordCurrent}
              onChange={(e) => setPasswordCurrent(e.target.value)}
              required
            />
            <label className="block mb-1 font-medium">New Password</label>
            <input
              type="password"
              className="w-full border px-4 py-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full border px-4 py-2 rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Save Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Account;
