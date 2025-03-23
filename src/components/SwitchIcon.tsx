import React from "react"

const SwitchIcon = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    className={className}
    style={{ width: size, height: size }}
  >
    <path d="M7.5 3h3v18.5l-7-7h4V3zM16.5 21h-3V2.5l7 7h-4V21z" />
  </svg>
);

export default SwitchIcon
