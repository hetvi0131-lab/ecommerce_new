import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = ({ label, error, className, ...props }) => {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</label>}
      <input
        className={twMerge(
          'w-full px-5 py-3 bg-white border border-gray-100 rounded-2xl text-gray-900 font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-300 shadow-xl shadow-gray-100/50',
          error ? 'border-red-500 focus:ring-red-500' : '',
          className
        )}
        {...props}
      />
      {error && <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mt-1">{error}</p>}
    </div>
  );
};

export default Input;
