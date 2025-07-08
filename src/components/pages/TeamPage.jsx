import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import UserRoleCard from '@/components/molecules/UserRoleCard';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Empty from '@/components/ui/Empty';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { userService } from '@/services/api/userService';
import ApperIcon from '@/components/ApperIcon';

const TeamPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member'
  });

  const currentUserRole = 'admin'; // Mock current user role

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleInviteUser = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    try {
      const newUser = await userService.create({
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role
      });
      
      setUsers(prev => [...prev, newUser]);
      setFormData({ name: '', email: '', role: 'member' });
      setShowInviteForm(false);
      toast.success('User invited successfully');
    } catch (err) {
      toast.error('Failed to invite user');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const updatedUser = await userService.update(userId, { role: newRole });
      setUsers(prev => prev.map(user => 
        user.Id === userId ? updatedUser : user
      ));
      toast.success('User role updated successfully');
    } catch (err) {
      toast.error('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadUsers} />;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Team</h1>
          <p className="text-gray-600 mt-1">Manage team members and their roles</p>
        </div>
        <Button
          onClick={() => setShowInviteForm(true)}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="UserPlus" className="w-4 h-4" />
          <span>Invite Member</span>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <ApperIcon name="Search" className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {showInviteForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-card p-6 mb-6"
        >
          <form onSubmit={handleInviteUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter member name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter member email"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowInviteForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Send Invitation
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {filteredUsers.length === 0 ? (
        <Empty
          type="team"
          onAction={() => setShowInviteForm(true)}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <UserRoleCard
                user={user}
                onRoleChange={handleRoleChange}
                currentUserRole={currentUserRole}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TeamPage;