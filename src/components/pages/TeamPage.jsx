import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import UserRoleCard from "@/components/molecules/UserRoleCard";
import InviteModal from "@/components/molecules/InviteModal";
import { userService } from "@/services/api/userService";

const TeamPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);

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

const handleInviteUser = async (userData) => {
    try {
      setInviteLoading(true);
      const newUser = await userService.create(userData);
      
      setUsers(prev => [...prev, newUser]);
      toast.success('User invited successfully');
      return true;
    } catch (err) {
      toast.error('Failed to invite user');
      return false;
    } finally {
      setInviteLoading(false);
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
          onClick={() => setShowInviteModal(true)}
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

      {filteredUsers.length === 0 ? (
        <Empty
          type="team"
          onAction={() => setShowInviteModal(true)}
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

      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSubmit={handleInviteUser}
        loading={inviteLoading}
/>
    </div>
  );
};

export default TeamPage;