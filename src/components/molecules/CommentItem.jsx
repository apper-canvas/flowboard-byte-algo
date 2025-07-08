import { format } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';

const CommentItem = ({ comment, user }) => {
  return (
    <div className="flex space-x-3 p-3 hover:bg-gray-50 rounded-lg">
      <Avatar
        src={user?.avatar}
        initials={user?.name.split(' ').map(n => n[0]).join('')}
        size="sm"
      />
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-gray-800">{user?.name}</span>
          <span className="text-xs text-gray-500">
            {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
          </span>
        </div>
        <p className="text-gray-600 text-sm">{comment.text}</p>
      </div>
    </div>
  );
};

export default CommentItem;