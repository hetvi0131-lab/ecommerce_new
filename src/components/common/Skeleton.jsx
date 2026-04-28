import React from 'react';
import { twMerge } from 'tailwind-merge';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={twMerge('animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md', className)}
      {...props}
    />
  );
};

export default Skeleton;
