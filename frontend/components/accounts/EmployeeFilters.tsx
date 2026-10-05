import { Search } from 'lucide-react';

interface EmployeeFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeTab: string;
  setActiveTab: (val: string) => void;
}

export default function EmployeeFilters({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab
}: EmployeeFiltersProps) {
  const tabs = ['Tất cả', 'Quản lý', 'Nhân viên'];

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-muted" />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-[var(--radius-control)] focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          placeholder="Tìm kiếm nhân viên (tên, tên đăng nhập, SĐT)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-[var(--radius-control)] text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-primary text-accent border border-primary'
                : 'bg-background text-muted hover:bg-surface border border-border'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
