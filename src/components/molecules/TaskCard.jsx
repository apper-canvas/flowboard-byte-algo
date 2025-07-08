import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Avatar from '@/components/atoms/Avatar';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const TaskCard = ({ task, users = [], onClick, isDragging = false }) => {
  const assignee = users?.find(user => user.Id === task.assigneeId);
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'Clock';
      case 'low': return 'CheckCircle';
      default: return 'Circle';
    }
  };

  const parseTags = (tags) => {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  const tags = parseTags(task.Tags);

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
          <div className="flex items-center space-x-1">
            <ApperIcon 
              name={getPriorityIcon(task.priority)} 
              className={`w-4 h-4 ${
                task.priority === 'high' ? 'text-red-500' : 
                task.priority === 'medium' ? 'text-yellow-500' : 
                task.priority === 'low' ? 'text-green-500' : 'text-gray-400'
              }`}
            />
            <Badge variant={getPriorityColor(task.priority)} size="sm">
              {task.priority}
            </Badge>
          </div>
        </div>

{task.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="default"
                size="sm"
                className="text-xs bg-blue-100 text-blue-800 border border-blue-200"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge
                variant="default"
                size="sm"
                className="text-xs bg-gray-100 text-gray-600"
              >
                +{tags.length - 3}
              </Badge>
            )}
          </div>
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