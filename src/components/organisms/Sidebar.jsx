import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: 'Projects', href: '/projects', icon: 'FolderOpen' },
    { name: 'Team', href: '/team', icon: 'Users' },
    { name: 'Settings', href: '/settings', icon: 'Settings' }
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Layout" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">FlowBoard</h2>
            <p className="text-sm text-gray-600">Project Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-nav-item flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary' 
                  : 'text-gray-600 hover:text-primary'
              }`
            }
          >
            <ApperIcon name={item.icon} className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>© 2024 FlowBoard</p>
          <p>Team Collaboration Made Simple</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white shadow-sm border-r border-gray-200 h-screen">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg"
          >
            <SidebarContent />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;