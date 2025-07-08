import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const SettingsPage = () => {
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    notifications: {
      email: true,
      push: true,
      taskUpdates: true,
      comments: true
    }
  });

  const [projectSettings, setProjectSettings] = useState({
    defaultView: 'kanban',
    autoAssign: false,
    dueDateReminders: true
  });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      // Mock save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handleProjectSettingsSave = async (e) => {
    e.preventDefault();
    try {
      // Mock save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Project settings updated successfully');
    } catch (err) {
      toast.error('Failed to update project settings');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="User" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
                <p className="text-gray-600">Update your personal information</p>
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>
              <Button type="submit" className="w-full">
                Save Profile
              </Button>
            </form>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Bell" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                <p className="text-gray-600">Manage your notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={profileData.notifications.email}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, email: e.target.checked }
                  }))}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Push Notifications</p>
                  <p className="text-sm text-gray-600">Receive push notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={profileData.notifications.push}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, push: e.target.checked }
                  }))}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Task Updates</p>
                  <p className="text-sm text-gray-600">Notify when tasks are updated</p>
                </div>
                <input
                  type="checkbox"
                  checked={profileData.notifications.taskUpdates}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, taskUpdates: e.target.checked }
                  }))}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Comments</p>
                  <p className="text-sm text-gray-600">Notify when someone comments</p>
                </div>
                <input
                  type="checkbox"
                  checked={profileData.notifications.comments}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, comments: e.target.checked }
                  }))}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Settings" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Project Settings</h2>
                <p className="text-gray-600">Configure project defaults</p>
              </div>
            </div>

            <form onSubmit={handleProjectSettingsSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default View
                </label>
                <select
                  value={projectSettings.defaultView}
                  onChange={(e) => setProjectSettings(prev => ({ ...prev, defaultView: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="kanban">Kanban Board</option>
                  <option value="list">List View</option>
                  <option value="calendar">Calendar View</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Auto-assign Tasks</p>
                  <p className="text-sm text-gray-600">Automatically assign tasks to team members</p>
                </div>
                <input
                  type="checkbox"
                  checked={projectSettings.autoAssign}
                  onChange={(e) => setProjectSettings(prev => ({ ...prev, autoAssign: e.target.checked }))}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Due Date Reminders</p>
                  <p className="text-sm text-gray-600">Send reminders for upcoming due dates</p>
                </div>
                <input
                  type="checkbox"
                  checked={projectSettings.dueDateReminders}
                  onChange={(e) => setProjectSettings(prev => ({ ...prev, dueDateReminders: e.target.checked }))}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>

              <Button type="submit" className="w-full">
                Save Settings
              </Button>
            </form>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Shield" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Security</h2>
                <p className="text-gray-600">Manage your account security</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                <ApperIcon name="Key" className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full">
                <ApperIcon name="Smartphone" className="w-4 h-4 mr-2" />
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full">
                <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;