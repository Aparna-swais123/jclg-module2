'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { OverviewScreen } from '@/screens/OverviewScreen';
import { AttendanceScreen } from '@/screens/AttendanceScreen';
import { AssignmentsScreen } from '@/screens/AssignmentsScreen';
import { LeavesScreen } from '@/screens/LeavesScreen';
import { StudyMaterialsScreen } from '@/screens/StudyMaterialsScreen';
import { NotificationsScreen } from '@/screens/NotificationsScreen';
import { TopHeader } from '@/components/TopHeader';
import type { TabId } from '@/types';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const renderScreen = () => {
    switch (activeTab) {
      case 'overview': return <OverviewScreen />;
      case 'attendance': return <AttendanceScreen />;
      case 'assignments': return <AssignmentsScreen />;
      case 'leaves': return <LeavesScreen />;
      case 'materials': return <StudyMaterialsScreen />;
      case 'notifications': return <NotificationsScreen />;
    }
  };

  return (
    <main className="min-h-screen bg-canvas">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
      <div className="ml-[230px] flex min-h-screen flex-col">
        <TopHeader />
        <div className="flex-1 px-8 py-6">
          <div className="mx-auto max-w-7xl">{renderScreen()}</div>
        </div>
      </div>
    </main>
  );
}
