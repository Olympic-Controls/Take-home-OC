import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { Sidebar } from "./components/Sidebar";
import { Toolbar } from "./components/Toolbar";
import { LiveAnnouncer } from "./components/LiveAnnouncer";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="flex items-start justify-between p-4 pb-0">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Dashboard Builder
            </h1>
            <p className="text-sm text-gray-500 mb-2">
              Drag widgets from the sidebar to build your dashboard
            </p>
          </div>
          <Toolbar onToggleSidebar={() => setSidebarOpen((o) => !o)} />
        </div>
        <Dashboard />
      </main>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <LiveAnnouncer />
    </div>
  );
}

export default App;
