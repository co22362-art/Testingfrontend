import { HTMLAttributes, ImgHTMLAttributes } from 'react';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface PAAvatarProps extends HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
  initials?: string;
  color?: string;
  src?: string;
  alt?: string;
  className?: string;
}

export default function PAAvatar({ 
  size = 'md',
  initials,
  color = '#1976D2',
  src,
  alt,
  className = '',
  ...props 
}: PAAvatarProps) {
  const sizeStyles: Record<AvatarSize, string> = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  };

  const baseStyles = 'rounded-full flex items-center justify-center font-semibold text-white';

  if (src) {
    return (
      <img 
        src={src} 
        alt={alt || 'Avatar'}
        className={`${baseStyles} ${sizeStyles[size]} object-cover ${className}`}
        {...(props as ImgHTMLAttributes<HTMLImageElement>)}
      />
    );
  }

  return (
    <div 
      className={`${baseStyles} ${sizeStyles[size]} ${className}`}
      style={{ backgroundColor: color }}
      {...props}
    >
      {initials}
    </div>
  );
}
