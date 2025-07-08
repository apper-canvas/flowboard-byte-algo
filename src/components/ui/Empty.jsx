import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No data found", 
  description = "Get started by creating your first item", 
  actionText = "Create New",
  onAction,
  icon = "Plus",
  type = 'default'
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'projects':
        return {
          title: "No projects yet",
          description: "Create your first project to start organizing your team's work",
          actionText: "Create Project",
          icon: "FolderPlus"
        };
      case 'tasks':
        return {
          title: "No tasks in this column",
          description: "Drag tasks here or create new ones to get started",
          actionText: "Add Task",
          icon: "Plus"
        };
      case 'team':
        return {
          title: "No team members",
          description: "Invite team members to collaborate on projects",
          actionText: "Invite Member",
          icon: "UserPlus"
        };
      default:
        return { title, description, actionText, icon };
    }
  };

  const content = getEmptyContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={content.icon} className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {content.title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {content.description}
      </p>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-shadow inline-flex items-center gap-2"
        >
          <ApperIcon name={content.icon} className="w-4 h-4" />
          {content.actionText}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;