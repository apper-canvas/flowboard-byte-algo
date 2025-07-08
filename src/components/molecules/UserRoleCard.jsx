import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Avatar from '@/components/atoms/Avatar';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const UserRoleCard = ({ user, onRoleChange, currentUserRole }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'member': return 'primary';
      default: return 'default';
    }
  };

  const canEditRole = currentUserRole === 'admin' && user.role !== 'admin';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar
              src={user.avatar}
              initials={user.name.split(' ').map(n => n[0]).join('')}
              size="md"
            />
            <div>
              <h4 className="font-medium text-gray-800">{user.name}</h4>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={getRoleColor(user.role)} size="sm">
              {user.role}
            </Badge>
            {canEditRole && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRoleChange(user.Id, user.role === 'member' ? 'admin' : 'member')}
              >
                <ApperIcon name="Edit" className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default UserRoleCard;