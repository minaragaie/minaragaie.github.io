import React from "react";
import { FileCode } from "lucide-react";

const Header: React.FC = () => {
  return (
    <div className="fixed w-full bg-[var(--vscode-sidebar)] border-b border-[var(--vscode-border)] px-4 py-2 flex items-center gap-4 flex-shrink-0 transition-colors duration-300 z-[9999]">
      {/* Traffic lights */}
      <div className="flex gap-2" role="group" aria-label="Window controls">
        <button
          className="w-3 h-3 bg-[#ff5f57] rounded-full"
          aria-label="Close window"
        />
        <button
          className="w-3 h-3 bg-[#ffbd2e] rounded-full"
          aria-label="Minimize window"
        />
        <button
          className="w-3 h-3 bg-[#28ca42] rounded-full"
          aria-label="Maximize window"
        />
      </div>

      {/* File info */}
      <div className="flex items-center gap-2 text-sm text-[var(--vscode-text, #ffffff)]">
        <FileCode className="w-4 h-4" aria-hidden="true" />
        <span>mina-youaness-resume.tsx</span>
        <div
          className="w-2 h-2 bg-white rounded-full"
          role="status"
          aria-label="File synced"
        />
      </div>
    </div>
  );
};

export default Header;
