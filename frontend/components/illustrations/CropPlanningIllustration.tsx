export default function CropPlanningIllustration() {
  return (
    <svg
      width="180"
      height="140"
      viewBox="0 0 180 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      {/* Calendar Base */}
      <rect
        x="30"
        y="20"
        width="120"
        height="100"
        rx="8"
        fill="#F0FDF4"
        stroke="#22C55E"
        strokeWidth="2"
      />
      
      {/* Calendar Header */}
      <rect
        x="30"
        y="20"
        width="120"
        height="25"
        rx="8"
        fill="#22C55E"
      />
      
      {/* Calendar Rings */}
      <circle cx="50" cy="32.5" r="4" fill="#DCFCE7" />
      <circle cx="90" cy="32.5" r="4" fill="#DCFCE7" />
      <circle cx="130" cy="32.5" r="4" fill="#DCFCE7" />
      
      {/* Calendar Grid */}
      <line x1="45" y1="60" x2="65" y2="60" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
      <line x1="75" y1="60" x2="95" y2="60" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
      <line x1="105" y1="60" x2="125" y2="60" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
      
      <line x1="45" y1="75" x2="65" y2="75" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
      <line x1="75" y1="75" x2="95" y2="75" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
      <line x1="105" y1="75" x2="125" y2="75" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
      
      <line x1="45" y1="90" x2="65" y2="90" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
      <line x1="75" y1="90" x2="95" y2="90" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
      <line x1="105" y1="90" x2="125" y2="90" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
      
      {/* Crop Icons on Calendar */}
      {/* Plant 1 */}
      <g transform="translate(52, 52)">
        <path
          d="M0 12 Q-3 8 -3 5 Q-3 2 0 0"
          stroke="#EAB308"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M0 12 Q3 8 3 5 Q3 2 0 0"
          stroke="#EAB308"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <line x1="0" y1="0" x2="0" y2="12" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
      </g>
      
      {/* Plant 2 */}
      <g transform="translate(82, 67)">
        <circle cx="0" cy="0" r="3" fill="#EAB308" opacity="0.8" />
        <circle cx="-4" cy="2" r="2.5" fill="#EAB308" opacity="0.6" />
        <circle cx="4" cy="2" r="2.5" fill="#EAB308" opacity="0.6" />
        <line x1="0" y1="3" x2="0" y2="10" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
      </g>
      
      {/* Plant 3 */}
      <g transform="translate(112, 82)">
        <path
          d="M0 10 Q-2 6 -2 3 Q-2 1 0 0"
          stroke="#EAB308"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M0 10 Q2 6 2 3 Q2 1 0 0"
          stroke="#EAB308"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <line x1="0" y1="0" x2="0" y2="10" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
      </g>
      
      {/* Checkmark on one date */}
      <g transform="translate(52, 85)">
        <circle cx="0" cy="0" r="6" fill="#22C55E" opacity="0.2" />
        <path
          d="M-2 0 L-1 2 L2 -2"
          stroke="#22C55E"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      
      {/* Decorative elements */}
      <circle cx="20" cy="30" r="3" fill="#FEF08A" opacity="0.6" />
      <circle cx="160" cy="40" r="4" fill="#FEF08A" opacity="0.5" />
      <circle cx="25" cy="100" r="2.5" fill="#86EFAC" opacity="0.6" />
      <circle cx="155" cy="110" r="3.5" fill="#86EFAC" opacity="0.5" />
    </svg>
  );
}
