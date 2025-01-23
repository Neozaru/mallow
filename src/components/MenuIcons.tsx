import React from "react";

export const DashboardIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <rect width="24" height="24" fill="none" />
    <path d="M3 13h8V3H3v10zm2-8h4v6H5V5zM3 21h8v-6H3v6zm2-4h4v2H5v-2zM13 21h8v-10h-8v10zm2-8h4v6h-4v-6zM13 3v6h8V3h-8zm6 4h-4V5h4v2z" />
  </svg>
)

export const ExploreIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <rect width="24" height="24" fill="none" />
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.07 4.93-3 7a1 1 0 0 1-.54.54l-7 3 3-7a1 1 0 0 1 .54-.54l7-3zM12 14a2 2 0 1 1 2-2 2 2 0 0 1-2 2z" />
  </svg>
)

export const SettingsIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <rect width="24" height="24" fill="none" />
    <path d="M19.43 12.98a7.69 7.69 0 0 0 .07-1 7.69 7.69 0 0 0-.07-1l2.11-1.65a.5.5 0 0 0 .11-.63l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.07 7.07 0 0 0-1.73-1l-.38-2.65A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42L9.12 5.07a7.07 7.07 0 0 0-1.73 1l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .11.63l2.11 1.65a7.69 7.69 0 0 0-.07 1 7.69 7.69 0 0 0 .07 1L2.07 14.63a.5.5 0 0 0-.11.63l2 3.46a.5.5 0 0 0 .61.22l2.49-1a7.07 7.07 0 0 0 1.73 1l.38 2.65a.5.5 0 0 0 .5.42h4a.5.5 0 0 0 .5-.42l.38-2.65a7.07 7.07 0 0 0 1.73-1l2.49 1a.5.5 0 0 0 .61-.22l2-3.46a.5.5 0 0 0-.11-.63zM12 15.5a3.5 3.5 0 1 1 3.5-3.5 3.5 3.5 0 0 1-3.5 3.5z" />
  </svg>
)
