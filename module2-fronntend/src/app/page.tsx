'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { OverviewScreen } from '@/screens/OverviewScreen';
import { AttendanceScreen } from '@/screens/AttendanceScreen';
import { AssignmentsScreen } from '@/screens/AssignmentsScreen';
import { ActivitiesScreen } from '@/screens/ActivitiesScreen';
import { LeavesScreen } from '@/screens/LeavesScreen';
import { StudyMaterialsScreen } from '@/screens/StudyMaterialsScreen';
import { NotificationsScreen } from '@/screens/NotificationsScreen';
import { AIAnalysisScreen } from '@/screens/AIAnalysisScreen';
import { TopHeader } from '@/components/TopHeader';
import type { TabId } from '@/types';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const renderScreen = () => {
    switch (activeTab) {
      case 'overview': return <OverviewScreen />;
      case 'attendance': return <AttendanceScreen />;
      case 'assignments': return <AssignmentsScreen />;
      case 'activities': return <ActivitiesScreen />;
      case 'leaves': return <LeavesScreen />;
      case 'materials': return <StudyMaterialsScreen />;
      case 'notifications': return <NotificationsScreen />;
      case 'ai-analysis': return <AIAnalysisScreen />;
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
