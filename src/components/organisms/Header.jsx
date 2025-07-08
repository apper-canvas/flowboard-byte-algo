import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { AuthContext } from '@/App';
const Header = ({ currentProject, projects, onProjectChange }) => {
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const currentUser = user || {
    name: "John Doe",
    email: "john@example.com",
    avatar: null
  };

  const handleProjectSelect = (projectId) => {
    onProjectChange(projectId);
    setShowProjectDropdown(false);
    navigate(`/project/${projectId}`);
  };

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
  };
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Layout" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">FlowBoard</h1>
          </div>

          {currentProject && (
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                className="flex items-center space-x-2"
              >
                <span>{currentProject.name}</span>
                <ApperIcon name="ChevronDown" className="w-4 h-4" />
              </Button>

              {showProjectDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[200px] z-50"
                >
                  <div className="p-2">
                    {projects.map(project => (
                      <button
                        key={project.Id}
                        onClick={() => handleProjectSelect(project.Id)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm"
                      >
                        {project.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/projects')}
          >
            <ApperIcon name="Grid3x3" className="w-4 h-4 mr-2" />
            Projects
          </Button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2"
            >
              <Avatar
                src={currentUser.avatar}
                initials={currentUser.name.split(' ').map(n => n[0]).join('')}
                size="sm"
              />
              <ApperIcon name="ChevronDown" className="w-4 h-4" />
            </button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[200px] z-50"
              >
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{currentUser.name}</p>
                    <p className="text-sm text-gray-600">{currentUser.email}</p>
                  </div>
<button
                    onClick={() => navigate('/settings')}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm flex items-center space-x-2"
                  >
                    <ApperIcon name="Settings" className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm flex items-center space-x-2 text-red-600"
                  >
                    <ApperIcon name="LogOut" className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;