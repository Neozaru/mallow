"use client";

import BottomBar from './BottomBar'
import Sidebar from './Sidebar'
import styled from 'styled-components'

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Full height for layout */
  background-color: rgb(30, 9, 63);
`;

const Content = styled.div`
  padding-left: 250px;
  width: 100%;
  max-width: 1024px;
  align: center;
  margin: auto;
  margin-bottom: 0;
  margin-top: 0;

  @media (max-width: 768px) {
    padding-left: 0px;
    margin-left: 0; /* Remove left margin on mobile */
    margin-bottom: 60px; /* Leave space for BottomBar */
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <LayoutContainer>
    <Sidebar />
    <Content>{children}</Content>
    <BottomBar />
  </LayoutContainer>
);

export default Layout;
