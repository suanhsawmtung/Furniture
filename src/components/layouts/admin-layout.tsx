import { AdminHeaderActions } from "@/components/admin/shared/admin-header-section";
import { Sidebar } from "@/components/layouts/sidebar";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="bg-background/80 fixed inset-0 z-40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="border-border bg-card flex items-center justify-between gap-4 border-b px-4 py-4 md:px-8 lg:hidden">
          <div className="flex items-center gap-x-2">
            <div
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="cursor-pointer"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </div>
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </div>
          <AdminHeaderActions className="flex items-center gap-x-2 md:hidden" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
