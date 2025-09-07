// AiLearningIcon.jsx
import React from 'react';

const AiLearningIcon = ({ width = 200, height = 200 }) => {
  return (
    <div>
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transition: 'transform 0.3s ease' }}
        className="ai-icon"
      >
        <style>{`
          .ai-icon:hover { transform: scale(1.05); }
          .neural-node { animation: pulse 2s ease-in-out infinite; }
          .connection-line { animation: flow 3s ease-in-out infinite; }
          .brain-wave { animation: wave 2.5s ease-in-out infinite; }
          @keyframes pulse {
            0%,100% { opacity: 0.8; }
            50% { opacity: 1; }
          }
          @keyframes flow {
            0%,100% { stroke-dashoffset: 20; }
            50% { stroke-dashoffset: 0; }
          }
          @keyframes wave {
            0%,100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
        `}</style>

        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="rgba(99,102,241,0.2)"
          strokeWidth="2"
        />

        {/* Neural network connections */}
        <g className="connections">
          <line
            className="connection-line"
            x1="60"
            y1="80"
            x2="140"
            y2="120"
            stroke="#6366f1"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.6"
          />
          <line
            className="connection-line"
            x1="80"
            y1="60"
            x2="120"
            y2="140"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.6"
          />
          <line
            className="connection-line"
            x1="140"
            y1="80"
            x2="60"
            y2="120"
            stroke="#06b6d4"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.6"
          />
          <line
            className="connection-line"
            x1="100"
            y1="50"
            x2="100"
            y2="150"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.6"
          />
        </g>

        {/* Central brain/processor */}
        <g className="brain-wave">
          <path
            d="M70 100 Q85 85 100 100 T130 100"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M75 110 Q90 95 105 110 T135 110"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Neural nodes */}
        <circle className="neural-node" cx="60" cy="80" r="8" fill="#6366f1" />
        <circle className="neural-node" cx="140" cy="80" r="8" fill="#8b5cf6" />
        <circle className="neural-node" cx="80" cy="60" r="6" fill="#06b6d4" />
        <circle className="neural-node" cx="120" cy="60" r="6" fill="#10b981" />
        <circle className="neural-node" cx="60" cy="120" r="6" fill="#f59e0b" />
        <circle className="neural-node" cx="140" cy="120" r="6" fill="#ef4444" />
        <circle className="neural-node" cx="80" cy="140" r="8" fill="#8b5cf6" />
        <circle className="neural-node" cx="120" cy="140" r="8" fill="#06b6d4" />

        {/* Central CPU */}
        <rect
          x="85"
          y="85"
          width="30"
          height="30"
          rx="6"
          fill="rgba(255,255,255,0.1)"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <circle cx="100" cy="100" r="4" fill="#e2e8f0" />

        {/* Data flow */}
        <g className="data-flow">
          <circle cx="100" cy="30" r="3" fill="#6366f1" opacity="0.8">
            <animate attributeName="cy" values="30;170;30" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="30" cy="100" r="3" fill="#8b5cf6" opacity="0.8">
            <animate attributeName="cx" values="30;170;30" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="170" cy="100" r="3" fill="#06b6d4" opacity="0.8">
            <animate attributeName="cx" values="170;30;170" dur="3.8s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
};

export default AiLearningIcon;
