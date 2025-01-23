"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { DashboardIcon, ExploreIcon, SettingsIcon } from "./MenuIcons"; // Import icons

const Title = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 24px;
  padding: 20px;
`
const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 100vh;
  background-color:rgb(58, 24, 77);
  color: white;
  position: fixed;

  @media (max-width: 768px) {
    display: none; /* Hide sidebar on mobile */
  }
`;

const SidebarList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const SidebarItem = styled.li<{ $iscurrentpage: boolean | undefined }>`
  padding: 15px;
  display: flex;
  align-items: center;
  background-color: ${({ $iscurrentpage }) => ($iscurrentpage ? " #8d54b2" : "transparent")};
  font-weight: ${({ $iscurrentpage }) => ($iscurrentpage ? "bold" : "normal")};
  &:hover {
    background-color:  #8d54b2;
  }
`;

const Icon = styled.span`
  margin-right: 10px;
`;

const Logo = styled.img`
  margin: 20px;
  height: 40px;
`;

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <SidebarContainer>
      <Link href="/" passHref>
        <Logo src="/mallowLogoWhiteTransparentBgWithText.svg" alt="MALLOW"></Logo>
      </Link>
      <SidebarList>
        <Link href="/dashboard" passHref>
          <SidebarItem $iscurrentpage={pathname === "/dashboard"}>
            <Icon>
              <DashboardIcon />
            </Icon>
            Dashboard
          </SidebarItem>
        </Link>
        <Link href="/explore" passHref>
          <SidebarItem $iscurrentpage={pathname === "/explore"}>
            <Icon>
              <ExploreIcon />
            </Icon>
            Explore
          </SidebarItem>
        </Link>
        <Link href="/settings" passHref>
          <SidebarItem $iscurrentpage={pathname === "/settings"}>
            <Icon>
              <SettingsIcon />
            </Icon>
            Settings
          </SidebarItem>
        </Link>
      </SidebarList>
    </SidebarContainer>
  );
};

export default Sidebar;
