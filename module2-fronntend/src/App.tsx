import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { OverviewScreen } from '@/screens/OverviewScreen';
import { AttendanceScreen } from '@/screens/AttendanceScreen';
import { AssignmentsScreen } from '@/screens/AssignmentsScreen';
import { LeavesScreen } from '@/screens/LeavesScreen';
import { StudyMaterialsScreen } from '@/screens/StudyMaterialsScreen';
import { NotificationsScreen } from '@/screens/NotificationsScreen';
import type { TabId } from '@/types';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const renderScreen = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewScreen />;
      case 'attendance':
        return <AttendanceScreen />;
      case 'assignments':
        return <AssignmentsScreen />;
      case 'leaves':
        return <LeavesScreen />;
      case 'materials':
        return <StudyMaterialsScreen />;
      case 'notifications':
        return <NotificationsScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
      <div className="ml-[230px] min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {renderScreen()}
        </div>
      </div>
    </div>
  );
}

export default App;
