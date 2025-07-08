import React, { useEffect, useState } from "react";
import { DndContext, DragOverlay, PointerSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import TaskModal from "@/components/organisms/TaskModal";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import TaskCard from "@/components/molecules/TaskCard";
import { taskService } from "@/services/api/taskService";
import { userService } from "@/services/api/userService";

const KanbanBoard = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-blue-500' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-500' },
    { id: 'done', title: 'Done', color: 'bg-green-500' }
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksData, usersData] = await Promise.all([
        taskService.getByProject(projectId),
        userService.getAll()
      ]);
      setTasks(tasksData || []);
      setUsers(usersData || []);
    } catch (error) {
      console.error('Error loading data:', error);
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

  const sensors = useSensors(
useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const taskId = parseInt(active.id);
    const newStatus = over.id;
    
    // Don't update if dropped in same column
    const task = tasks.find(t => t.Id === taskId);
    if (task?.status === newStatus) return;

    try {
      // Update task status
      const updatedTask = await taskService.update(taskId, { status: newStatus });

      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.Id === taskId ? { ...task, status: newStatus } : task
        )
      );

      toast.success('Task status updated successfully');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
      
      // Reload data to reset state
      loadData();
    }
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
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task');
    }
  };

  // Sortable Task Card Component
  function SortableTaskCard({ task, onClick }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: task.Id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`transition-transform ${isDragging ? 'z-50' : ''}`}
      >
        <TaskCard 
          task={task} 
          onClick={onClick}
          className="kanban-card cursor-pointer"
        />
      </div>
    )
  }

  // Droppable Column Component
  function DroppableColumn({ column, tasks: columnTasks }) {
    const taskIds = columnTasks.map(task => task.Id)

    return (
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="flex-shrink-0 w-80">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-medium text-gray-900">{column.title}</h3>
                <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
            </div>
            
            <div className="flex-1 p-4" id={column.id}>
              {columnTasks.length === 0 ? (
                <Empty 
                  title="No tasks"
                  subtitle={`No tasks in ${column.title.toLowerCase()}`}
                  className="py-8"
                />
              ) : (
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <SortableTaskCard
                      key={task.Id}
                      task={task}
                      onClick={() => handleTaskClick(task)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SortableContext>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Project Board</h2>
        <Button 
          onClick={handleAddTask}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          Add Task
        </Button>
      </div>

      {loading && <Loading message="Loading tasks..." />}
      {error && <Error message={error} onRetry={loadData} />}
      
      {!loading && !error && (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-6 p-6 min-h-full">
              {columns.map(column => {
                const columnTasks = tasks.filter(task => task.status === column.id)
                
                return (
                  <DroppableColumn
                    key={column.id}
                    column={column}
                    tasks={columnTasks}
                  />
                )
})}
            </div>
          </div>
        </DndContext>
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

export default KanbanBoard;