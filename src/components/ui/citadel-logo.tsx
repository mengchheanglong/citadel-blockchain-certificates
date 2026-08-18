import React from 'react';
import Image from 'next/image';

interface CitadelLogoProps {
  className?: string;
  size?: number;
}

export function CitadelLogo({
  className = 'h-9 w-9',
  size = 36,
}: CitadelLogoProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg shadow-sm border border-slate-100 flex items-center justify-center bg-white ${className}`}>
      <Image
        src="/citadel-logo.jpg"
        alt="Citadel Logo"
        width={size * 2}
        height={size * 2}
        className="h-full w-full object-cover"
        priority
      />
    </div>
  );
}

export default CitadelLogo;
