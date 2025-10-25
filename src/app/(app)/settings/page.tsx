'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

interface UserSettings {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  theme: string;
  notifications: boolean;
  role: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { theme: currentTheme, effectiveTheme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  
  const [settings, setSettings] = useState<UserSettings>({
    id: '',
    name: '',
    email: '',
    phone: '',
    avatar: '',
    theme: 'light',
    notifications: true,
    role: 'ADMIN',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const result = await response.json();
        setSettings(result.data);
        setAvatarPreview(result.data.avatar || '');
        setTheme(result.data.theme || 'light');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }, [setTheme]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Sync theme from context to settings
  useEffect(() => {
    setSettings(prev => ({ ...prev, theme: currentTheme }));
  }, [currentTheme]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // Handle theme change immediately
    if (name === 'theme') {
      const newTheme = value as 'light' | 'dark' | 'system';
      setTheme(newTheme); // Apply theme instantly
      setSettings(prev => ({ ...prev, theme: newTheme }));
      // Auto-save theme preference
      saveThemePreference(newTheme);
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const saveThemePreference = async (theme: string) => {
    try {
      const formData = new FormData();
      formData.append('name', settings.name);
      formData.append('email', settings.email);
      formData.append('phone', settings.phone);
      formData.append('theme', theme);
      formData.append('notifications', settings.notifications.toString());
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await fetch('/api/settings', {
        method: 'PUT',
        body: formData,
      });
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', settings.name);
      formData.append('email', settings.email);
      formData.append('phone', settings.phone);
      formData.append('theme', settings.theme);
      formData.append('notifications', settings.notifications.toString());
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await fetch('/api/settings', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        fetchSettings();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        alert('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Dashboard / Settings</div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">SETTINGS</h1>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 transition-colors duration-300">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                aria-label="Profile Settings Tab"
              >
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                aria-label="Security Tab"
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'preferences'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                aria-label="Preferences Tab"
              >
                Preferences
              </button>
            </nav>
          </div>

          {/* Profile Settings Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="p-6">
              <div className="space-y-6">
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="Profile"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400 dark:text-gray-500">
                          👤
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="avatar"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        aria-label="Upload profile picture"
                      />
                      <label
                        htmlFor="avatar"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer inline-block transition-colors"
                      >
                        Change Picture
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        JPG, PNG or GIF. Max size 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={settings.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={settings.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={settings.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Role (Read-only) */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    value={settings.role}
                    disabled
                    aria-label="User role (read-only)"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-500 dark:text-gray-400"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={fetchSettings}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordUpdate} className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Change Password</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Ensure your account is using a long, random password to stay secure.
                  </p>
                </div>

                {/* Current Password */}
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Enter current password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={8}
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Must be at least 8 characters long
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <form onSubmit={handleProfileUpdate} className="p-6">
              <div className="space-y-6">
                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Theme Preference
                  </label>
                  <div className="space-y-3">
                    {/* Light Mode */}
                    <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      settings.theme === 'light'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}>
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        checked={settings.theme === 'light'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600"
                        aria-label="Light mode theme"
                      />
                      <span className="text-2xl">☀️</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Light Mode
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Use light colors for all pages
                        </div>
                      </div>
                      {settings.theme === 'light' && (
                        <div className="text-blue-600 dark:text-blue-400">✓</div>
                      )}
                    </label>

                    {/* Dark Mode */}
                    <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      settings.theme === 'dark'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}>
                      <input
                        type="radio"
                        name="theme"
                        value="dark"
                        checked={settings.theme === 'dark'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600"
                        aria-label="Dark mode theme"
                      />
                      <span className="text-2xl">🌙</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Dark Mode
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Use dark colors for all pages
                        </div>
                      </div>
                      {settings.theme === 'dark' && (
                        <div className="text-blue-600 dark:text-blue-400">✓</div>
                      )}
                    </label>

                    {/* System Mode */}
                    <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      settings.theme === 'system'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}>
                      <input
                        type="radio"
                        name="theme"
                        value="system"
                        checked={settings.theme === 'system'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600"
                        aria-label="System default theme"
                      />
                      <span className="text-2xl">💻</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          System Default
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Automatically switch based on system settings
                        </div>
                      </div>
                      {settings.theme === 'system' && (
                        <div className="text-blue-600 dark:text-blue-400">✓</div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Current Theme Indicator */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {effectiveTheme === 'light' ? '☀️' : '🌙'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Currently using: {effectiveTheme} mode
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Theme changes apply immediately and are saved automatically
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={settings.notifications}
                      onChange={handleInputChange}
                      className="mr-3 rounded w-4 h-4 text-blue-600"
                      aria-label="Enable notifications"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Enable Notifications
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Receive notifications about updates and activities
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          2020 © Wezant. Design & Develop by ❤️ Zenoids
        </div>
      </div>
    </div>
  );
}
