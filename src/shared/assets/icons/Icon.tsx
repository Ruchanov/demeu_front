import React from 'react';

interface IconSvgProps {
  name: string;
  width?: string;
  height?: string;
  fill?: string;
  className?: string;
  color?: string;
}

const IconSvg: React.FC<IconSvgProps> = ({ name, width = '24', height = '24', fill = 'currentColor', className = '', color = '' }) => (
  <svg width={width} height={height} fill={fill} className={className}>
    <use color={color ? color : ''} xlinkHref={`#icon-${name}`} />
  </svg>
);

export default IconSvg;
