import React from "react";

export const DashboardIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg
    viewBox="0 0 17 17"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
  >
    <rect width="17" height="17" fill="none" />
    <path d="M17 11.5v0.5h-6.168v-1h5.152c-0.112-1.692-0.789-3.231-1.842-4.434l-0.806 0.806-0.707-0.707 
      0.802-0.802c-1.202-1.053-2.74-1.726-4.431-1.839v2.976h-1v-2.976c-1.691 0.113-3.229 0.786-4.43 
      1.839l0.796 0.796-0.707 0.707-0.8-0.8c-1.053 1.203-1.731 2.742-1.842 4.434h5.171v1h-6.188v-0.5c0-4.687 
      3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5zM10.5 11.5c0 1.103-0.897 2-2 2s-2-0.897-2-2c0-0.644 0.311-1.21 
      0.784-1.577l-2.082-3.63 0.867-0.497 2.141 3.733c0.095-0.014 0.19-0.029 0.29-0.029 1.103 0 2 0.897 
      2 2zM9.5 11.5c0-0.551-0.449-1-1-1s-1 0.449-1 1 0.449 1 1 1 1-0.449 1-1z" />
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

export const SwapIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 92 92"
    width={size}
    height={size}
    fill={color}
  >
    <rect width="92" height="92" fill="none" />
    <path d="M92,55.5c0,1.1-0.4,2.1-1.2,2.8L72.2,76.9c-0.8,0.8-1.8,1.1-2.8,1.1c-1,0-2.1-0.5-2.8-1.2
      c-1.6-1.6-1.6-4.2,0-5.8l11.7-12H39.2c-2.2,0-4-1.8-4-4s1.8-4,4-4h39.1L66.6,39.5c-1.6-1.6-1.6-3.9,0-5.4
      c1.6-1.6,4.1-1.6,5.7,0l18.6,18.6C91.6,53.4,92,54.4,92,55.5z M13.7,41h39.1c2.2,0,4-1.8,4-4s-1.8-4-4-4H13.7
      l11.7-12c1.6-1.6,1.6-4.2,0-5.8s-4.1-1.6-5.7-0.1L1.2,33.7C0.4,34.4,0,35.4,0,36.5s0.4,2.1,1.2,2.8l18.6,18.6
      c0.8,0.8,1.8,1.2,2.8,1.2c1,0,2.1-0.4,2.8-1.2c1.6-1.6,1.6-3.9,0-5.4L13.7,41z"/>
  </svg>)

export const ProIcon = ({ size = 24, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <rect width="24" height="24" fill="none" />
    <path d="M3 13h8V3H3v10zm2-8h4v6H5V5zM3 21h8v-6H3v6zm2-4h4v2H5v-2zM13 21h8v-10h-8v10zm2-8h4v6h-4v-6zM13 3v6h8V3h-8zm6 4h-4V5h4v2z" />
  </svg>
)
