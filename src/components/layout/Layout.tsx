import { ReactNode, useState } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { SideNav } from './SideNav';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showNotifications?: boolean;
}

export const Layout = ({ children, title, showBack, showNotifications }: LayoutProps) => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-100">
      <SideNav isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />
      <div className="w-full">
        <Header 
          title={title} 
          showBack={showBack} 
          showNotifications={showNotifications}
          onMenuClick={() => setIsSideNavOpen(true)}
        />
        <main className="pt-16 pb-16 min-h-screen">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
};
