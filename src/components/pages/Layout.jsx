import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from '@/components/organisms/Header';
import Sidebar from '@/components/organisms/Sidebar';
import { projectService } from '@/services/api/projectService';
import ApperIcon from '@/components/ApperIcon';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await projectService.getAll();
        setProjects(data);
        if (data.length > 0) {
          setCurrentProject(data[0]);
        }
      } catch (err) {
        console.error('Failed to load projects:', err);
      }
    };
    
    loadProjects();
  }, []);

  const handleProjectChange = (projectId) => {
    const project = projects.find(p => p.Id === projectId);
    setCurrentProject(project);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const isProjectDetailPage = location.pathname.includes('/project/');

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <div className="flex-1 flex flex-col lg:ml-0 overflow-hidden">
        <Header
          currentProject={isProjectDetailPage ? currentProject : null}
          projects={projects}
          onProjectChange={handleProjectChange}
        />
        
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg"
        >
          <ApperIcon name="Menu" className="w-5 h-5" />
        </button>
        
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default Layout;