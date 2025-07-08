import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format, parseISO, differenceInDays, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import TaskModal from "@/components/organisms/TaskModal";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { taskService } from "@/services/api/taskService";
import { taskDependencyService } from "@/services/api/taskDependencyService";
import { userService } from "@/services/api/userService";

const GanttChart = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [timelineStart, setTimelineStart] = useState(null);
  const [timelineEnd, setTimelineEnd] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksData, dependenciesData, usersData] = await Promise.all([
        taskService.getByProject(projectId),
        taskDependencyService.getAll(),
        userService.getAll()
      ]);
      
      setTasks(tasksData || []);
      setDependencies(dependenciesData || []);
      setUsers(usersData || []);
      
      // Calculate timeline range based on tasks
      if (tasksData && tasksData.length > 0) {
        const taskDates = tasksData
          .filter(task => task.due_date)
          .map(task => parseISO(task.due_date));
        
        if (taskDates.length > 0) {
          const minDate = new Date(Math.min(...taskDates));
          const maxDate = new Date(Math.max(...taskDates));
          setTimelineStart(startOfMonth(minDate));
          setTimelineEnd(endOfMonth(addDays(maxDate, 30)));
        }
      }
    } catch (error) {
      console.error('Error loading Gantt data:', error);
      setError(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const handleAddTask = () => {
    setSelectedTask(null);
    setShowTaskModal(true);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleTaskSave = async (taskData) => {
    try {
      if (selectedTask) {
        const updatedTask = await taskService.update(selectedTask.Id, taskData);
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.Id === selectedTask.Id ? updatedTask : task
          )
        );
        toast.success('Task updated successfully');
      } else {
        const newTask = await taskService.create({ ...taskData, projectId });
        setTasks(prevTasks => [...prevTasks, newTask]);
        toast.success('Task created successfully');
      }
      setShowTaskModal(false);
      setSelectedTask(null);
      loadData(); // Reload to update timeline
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task');
    }
  };

  const getTaskPosition = (task) => {
    if (!task.due_date || !timelineStart || !timelineEnd) return null;
    
    const taskDate = parseISO(task.due_date);
    const totalDays = differenceInDays(timelineEnd, timelineStart);
    const taskDays = differenceInDays(taskDate, timelineStart);
    
    return {
      left: `${(taskDays / totalDays) * 100}%`,
      width: '120px' // Fixed width for task bars
    };
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'bg-green-600';
      case 'in-progress': return 'bg-blue-600';
      case 'todo': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const renderTimelineHeader = () => {
    if (!timelineStart || !timelineEnd) return null;
    
    const days = eachDayOfInterval({ start: timelineStart, end: timelineEnd });
    const totalDays = days.length;
    
    return (
      <div className="relative h-16 bg-gray-50 border-b border-gray-200">
        <div className="flex h-full">
          {days.filter((_, index) => index % 7 === 0).map((date, index) => (
            <div
              key={date.toISOString()}
              className="border-r border-gray-300 flex items-center justify-center text-xs text-gray-600"
              style={{ width: `${(7 / totalDays) * 100}%`, minWidth: '60px' }}
            >
              {format(date, 'MMM dd')}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDependencyArrows = () => {
    return dependencies.map((dependency) => {
      const predecessorTask = tasks.find(t => t.Id === dependency.predecessor_task_id);
      const successorTask = tasks.find(t => t.Id === dependency.successor_task_id);
      
      if (!predecessorTask || !successorTask) return null;
      
      const predecessorPos = getTaskPosition(predecessorTask);
      const successorPos = getTaskPosition(successorTask);
      
      if (!predecessorPos || !successorPos) return null;
      
      // Calculate arrow position (simplified for demo)
      const predecessorIndex = tasks.findIndex(t => t.Id === predecessorTask.Id);
      const successorIndex = tasks.findIndex(t => t.Id === successorTask.Id);
      
      return (
        <svg
          key={dependency.Id}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <defs>
            <marker
              id={`arrowhead-${dependency.Id}`}
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#6B7280"
              />
            </marker>
          </defs>
          <line
            x1={`calc(${predecessorPos.left} + 120px)`}
            y1={predecessorIndex * 60 + 30}
            x2={successorPos.left}
            y2={successorIndex * 60 + 30}
            stroke="#6B7280"
            strokeWidth="2"
            markerEnd={`url(#arrowhead-${dependency.Id})`}
          />
        </svg>
      );
    });
  };

  if (loading) return <Loading message="Loading Gantt chart..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Gantt Chart</h2>
        <Button 
          onClick={handleAddTask}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          Add Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Empty 
          title="No tasks found"
          subtitle="Create your first task to see the Gantt chart"
          className="flex-1"
        />
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="min-w-full">
            {/* Timeline Header */}
            {renderTimelineHeader()}
            
            {/* Tasks and Timeline */}
            <div className="relative">
              {/* Dependency Arrows */}
              {renderDependencyArrows()}
              
              {/* Task Rows */}
              <div className="space-y-2 p-4">
                {tasks.map((task, index) => {
                  const position = getTaskPosition(task);
                  const assignee = users.find(u => u.Id === task.assignee_id);
                  
                  return (
                    <motion.div
                      key={task.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative h-12 group"
                    >
                      {/* Task Info */}
                      <div className="absolute left-0 w-80 h-full flex items-center bg-white border-r border-gray-200 pr-4">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'}
                            size="sm"
                          >
                            {task.priority}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{task.title || task.Name}</h4>
                            <p className="text-sm text-gray-500 truncate">{assignee?.Name || 'Unassigned'}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Timeline Bar */}
                      <div className="absolute left-80 right-0 h-full">
                        {position && (
                          <div
                            className={`absolute h-8 rounded cursor-pointer transition-all duration-200 hover:shadow-lg ${getStatusColor(task.status)} group-hover:brightness-110`}
                            style={{
                              left: position.left,
                              width: position.width,
                              top: '8px'
                            }}
                            onClick={() => handleTaskClick(task)}
                          >
                            <div className="h-full flex items-center px-2 text-white text-sm font-medium">
                              <span className="truncate">{task.title || task.Name}</span>
                            </div>
                            
                            {/* Task details tooltip on hover */}
                            <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                              <div>Due: {task.due_date ? format(parseISO(task.due_date), 'MMM dd, yyyy') : 'No due date'}</div>
                              <div>Status: {task.status}</div>
                              <div>Priority: {task.priority}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          users={users}
          onSave={handleTaskSave}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

export default GanttChart;