import React from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const Avatar = React.forwardRef(({ 
  className, 
  src, 
  alt, 
  size = 'md', 
  initials,
  ...props 
}, ref) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  if (src) {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn(
          'rounded-full object-cover',
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium',
        sizes[size],
        className
      )}
      {...props}
    >
      {initials ? (
        <span>{initials}</span>
      ) : (
        <ApperIcon name="User" className="w-1/2 h-1/2" />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;