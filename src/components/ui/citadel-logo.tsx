import React from 'react';

export function CitadelLogo({
  className = 'h-6 w-6',
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Shield Contour */}
      <path
        d="M12 2L4 5.5V11.5C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 11.5V5.5L12 2Z"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Citadel Tower Core */}
      <path
        d="M8.5 18V10L10 10V8.5H11V10H13V8.5H14V10L15.5 10V18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Tower Spire */}
      <path
        d="M12 4.5L9.5 8H14.5L12 4.5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Blockchain Nodes & Connections */}
      <circle cx="6.5" cy="11.5" r="1" fill="currentColor" />
      <circle cx="17.5" cy="11.5" r="1" fill="currentColor" />
      <path
        d="M6.5 11.5L8.5 13M17.5 11.5L15.5 13"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="14" r="1" fill="currentColor" />
      <path
        d="M10 14H14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default CitadelLogo;
