import React from 'react';
import { cn } from '@/utils/cn';

const Card = React.forwardRef(({ 
  className, 
  hover = false,
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-lg shadow-card',
        hover && 'hover:shadow-lift transition-shadow duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;