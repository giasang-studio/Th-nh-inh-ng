import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Slider: React.FC<SliderProps> = (props) => {
  return (
    <input
      type="range"
      {...props}
      className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer range-lg accent-cyan-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 focus-visible:ring-cyan-500"
    />
  );
};