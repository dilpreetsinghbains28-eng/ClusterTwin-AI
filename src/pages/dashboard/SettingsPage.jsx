import { useState } from 'react';
import ActionModal from '../../components/ui/ActionModal';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '' });

  const tabs = ['Profile', 'Security', 'Notifications', 'Theme', 'Language', 'IoT Settings'];

  const handleAction = (title, message) => {
    setModalState({ isOpen: true, title, message });
  };

  const handleSave = (e) => {
    e.preventDefault();
    handleAction('Settings Saved', `Your ${activeTab.toLowerCase()} preferences have been successfully updated.`);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    handleAction('Changes Discarded', `Your unsaved changes for ${activeTab.toLowerCase()} have been discarded.`);
  };

  const handleReset = (e) => {
    e.preventDefault();
    handleAction('Settings Reset', `All your ${activeTab.toLowerCase()} preferences have been reset to default.`);
  };

  return (
    <>
      <div className="w-full flex flex-col gap-8">
        <header className="flex flex-col gap-2 border-b border-outline-variant/30 pb-6">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Settings</h1>
          <p className="font-body-base text-on-surface-variant">Manage your account, security, and IoT connection preferences.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Nav */}
          <nav className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-4 py-3 rounded-lg font-label-mono text-sm transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface border border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Content Area */}
          <div className="flex-1 surface-glass p-6 md:p-8 rounded-xl border border-outline-variant/30 min-h-[500px] flex flex-col">
            <h2 className="font-headline-md text-2xl text-on-surface mb-6 border-b border-outline-variant/30 pb-4">{activeTab}</h2>
            
            <form className="flex flex-col gap-6 flex-1" onSubmit={handleSave}>
              {activeTab === 'Profile' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="font-label-mono text-xs uppercase text-on-surface-variant">First Name</label>
                      <input type="text" defaultValue="John" className="bg-surface-variant border border-outline-variant/50 rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label-mono text-xs uppercase text-on-surface-variant">Last Name</label>
                      <input type="text" defaultValue="Doe" className="bg-surface-variant border border-outline-variant/50 rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-mono text-xs uppercase text-on-surface-variant">Email Address</label>
                    <input type="email" defaultValue="operator@cluster.ai" className="bg-surface-variant border border-outline-variant/50 rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                </>
              )}

              {activeTab === 'Security' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-mono text-xs uppercase text-on-surface-variant">Current Password</label>
                    <input type="password" placeholder="••••••••" className="bg-surface-variant border border-outline-variant/50 rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-mono text-xs uppercase text-on-surface-variant">New Password</label>
                    <input type="password" placeholder="••••••••" className="bg-surface-variant border border-outline-variant/50 rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-mono text-xs uppercase text-on-surface-variant">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="bg-surface-variant border border-outline-variant/50 rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                </div>
              )}

              {activeTab === 'Notifications' && (
                <div className="flex flex-col gap-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-outline-variant/50 text-primary focus:ring-primary bg-surface-variant" />
                    <span className="text-body-base text-on-surface group-hover:text-primary transition-colors">Email Alerts for Critical Warnings</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-outline-variant/50 text-primary focus:ring-primary bg-surface-variant" />
                    <span className="text-body-base text-on-surface group-hover:text-primary transition-colors">SMS Notifications for Factory Downtime</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-outline-variant/50 text-primary focus:ring-primary bg-surface-variant" />
                    <span className="text-body-base text-on-surface group-hover:text-primary transition-colors">Weekly Diagnostic Reports</span>
                  </label>
                </div>
              )}

              {activeTab === 'Theme' && (
                <div className="flex flex-col gap-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="theme" defaultChecked className="w-5 h-5 text-primary focus:ring-primary bg-surface-variant border-outline-variant/50" />
                    <span className="text-body-base text-on-surface group-hover:text-primary transition-colors">Dark Mode (Default)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="theme" className="w-5 h-5 text-primary focus:ring-primary bg-surface-variant border-outline-variant/50" />
                    <span className="text-body-base text-on-surface group-hover:text-primary transition-colors">Light Mode</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="theme" className="w-5 h-5 text-primary focus:ring-primary bg-surface-variant border-outline-variant/50" />
                    <span className="text-body-base text-on-surface group-hover:text-primary transition-colors">System Preferences</span>
                  </label>
                </div>
              )}

              {activeTab === 'Language' && (
                <div className="flex flex-col gap-2">
                  <label className="font-label-mono text-xs uppercase text-on-surface-variant">System Language</label>
                  <select className="bg-surface-variant border border-outline-variant/50 rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer">
                    <option value="en">English (US)</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文 (Mandarin)</option>
                  </select>
                </div>
              )}

              {activeTab === 'IoT Settings' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-mono text-xs uppercase text-on-surface-variant">Telemetry Polling Interval (ms)</label>
                    <input type="number" defaultValue={500} className="bg-surface-variant border border-outline-variant/50 rounded px-4 py-2 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-outline-variant/50 text-primary focus:ring-primary bg-surface-variant" />
                    <span className="text-body-base text-on-surface group-hover:text-primary transition-colors">Enable Edge-node Analytics processing</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-outline-variant/50 text-primary focus:ring-primary bg-surface-variant" />
                    <span className="text-body-base text-on-surface group-hover:text-primary transition-colors">Auto-reconnect on socket drop</span>
                  </label>
                </div>
              )}

              <div className="flex justify-between items-center mt-auto pt-6 border-t border-outline-variant/30">
                <button type="button" onClick={handleReset} className="px-6 py-2 rounded font-label-mono text-sm border border-error/50 text-error hover:bg-error/10 transition-all cursor-pointer">Reset Defaults</button>
                <div className="flex gap-4">
                  <button type="button" onClick={handleCancel} className="px-6 py-2 rounded font-label-mono text-sm border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all cursor-pointer">Cancel</button>
                  <button type="submit" className="px-6 py-2 rounded font-label-mono text-sm primary-gradient text-on-primary font-bold hover:shadow-[0_0_15px_rgba(107,216,203,0.5)] transition-all cursor-pointer">Save Changes</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ActionModal 
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={() => {}}
      />
    </>
  );
}
