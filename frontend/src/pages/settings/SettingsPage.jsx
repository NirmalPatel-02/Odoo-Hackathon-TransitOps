import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const STORAGE_KEY = "transitops_settings";

const DEFAULT_SETTINGS = {
  depotName: "Central Depot",
  currency: "INR",
  distanceUnit: "km",
  theme: "dark",
};

const fieldClasses =
  "w-full rounded-md border border-slate-700 bg-white/5 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-amber-500/60 focus:outline-none";

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
    setTheme(settings.theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <section className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-100">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Configure the workspace preferences for {user?.name || "your depot"}.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 rounded-md border border-slate-800 bg-[#101318] p-5">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Depot Name</label>
          <input
            className={fieldClasses}
            value={settings.depotName}
            onChange={(e) => setSettings({ ...settings, depotName: e.target.value })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Currency</label>
            <select
              className={fieldClasses}
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Distance Unit</label>
            <select
              className={fieldClasses}
              value={settings.distanceUnit}
              onChange={(e) => setSettings({ ...settings, distanceUnit: e.target.value })}
            >
              <option value="km">km</option>
              <option value="mi">mi</option>
            </select>
          </div>
        </div>

        {/* <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">Application Theme</label>
          <select
            className={fieldClasses}
            value={settings.theme}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div> */}

        <div className="flex items-center justify-between gap-3 border-t border-slate-800 pt-4">
          {/* <p className="text-sm text-slate-500">{saved ? "Preferences saved." : `Current theme: ${theme}`}</p> */}
          <button type="submit" className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-amber-500">
            Save Preferences
          </button>
        </div>
      </form>
    </section>
  );
}
