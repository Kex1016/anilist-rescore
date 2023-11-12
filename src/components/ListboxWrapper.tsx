import React from "react";

type ListboxProps = {
  children: React.ReactNode;
};

export const ListboxWrapper: React.FC<ListboxProps> = ({ children }) => (
  <div className="w-full max-w-[260px] min-w-[260px] p-1 rounded-small bg-default">
    {children}
  </div>
);
