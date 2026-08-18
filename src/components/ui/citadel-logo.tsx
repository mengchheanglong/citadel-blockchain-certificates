import React from 'react';
import Image from 'next/image';

interface CitadelLogoProps {
  className?: string;
  size?: number;
}

export function CitadelLogo({
  className = 'h-11 w-11',
  size = 56,
}: CitadelLogoProps) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <Image
        src="/citadel-logo.png"
        alt="Citadel Emblem"
        width={size * 2}
        height={size * 2}
        className="h-full w-full object-contain filter drop-shadow-sm transition-transform hover:scale-105"
        priority
        unoptimized
      />
    </div>
  );
}

export default CitadelLogo;
