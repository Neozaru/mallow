import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { DashboardIcon, ExploreIcon, SettingsIcon } from "./MenuIcons";

const BottomBarContainer = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #3a184d;
  justify-content: space-around;
  align-items: center;

  @media (max-width: 768px) {
    display: flex; /* Show bottom bar on mobile */
  }
`;

const BottomBarItem = styled(Link)<{ $iscurrentpage: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ $iscurrentpage }) => ($iscurrentpage ? "white" : "rgba(255, 255, 255, 0.7)")};
  font-weight: ${({ $iscurrentpage }) => ($iscurrentpage ? "bold" : "normal")};
  text-decoration: none;
`;

const BottomBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <BottomBarContainer>
      <BottomBarItem href="/dashboard" $iscurrentpage={pathname === "/dashboard"}>
        <DashboardIcon />
      </BottomBarItem>
      <BottomBarItem href="/explore" $iscurrentpage={pathname === "/explore"}>
        <ExploreIcon />
      </BottomBarItem>
      <BottomBarItem href="/settings" $iscurrentpage={pathname === "/settings"}>
        <SettingsIcon />
      </BottomBarItem>
    </BottomBarContainer>
  );
};

export default BottomBar;
