import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import GanttChart from "@/components/organisms/GanttChart";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import FilterBar from "@/components/molecules/FilterBar";
import { projectService } from "@/services/api/projectService";
import { userService } from "@/services/api/userService";
import { taskService } from "@/services/api/taskService";
const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAssignee, setSelectedAssignee] = useState('all');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'gantt'
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectData, tasksData, usersData] = await Promise.all([
        projectService.getById(parseInt(projectId)),
        taskService.getByProject(parseInt(projectId)),
        userService.getAll()
      ]);
      
      setProject(projectData);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const clearFilters = () => {
    setSelectedStatus('all');
    setSelectedAssignee('all');
  };

  const hasActiveFilters = selectedStatus !== 'all' || selectedAssignee !== 'all';

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'done').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const todo = tasks.filter(task => task.status === 'todo').length;
    
    return { total, completed, inProgress, todo };
  };

  if (loading) return <Loading type="kanban" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!project) return <Error message="Project not found" />;

  const stats = getTaskStats();

  return (
    <div className="h-full">
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
<div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="px-3 py-1.5"
              >
                <ApperIcon name="Layout" className="w-4 h-4 mr-2" />
                Kanban
              </Button>
              <Button
                variant={viewMode === 'gantt' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('gantt')}
                className="px-3 py-1.5"
              >
                <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                Gantt
              </Button>
            </div>
            <Badge variant="success" size="sm">
              {project.status}
            </Badge>
            <Button variant="outline" size="sm">
              <ApperIcon name="Settings" className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Layout" className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">To Do</p>
                <p className="text-2xl font-bold text-gray-800">{stats.todo}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Circle" className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-800">{stats.inProgress}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="w-5 h-5 text-white" />
              </div>
            </div>
</Card>
        </div>
      </div>
      
      {viewMode === 'kanban' && (
        <>
          <div className="p-6">
            <FilterBar
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedAssignee={selectedAssignee}
              onAssigneeChange={setSelectedAssignee}
users={users}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
          <KanbanBoard projectId={parseInt(projectId)} />
        </>
      )}

      {viewMode === 'gantt' && (
        <GanttChart projectId={parseInt(projectId)} />
      )}
    </div>
  );
};

export default ProjectDetailPage;