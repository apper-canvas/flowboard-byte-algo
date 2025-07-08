import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Card from "@/components/atoms/Card";
import commentsData from "@/services/mockData/comments.json";
import tasksData from "@/services/mockData/tasks.json";
import projectsData from "@/services/mockData/projects.json";
import usersData from "@/services/mockData/users.json";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-500';
    if (progress >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleClick = () => {
    navigate(`/project/${project.Id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className="p-6 cursor-pointer" onClick={handleClick}>
<div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {project.Name || project.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {project.description}
            </p>
          </div>
          <Badge variant={project.status === 'active' ? 'success' : 'default'} size="sm">
            {project.status}
          </Badge>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {(project.CreatedOn || project.created_at) ? 
                format(new Date(project.CreatedOn || project.created_at), 'MMM d, yyyy') : 
                'No date'
              }
            </span>
          </div>
<div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${getProgressColor(project.progress || 0)}`}>
              {project.progress || 0}%
            </span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="avatar-stack">
            {(project.members || []).slice(0, 3).map((member, index) => (
              <Avatar
                key={member.Id || index}
                src={member.avatar}
                initials={member.name ? member.name.split(' ').map(n => n[0]).join('') : '?'}
                size="sm"
                className="avatar"
              />
            ))}
            {(project.members || []).length > 3 && (
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-600 font-medium border-2 border-white -ml-2">
                +{(project.members || []).length - 3}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Users" className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {(project.members || []).length} members
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;