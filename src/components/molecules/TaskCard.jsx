import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Avatar from '@/components/atoms/Avatar';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const TaskCard = ({ task, users, onClick, isDragging = false }) => {
  const assignee = users.find(user => user.Id === task.assigneeId);
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <motion.div
      layout
      whileHover={{ scale: isDragging ? 1 : 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`p-4 cursor-pointer kanban-card ${isDragging ? 'rotate-2 opacity-80' : ''}`}
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-gray-800 flex-1 pr-2">
            {task.title}
          </h4>
          <Badge variant={getPriorityColor(task.priority)} size="sm">
            {task.priority}
          </Badge>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {assignee && (
              <Avatar
                src={assignee.avatar}
                initials={assignee.name.split(' ').map(n => n[0]).join('')}
                size="sm"
              />
            )}
            <div className="flex items-center space-x-1">
              <ApperIcon name="MessageCircle" className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">{task.comments.length}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ApperIcon 
              name="Calendar" 
              className={`w-4 h-4 ${isOverdue ? 'text-red-500' : 'text-gray-400'}`} 
            />
            <span className={`text-xs ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
              {format(new Date(task.dueDate), 'MMM d')}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TaskCard;