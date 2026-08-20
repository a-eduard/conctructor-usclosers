import Image from "next/image";

interface USClosersLogoProps {
  className?: string;
}

export function USClosersLogo({ className = "w-8 h-8" }: USClosersLogoProps) {
  return (
    <Image 
      src="/images/usc_logo_s.png" 
      alt="US Closers Logo" 
      width={64}
      height={64}
      className={`object-contain ${className}`}
      priority
    />
  );
}