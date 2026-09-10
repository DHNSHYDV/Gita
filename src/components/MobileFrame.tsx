import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#F6F1EA] dark:bg-[#141210] flex justify-center transition-colors font-sans select-none">
      <div className="w-full max-w-md min-h-screen relative flex flex-col bg-[#F6F1EA] dark:bg-[#141210]">
        {children}
      </div>
    </div>
  );
};
