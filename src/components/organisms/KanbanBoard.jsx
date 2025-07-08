import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
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
import { userService } from "@/services/api/userService";
import { taskService } from "@/services/api/taskService";

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

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksData, usersData] = await Promise.all([
        taskService.getByProject(projectId),
        userService.getAll()
      ]);
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

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    try {
      const taskId = parseInt(draggableId);
      const newStatus = destination.droppableId;
      
      await taskService.update(taskId, { status: newStatus });
      
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.Id === taskId ? { ...task, status: newStatus } : task
        )
      );
      
      toast.success('Task status updated successfully');
    } catch (err) {
      toast.error('Failed to update task status');
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
    } catch (err) {
      toast.error('Failed to save task');
    }
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setShowTaskModal(true);
  };

  if (loading) return <Loading type="kanban" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Kanban Board</h2>
        <Button onClick={handleAddTask}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => {
            const columnTasks = tasks.filter(task => task.status === column.id);
            
            return (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${column.color}`} />
                      <h3 className="font-semibold text-gray-800">{column.title}</h3>
                      <span className="text-sm text-gray-500">({columnTasks.length})</span>
                    </div>
</div>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="p-4 min-h-[500px]"
                      >
                        {columnTasks.length === 0 ? (
                          <Empty
                            type="tasks"
                            onAction={handleAddTask}
                          />
                        ) : (
                          <div className="space-y-3">
                            {columnTasks.map((task, index) => (
                              <Draggable
                                key={task.Id}
                                draggableId={task.Id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <TaskCard
                                      task={task}
                                      users={users}
                                      onClick={() => handleTaskClick(task)}
                                      isDragging={snapshot.isDragging}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card>
              </motion.div>
          })}
        </div>
      </DragDropContext>

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