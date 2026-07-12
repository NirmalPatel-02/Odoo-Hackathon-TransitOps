import { useState, useEffect, useMemo } from 'react';

// Custom inline SVG icons for styling without package installation friction
const Icons = {
  Truck: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  ),
  Route: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  ),
  Clock: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Users: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  AlertTriangle: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  DollarSign: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2-1.343-2-3-2m0 8c1.11 0 2.08.402 2.599 1M12 16v1" />
    </svg>
  ),
  Settings: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Shield: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  BatteryCharging: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Download: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  Filter: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  Search: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Plus: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Fuel: ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19V5" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Close: ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l18 18" />
    </svg>
  ),
  Check: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  Calendar: ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
};

// Initial static dataset
const INITIAL_ALERTS = [
  { id: 1, type: 'critical', vehicle: 'Truck #402', message: 'Engine Temperature at 104°C. Thermal threshold exceeded.', time: '10m ago' },
  { id: 2, type: 'warning', vehicle: 'Bus #108', message: 'Front brake wear threshold at 88%. Scheduled replacement.', time: '1h ago' },
  { id: 3, type: 'critical', driver: 'Alex Rivera', message: 'CDL Class A Permit expires in 2 days (July 14). Action required.', time: '2h ago' },
  { id: 4, type: 'warning', vehicle: 'EV Van #09', message: 'Battery Cell #4 imbalance detected during rapid charging cycle.', time: '4h ago' },
  { id: 5, type: 'info', vehicle: 'Truck #204', message: 'DMV Cargo Hauling Permit renewal submission complete.', time: '1d ago' }
];

const INITIAL_TRIPS = [
  { id: 'T-2094', driver: 'Sarah Jenkins', vehicle: 'HD Truck #402', type: 'Heavy Duty', route: 'Chicago Hub ➔ Detroit Terminal', status: 'En Route', progress: 68, eta: '14:45', priority: 'High', delay: 0 },
  { id: 'T-2095', driver: 'Marcus Vance', vehicle: 'EV Van #09', type: 'Electric', route: 'Downtown Logistics Circle B', status: 'En Route', progress: 92, eta: '12:15', priority: 'Medium', delay: 0 },
  { id: 'T-2096', driver: 'David Kim', vehicle: 'LC Van #118', type: 'Light Commercial', route: 'Warehouse District Hub Direct', status: 'Delayed', progress: 45, eta: '13:30', priority: 'High', delay: 20 },
  { id: 'T-2097', driver: 'Elena Rostova', vehicle: 'Transit Bus #88', type: 'Transit Bus', route: 'Metro Passenger Route 4A', status: 'Active', progress: 15, eta: '12:50', priority: 'Medium', delay: 0 },
  { id: 'T-2098', driver: 'Tyler Smith', vehicle: 'HD Truck #301', type: 'Heavy Duty', route: 'Houston Hub ➔ Port Terminal', status: 'Pending', progress: 0, eta: '13:10', priority: 'High', delay: 0 },
  { id: 'T-2099', driver: 'Yuki Sato', vehicle: 'EV Van #12', type: 'Electric', route: 'East Sector Last Mile Delivery', status: 'Active', progress: 54, eta: '12:40', priority: 'Low', delay: 0 }
];

const STANDBY_DRIVERS = [
  { name: 'Carlos Ruiz', status: 'Standby', shift: '08:00 - 16:00', phone: '+1 555-0192', rating: '4.95' },
  { name: 'Priya Patel', status: 'Standby', shift: '06:00 - 14:00', phone: '+1 555-0144', rating: '4.88' },
  { name: 'John Doe', status: 'On Break', shift: '09:00 - 17:00', phone: '+1 555-0210', rating: '4.92' },
  { name: 'Aisha Diallo', status: 'Standby', shift: '12:00 - 20:00', phone: '+1 555-0311', rating: '4.99' }
];

// Telemetry line chart datasets by Vehicle Type
const UTILIZATION_DATASETS = {
  All: [42, 55, 68, 85, 92, 88, 74, 82, 94, 91, 78, 62, 45],
  'Heavy Duty': [28, 42, 55, 75, 82, 80, 68, 72, 85, 80, 70, 52, 38],
  'Light Commercial': [50, 65, 80, 92, 95, 88, 78, 85, 96, 92, 84, 68, 50],
  'Electric': [35, 50, 72, 88, 90, 85, 70, 78, 92, 90, 82, 60, 42],
  'Transit Bus': [62, 80, 88, 82, 78, 75, 72, 78, 88, 90, 85, 75, 60]
};

const CHART_HOURS = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export function Dashboard() {
  // Live Dashboard State
  const [timeframe, setTimeframe] = useState('Today');
  const [systemMode, setSystemMode] = useState('Standard'); // Standard, ECO, Boost
  const [currentTime, setCurrentTime] = useState(new Date());

  // Filter States
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Live Roster States
  const [trips, setTrips] = useState(INITIAL_TRIPS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [drivers] = useState(STANDBY_DRIVERS);
  const [toastMessage, setToastMessage] = useState(null);

  // Stats state (can dynamically increment based on modals submissions)
  const [totalVehicles, setTotalVehicles] = useState(148);
  const [activeVehiclesCount, setActiveVehiclesCount] = useState(124);
  const [maintenanceCount, setMaintenanceCount] = useState(16);
  const [totalExpenses, setTotalExpenses] = useState(4850);
  const [carbonSaved, setCarbonSaved] = useState(18.4); // in Tons

  // Modal Control States
  const [activeModal, setActiveModal] = useState(null); // 'dispatch', 'vehicle', 'driver', 'maintenance', 'fuel', 'expense'

  // Modal Inputs States
  const [dispatchForm, setDispatchForm] = useState({ route: '', vehicle: '', driver: '', priority: 'Medium' });
  const [vehicleForm, setVehicleForm] = useState({ plate: '', model: '', propulsion: 'Diesel', status: 'Active' });
  const [driverForm, setDriverForm] = useState({ name: '', cdl: '', phone: '', shift: '08:00 - 16:00' });
  const [maintenanceForm, setMaintenanceForm] = useState({ vehicle: '', issue: '', severity: 'warning' });
  const [fuelForm, setFuelForm] = useState({ vehicle: '', liters: '', cost: '', station: '' });
  const [expenseForm, setExpenseForm] = useState({ category: 'Fuel', amount: '', description: '', reference: '' });

  // Interactive SVG Chart Tooltip State
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Live Timer Effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Show dynamic toast notifications
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered trips list based on user selections
  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const matchType = vehicleTypeFilter === 'All' || trip.type === vehicleTypeFilter;
      const matchStatus = statusFilter === 'All' || 
        (statusFilter === 'Active' && (trip.status === 'En Route' || trip.status === 'Active')) ||
        (statusFilter === 'Delayed' && trip.status === 'Delayed') ||
        (statusFilter === 'Pending' && trip.status === 'Pending');
      
      const matchSearch = trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trip.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trip.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          trip.route.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchType && matchStatus && matchSearch;
    });
  }, [trips, vehicleTypeFilter, statusFilter, searchQuery]);

  // Handle Dispatch Trip Submission
  const handleDispatchSubmit = (e) => {
    e.preventDefault();
    if (!dispatchForm.route || !dispatchForm.vehicle || !dispatchForm.driver) {
      triggerToast('🚨 Please fill in all fields to dispatch.');
      return;
    }

    const newTripId = `T-${Math.floor(2100 + Math.random() * 900)}`;
    const newTrip = {
      id: newTripId,
      driver: dispatchForm.driver,
      vehicle: dispatchForm.vehicle,
      type: vehicleTypeFilter !== 'All' ? vehicleTypeFilter : 'Heavy Duty',
      route: dispatchForm.route,
      status: 'Active',
      progress: 0,
      eta: new Date(Date.now() + 4 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      priority: dispatchForm.priority,
      delay: 0
    };

    setTrips([newTrip, ...trips]);
    setActiveVehiclesCount(prev => Math.min(totalVehicles, prev + 1));
    setActiveModal(null);
    setDispatchForm({ route: '', vehicle: '', driver: '', priority: 'Medium' });
    triggerToast(`🚚 Mission Dispatched: ${newTripId} successfully initialized.`);
  };

  // Handle Add Vehicle Submission
  const handleVehicleSubmit = (e) => {
    e.preventDefault();
    if (!vehicleForm.plate || !vehicleForm.model) {
      triggerToast('🚨 Please provide vehicle plate and model details.');
      return;
    }
    
    setTotalVehicles(prev => prev + 1);
    if (vehicleForm.status === 'Active') {
      setActiveVehiclesCount(prev => prev + 1);
    } else {
      setMaintenanceCount(prev => prev + 1);
    }

    if (vehicleForm.propulsion === 'EV') {
      setCarbonSaved(prev => +(prev + 0.8).toFixed(1));
    }

    setActiveModal(null);
    setVehicleForm({ plate: '', model: '', propulsion: 'Diesel', status: 'Active' });
    triggerToast(`🛡️ Asset Registered: Fleet size expanded to ${totalVehicles + 1} vehicles.`);
  };

  // Handle Add Driver Submission
  const handleDriverSubmit = (e) => {
    e.preventDefault();
    if (!driverForm.name || !driverForm.cdl) {
      triggerToast('🚨 Driver name and CDL number are required.');
      return;
    }
    setActiveModal(null);
    setDriverForm({ name: '', cdl: '', phone: '', shift: '08:00 - 16:00' });
    triggerToast(`👤 CDL Authorization Verified: ${driverForm.name} added to standby roster.`);
  };

  // Handle Maintenance Log Submission
  const handleMaintenanceSubmit = (e) => {
    e.preventDefault();
    if (!maintenanceForm.vehicle || !maintenanceForm.issue) {
      triggerToast('🚨 Provide vehicle label and issue telemetry descriptions.');
      return;
    }

    const newAlert = {
      id: Date.now(),
      type: maintenanceForm.severity,
      vehicle: maintenanceForm.vehicle,
      message: `${maintenanceForm.issue} - Logged manually by operator.`,
      time: 'Just now'
    };

    setAlerts([newAlert, ...alerts]);
    setMaintenanceCount(prev => prev + 1);
    setActiveVehiclesCount(prev => Math.max(0, prev - 1));
    setActiveModal(null);
    setMaintenanceForm({ vehicle: '', issue: '', severity: 'warning' });
    triggerToast(`🔧 Operational Defect logged for ${maintenanceForm.vehicle}. Alert broadcast active.`);
  };

  // Handle Fuel/EV Charging Log Submission
  const handleFuelSubmit = (e) => {
    e.preventDefault();
    if (!fuelForm.vehicle || !fuelForm.cost) {
      triggerToast('🚨 Enter vehicle plate and transaction receipt cost.');
      return;
    }

    const costNum = parseFloat(fuelForm.cost) || 0;
    setTotalExpenses(prev => prev + costNum);
    setActiveModal(null);
    setFuelForm({ vehicle: '', liters: '', cost: '', station: '' });
    triggerToast(`⛽ Fuel/Power Voucher Verified: Added $${costNum.toFixed(2)} to ledger.`);
  };

  // Handle Custom Expense Submission
  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseForm.amount || !expenseForm.description) {
      triggerToast('🚨 Amount and operational description are required.');
      return;
    }

    const amtNum = parseFloat(expenseForm.amount) || 0;
    setTotalExpenses(prev => prev + amtNum);
    setActiveModal(null);
    setExpenseForm({ category: 'Fuel', amount: '', description: '', reference: '' });
    triggerToast(`💳 Financial Audit Ledger updated: Recorded $${amtNum.toFixed(2)} expense.`);
  };

  // Dismiss a critical alert
  const handleAcknowledgeAlert = (id, isMaintenance) => {
    setAlerts(alerts.filter(a => a.id !== id));
    if (isMaintenance) {
      setMaintenanceCount(prev => Math.max(0, prev - 1));
      setActiveVehiclesCount(prev => Math.min(totalVehicles, prev + 1));
    }
    triggerToast('✅ Telemetry Incident Acknowledged & Cleared.');
  };

  // Generate SVG graph parameters based on dataset selection
  const chartDataset = UTILIZATION_DATASETS[vehicleTypeFilter] || UTILIZATION_DATASETS['All'];
  
  // SVG Chart math variables
  const chartWidth = 600;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  
  const chartPoints = useMemo(() => {
    const minVal = 0;
    const maxVal = 100;
    const rangeVal = maxVal - minVal;
    
    return chartDataset.map((val, idx) => {
      const x = paddingX + (idx / (chartDataset.length - 1)) * (chartWidth - paddingX * 2);
      const y = chartHeight - paddingY - (val / rangeVal) * (chartHeight - paddingY * 2);
      return { x, y, value: val, label: CHART_HOURS[idx] };
    });
  }, [chartDataset]);

  // Generate SVG line path string
  const linePath = useMemo(() => {
    if (chartPoints.length === 0) return '';
    return chartPoints.reduce((path, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, '');
  }, [chartPoints]);

  // Generate SVG area fill path string
  const areaPath = useMemo(() => {
    if (chartPoints.length === 0) return '';
    const firstPoint = chartPoints[0];
    const lastPoint = chartPoints[chartPoints.length - 1];
    const floorY = chartHeight - paddingY;
    return `${linePath} L ${lastPoint.x} ${floorY} L ${firstPoint.x} ${floorY} Z`;
  }, [chartPoints, linePath]);

  // Dummy action triggers
  const handleExportData = () => {
    triggerToast('📥 Exporting fleet telemetry package (JSON/CSV) to user workspace...');
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ trips, alerts, totalVehicles, activeVehiclesCount, totalExpenses }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `transitops_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-[#090d16] text-slate-100 min-h-screen font-sans antialiased relative overflow-hidden pb-12 selection:bg-indigo-600 selection:text-white">
      {/* Visual background ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none" />
      
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#162035]/95 border border-indigo-500/50 shadow-indigo-950/20 shadow-2xl backdrop-blur-xl px-5 py-4 rounded-xl flex items-center gap-3 animate-bounce">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
          <span className="text-sm font-semibold tracking-wide text-slate-200">{toastMessage}</span>
        </div>
      )}

      {/* DASHBOARD CONTAINER */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-800/80 pb-5 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                TransitOps v2.4
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-emerald-400 font-mono font-medium tracking-wide uppercase">
                  Telemetry Active • System Nominal
                </span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Fleet Operations Control Center
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Real-time vehicle telemetry, scheduling SLAs, and predictive maintenance diagnostics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:self-end">
            {/* Live Telemetry Clock */}
            <div className="bg-[#111827]/75 border border-slate-800 rounded-lg px-4 py-2 text-right hidden sm:block">
              <div className="text-sm font-mono text-indigo-400 font-bold">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </div>
              <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider font-mono">
                {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: '2-digit' }).replace(',', '')}
              </div>
            </div>

            {/* Operating Mode Buttons */}
            <div className="bg-[#111827]/75 border border-slate-800 rounded-lg p-1 flex items-center gap-1">
              {['Standard', 'ECO', 'Boost'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setSystemMode(mode);
                    triggerToast(`⚡ Dispatch grid switched to ${mode} mode.`);
                  }}
                  className={`text-xs font-bold px-3 py-1.5 rounded transition-all duration-200 ${
                    systemMode === mode 
                      ? 'bg-indigo-600 text-white shadow shadow-indigo-900/50' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Export System Logs */}
            <button
              onClick={handleExportData}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 border border-indigo-500/25"
            >
              <Icons.Download className="w-3.5 h-3.5" />
              <span>Export Telemetry</span>
            </button>
          </div>
        </header>

        {/* CONTROLS & FILTER BAR */}
        <section className="bg-[#111827]/60 border border-slate-800/70 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center justify-between shadow-lg shadow-slate-950/10">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider font-mono mr-2">
              <Icons.Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>Grid Filters</span>
            </div>

            {/* Vehicle Type Filter */}
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Vehicle Classification</span>
              <select
                value={vehicleTypeFilter}
                onChange={(e) => setVehicleTypeFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="All">All Classifications</option>
                <option value="Heavy Duty">Heavy Duty Trucks</option>
                <option value="Light Commercial">Light Commercial</option>
                <option value="Electric">Electric Vehicles (EV)</option>
                <option value="Transit Bus">Transit Buses</option>
              </select>
            </div>

            {/* Fleet Status Filter */}
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Mission State</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="All">All Operations</option>
                <option value="Active">Active En Route</option>
                <option value="Delayed">Telemetry Delays</option>
                <option value="Pending">Staged / Pending Dispatch</option>
              </select>
            </div>

            {/* Region Filter */}
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Regional Sector</span>
              <select
                value={regionFilter}
                onChange={(e) => {
                  setRegionFilter(e.target.value);
                  triggerToast(`🗺️ Map viewport locked to ${e.target.value} Sector.`);
                }}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="All">All Sectors</option>
                <option value="North">North Sector (Great Lakes)</option>
                <option value="East">East Sector (Atlantic Corridor)</option>
                <option value="South">South Sector (Gulf District)</option>
                <option value="West">West Sector (Pacific Rim)</option>
              </select>
            </div>

            {/* Timeframe Filter */}
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Telemetry Range</span>
              <select
                value={timeframe}
                onChange={(e) => {
                  setTimeframe(e.target.value);
                  triggerToast(`📅 Analytics range aggregated for ${e.target.value}.`);
                }}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="Today">Today (Real-time)</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Monthly">Current Billing Cycle</option>
              </select>
            </div>
          </div>

          {/* Active Search */}
          <div className="w-full sm:w-auto mt-2 sm:mt-0">
            <span className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Live Roster Search</span>
            <div className="relative">
              <input
                type="text"
                placeholder="Search trip, driver, asset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none w-full sm:w-60 font-medium"
              />
              <Icons.Search className="absolute left-3 top-2.5 text-slate-500" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300">
                  <Icons.Close className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* KPI METRIC CARDS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
          {/* KPI Card 1: Fleet Utilization */}
          <div className="bg-[#111827]/75 border border-slate-800/80 rounded-xl p-5 hover:border-indigo-500/50 transition-all duration-300 shadow-xl flex items-center justify-between relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
            <div>
              <span className="text-slate-500 text-xs font-bold uppercase font-mono tracking-wider">Fleet Utilization</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-100">{activeVehiclesCount}</span>
                <span className="text-slate-500 text-sm font-semibold font-mono">/ {totalVehicles} Active</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5 text-[11px]">
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">+{((activeVehiclesCount/totalVehicles)*100).toFixed(0)}%</span>
                <span className="text-slate-400 font-medium font-sans">Deployment Rate</span>
              </div>
            </div>
            {/* Visual Circular Gauge */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="#1f2937" strokeWidth="4.5" fill="transparent" />
                <circle cx="32" cy="32" r="26" stroke="#6366f1" strokeWidth="4.5" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 26} 
                        strokeDashoffset={2 * Math.PI * 26 * (1 - activeVehiclesCount / totalVehicles)}
                        className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-[10px] font-mono font-bold text-slate-300">
                {((activeVehiclesCount/totalVehicles)*100).toFixed(0)}%
              </div>
            </div>
          </div>

          {/* KPI Card 2: SLA Success */}
          <div className="bg-[#111827]/75 border border-slate-800/80 rounded-xl p-5 hover:border-emerald-500/50 transition-all duration-300 shadow-xl flex items-center justify-between relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
            <div>
              <span className="text-slate-500 text-xs font-bold uppercase font-mono tracking-wider">Mission SLA Score</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-100">96.4%</span>
                <span className="text-emerald-400 text-xs font-mono font-bold">▲ 0.8%</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5 text-[11px]">
                <span className="text-indigo-400 font-mono">12.4m</span>
                <span className="text-slate-400 font-medium">Avg Departure Lead Time</span>
              </div>
            </div>
            {/* Custom SVG Mini Sparkline */}
            <div className="w-16 h-12">
              <svg className="w-full h-full" viewBox="0 0 60 30">
                <path d="M 0 25 Q 10 15 20 22 T 40 8 T 60 5" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 0 25 Q 10 15 20 22 T 40 8 T 60 5 L 60 30 L 0 30 Z" fill="url(#sparkline-grad)" opacity="0.15" />
                <defs>
                  <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* KPI Card 3: Energy & Carbon Impact */}
          <div className="bg-[#111827]/75 border border-slate-800/80 rounded-xl p-5 hover:border-cyan-500/50 transition-all duration-300 shadow-xl flex items-center justify-between relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />
            <div>
              <span className="text-slate-500 text-xs font-bold uppercase font-mono tracking-wider">ECO Integration</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-100">{carbonSaved}t</span>
                <span className="text-cyan-400 text-xs font-mono font-bold">CO₂ Saved</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5 text-[11px]">
                <span className="text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded font-mono">32 EV</span>
                <span className="text-slate-400 font-medium">Charged (Today)</span>
              </div>
            </div>
            <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400">
              <Icons.BatteryCharging className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          {/* KPI Card 4: Operating Expenses */}
          <div className="bg-[#111827]/75 border border-slate-800/80 rounded-xl p-5 hover:border-amber-500/50 transition-all duration-300 shadow-xl flex items-center justify-between relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
            <div>
              <span className="text-slate-500 text-xs font-bold uppercase font-mono tracking-wider">Ledger Expenses</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-100">${totalExpenses.toLocaleString()}</span>
                <span className="text-amber-400 text-xs font-mono font-bold">Budget Lock</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5 text-[11px]">
                <span className="text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded font-mono">{maintenanceCount} Flags</span>
                <span className="text-slate-400 font-medium">Pending Service Resolve</span>
              </div>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
              <Icons.DollarSign className="w-6 h-6" />
            </div>
          </div>

        </section>

        {/* MAIN LAYOUT DECK: PRIMARY AND SIDEBAR PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT DECK (COLUMNS 1-8): TELEMETRY AND TRIALS */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* SECTION: REAL-TIME UTILIZATION TELEMETRY (SVG CHART) */}
            <article className="bg-[#111827]/75 border border-slate-800/80 rounded-2xl p-5 shadow-2xl relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-indigo-500 shadow shadow-indigo-500" />
                    Fleet Utilization Telemetry
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Continuous tracking of deployment vectors. Currently filtered to <span className="text-indigo-400 font-semibold">{vehicleTypeFilter}</span>.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Utilization (%)
                  </span>
                </div>
              </div>

              {/* DYNAMIC SVG CHART WITH MOUSE INTERACTION */}
              <div className="relative mt-2 bg-slate-950/40 rounded-xl p-3 border border-slate-900/60 overflow-x-auto">
                <svg 
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                  className="w-full min-w-[550px] overflow-visible"
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map((val) => {
                    const y = chartHeight - paddingY - (val / 100) * (chartHeight - paddingY * 2);
                    return (
                      <g key={val} className="opacity-30">
                        <line 
                          x1={paddingX} 
                          y1={y} 
                          x2={chartWidth - paddingX} 
                          y2={y} 
                          stroke="#334155" 
                          strokeWidth="1" 
                          strokeDasharray="4 4" 
                        />
                        <text 
                          x={paddingX - 10} 
                          y={y + 3} 
                          fill="#64748b" 
                          fontSize="9" 
                          textAnchor="end"
                          className="font-mono font-bold"
                        >
                          {val}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Hour Labels */}
                  {CHART_HOURS.map((hour, idx) => {
                    const x = paddingX + (idx / (CHART_HOURS.length - 1)) * (chartWidth - paddingX * 2);
                    return (
                      <text
                        key={hour}
                        x={x}
                        y={chartHeight - 10}
                        fill="#64748b"
                        fontSize="9"
                        textAnchor="middle"
                        className="font-mono font-bold opacity-80"
                      >
                        {hour}
                      </text>
                    );
                  })}

                  {/* Area fill path under chart */}
                  <path 
                    d={areaPath} 
                    fill="url(#chart-area-glow)" 
                    className="transition-all duration-500 ease-in-out"
                  />

                  {/* Stroke path */}
                  <path 
                    d={linePath} 
                    fill="none" 
                    stroke="url(#chart-stroke-gradient)" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-500 ease-in-out"
                  />

                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="chart-stroke-gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="50%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                    <linearGradient id="chart-area-glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Transparent hover detection rectangles for each point */}
                  {chartPoints.map((pt, idx) => {
                    const colWidth = (chartWidth - paddingX * 2) / (chartPoints.length - 1);
                    const rectX = pt.x - colWidth / 2;
                    return (
                      <rect
                        key={idx}
                        x={rectX}
                        y={paddingY}
                        width={colWidth}
                        height={chartHeight - paddingY * 2}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(pt)}
                      />
                    );
                  })}

                  {/* Glowing active dots */}
                  {chartPoints.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r={hoveredPoint?.label === pt.label ? "6" : "3.5"}
                      fill={hoveredPoint?.label === pt.label ? "#22d3ee" : "#6366f1"}
                      stroke="#090d16"
                      strokeWidth={hoveredPoint?.label === pt.label ? "2" : "1.5"}
                      className="transition-all duration-200 ease-out pointer-events-none"
                    />
                  ))}

                  {/* Vertical Crosshair Line */}
                  {hoveredPoint && (
                    <line
                      x1={hoveredPoint.x}
                      y1={paddingY}
                      x2={hoveredPoint.x}
                      y2={chartHeight - paddingY}
                      stroke="#818cf8"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      className="pointer-events-none"
                    />
                  )}
                </svg>

                {/* Floating Interactive Tooltip */}
                {hoveredPoint && (
                  <div 
                    className="absolute bg-slate-900/95 border border-indigo-500/40 rounded-lg p-2.5 shadow-2xl backdrop-blur text-left z-10 pointer-events-none transition-all duration-150"
                    style={{
                      left: `${(hoveredPoint.x / chartWidth) * 90}%`,
                      top: '15px'
                    }}
                  >
                    <span className="text-[10px] text-slate-500 font-mono font-bold block uppercase tracking-wider">
                      Timestamp: {hoveredPoint.label}
                    </span>
                    <span className="text-sm font-extrabold text-slate-100 font-mono">
                      {hoveredPoint.value}% Capacity
                    </span>
                    <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">
                      Status: SLA Met
                    </span>
                  </div>
                )}
              </div>
            </article>

            {/* SECTION: ACTIVE OPERATIONS MISSION TRACKER */}
            <article className="bg-[#111827]/75 border border-slate-800/80 rounded-2xl p-5 shadow-2xl flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500 shadow shadow-emerald-500" />
                    Active Mission Control Deck
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Real-time monitoring of deployed routes, ETA compliance, and transit progress.
                  </p>
                </div>
                {/* Internal statistics quick summary */}
                <div className="flex items-center gap-1.5 text-xs bg-slate-950/40 border border-slate-800 px-3 py-1.5 rounded-lg font-mono">
                  <span className="text-slate-500 font-bold uppercase">Filtered count:</span>
                  <span className="text-emerald-400 font-extrabold">{filteredTrips.length}</span>
                </div>
              </div>

              {/* Roster / Table container */}
              <div className="overflow-x-auto border border-slate-800/80 rounded-xl bg-slate-950/20">
                <table className="w-full border-collapse text-left text-xs min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-800 bg-[#162035]/30">
                      <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-slate-500 font-mono">Trip ID</th>
                      <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-slate-500">Resource / Asset</th>
                      <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-slate-500">Route Waypoint</th>
                      <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-slate-500 font-mono">Progress</th>
                      <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-slate-500">ETA / SLA Status</th>
                      <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-slate-500 text-right">Sectors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredTrips.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-slate-500 font-medium">
                          ⚠️ No operational logs matching current filters located.
                        </td>
                      </tr>
                    ) : (
                      filteredTrips.map((trip) => {
                        let statusColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                        let glowDot = 'bg-emerald-500';
                        if (trip.status === 'Delayed') {
                          statusColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse';
                          glowDot = 'bg-rose-500';
                        } else if (trip.status === 'Pending') {
                          statusColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                          glowDot = 'bg-amber-500';
                        }

                        return (
                          <tr key={trip.id} className="hover:bg-slate-800/20 transition-colors group">
                            {/* Trip ID */}
                            <td className="px-4 py-3.5 font-mono font-bold text-slate-200">
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${glowDot}`} />
                                {trip.id}
                              </div>
                            </td>
                            {/* Resource / Asset */}
                            <td className="px-4 py-3.5">
                              <div>
                                <span className="font-extrabold text-slate-200 group-hover:text-indigo-400 transition-colors block">{trip.driver}</span>
                                <span className="text-slate-500 text-[10px] font-medium font-mono">{trip.vehicle} ({trip.type})</span>
                              </div>
                            </td>
                            {/* Route Waypoint */}
                            <td className="px-4 py-3.5">
                              <span className="text-slate-300 font-medium text-[11px] block">{trip.route}</span>
                            </td>
                            {/* Progress */}
                            <td className="px-4 py-3.5 w-36">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${
                                      trip.status === 'Delayed' ? 'bg-rose-500' : 'bg-indigo-500'
                                    }`}
                                    style={{ width: `${trip.progress}%` }}
                                  />
                                </div>
                                <span className="font-mono text-[10px] text-slate-400 font-bold">{trip.progress}%</span>
                              </div>
                            </td>
                            {/* ETA / SLA */}
                            <td className="px-4 py-3.5">
                              <div>
                                <span className="font-mono text-slate-200 font-semibold block">{trip.eta}</span>
                                {trip.delay > 0 ? (
                                  <span className="text-[10px] text-rose-400 font-bold font-mono">+{trip.delay}m Traffic Alert</span>
                                ) : (
                                  <span className="text-[10px] text-emerald-400 font-semibold">On Schedule</span>
                                )}
                              </div>
                            </td>
                            {/* Action Indicators */}
                            <td className="px-4 py-3.5 text-right">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold ${statusColor}`}>
                                {trip.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            {/* EXPENSE & ECO DYNAMIC BAR CHART */}
            <article className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Energy Resource Allocation */}
              <div className="bg-[#111827]/75 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
                <h4 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider mb-4 flex items-center gap-2">
                  <Icons.BatteryCharging className="w-4 h-4 text-cyan-400" />
                  Fleet Propulsion Ratio
                </h4>
                
                <div className="space-y-4">
                  {/* EV Vehicles */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-semibold text-slate-300">Clean Energy Propulsion (EV/Hybrid)</span>
                      <span className="font-mono text-cyan-400 font-bold">42 %</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: '42%' }} />
                    </div>
                  </div>
                  {/* Ultra Low Sulfur Diesel */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-semibold text-slate-300">Ultra-low Sulfur Diesel</span>
                      <span className="font-mono text-indigo-400 font-bold">48 %</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: '48%' }} />
                    </div>
                  </div>
                  {/* Alternative Biofuels */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-semibold text-slate-300">Biofuels / Hydrogen Fuel Cell</span>
                      <span className="font-mono text-emerald-400 font-bold">10 %</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '10%' }} />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-between items-center text-[10px] text-slate-400 font-medium">
                  <span>Carbon Offset Credit Value:</span>
                  <span className="text-emerald-400 font-bold font-mono">+$8,420 accumulated</span>
                </div>
              </div>

              {/* Monthly Ledger Outflow Distribution */}
              <div className="bg-[#111827]/75 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
                <h4 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider mb-4 flex items-center gap-2">
                  <Icons.DollarSign className="w-4 h-4 text-amber-400" />
                  Monthly Spend Analysis ($)
                </h4>

                <div className="flex flex-col gap-2">
                  {/* Category fuel */}
                  <div className="flex items-center gap-3">
                    <span className="w-16 text-[10px] font-bold text-slate-400 font-mono text-right uppercase">Fuel</span>
                    <div className="flex-1 bg-slate-800 h-3.5 rounded overflow-hidden relative">
                      <div className="bg-indigo-500/70 h-full rounded" style={{ width: '65%' }} />
                      <span className="absolute inset-y-0 left-2 flex items-center text-[9px] font-mono font-bold text-slate-200">$14.2K</span>
                    </div>
                  </div>
                  {/* Drivers */}
                  <div className="flex items-center gap-3">
                    <span className="w-16 text-[10px] font-bold text-slate-400 font-mono text-right uppercase">Drivers</span>
                    <div className="flex-1 bg-slate-800 h-3.5 rounded overflow-hidden relative">
                      <div className="bg-emerald-500/70 h-full rounded" style={{ width: '85%' }} />
                      <span className="absolute inset-y-0 left-2 flex items-center text-[9px] font-mono font-bold text-slate-200">$18.9K</span>
                    </div>
                  </div>
                  {/* Service */}
                  <div className="flex items-center gap-3">
                    <span className="w-16 text-[10px] font-bold text-slate-400 font-mono text-right uppercase">Service</span>
                    <div className="flex-1 bg-slate-800 h-3.5 rounded overflow-hidden relative">
                      <div className="bg-amber-500/70 h-full rounded" style={{ width: '45%' }} />
                      <span className="absolute inset-y-0 left-2 flex items-center text-[9px] font-mono font-bold text-slate-200">$8.4K</span>
                    </div>
                  </div>
                  {/* Charging */}
                  <div className="flex items-center gap-3">
                    <span className="w-16 text-[10px] font-bold text-slate-400 font-mono text-right uppercase">Power</span>
                    <div className="flex-1 bg-slate-800 h-3.5 rounded overflow-hidden relative">
                      <div className="bg-cyan-500/70 h-full rounded" style={{ width: '25%' }} />
                      <span className="absolute inset-y-0 left-2 flex items-center text-[9px] font-mono font-bold text-slate-200">$4.5K</span>
                    </div>
                  </div>
                </div>
              </div>

            </article>

          </div>

          {/* RIGHT DECK (COLUMNS 9-12): COMMAND CENTER SIDEBAR PANEL */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* COMPONENT: QUICK ACTIONS MODULE */}
            <article className="bg-[#111827]/75 border border-slate-800/80 rounded-2xl p-5 shadow-2xl">
              <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider mb-4 flex items-center gap-2">
                <Icons.Settings className="w-4 h-4 text-indigo-400" />
                Dispatch Console Actions
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Action 1: Dispatch Trip */}
                <button
                  onClick={() => setActiveModal('dispatch')}
                  className="bg-slate-900 border border-slate-800/80 hover:border-indigo-500/50 rounded-xl p-3 text-left transition-all duration-300 group hover:shadow-lg hover:shadow-indigo-900/10 cursor-pointer text-slate-100"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                    <Icons.Route className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold block">Dispatch Trip</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5 font-medium">Deploy active route</span>
                </button>

                {/* Action 2: Add Vehicle */}
                <button
                  onClick={() => setActiveModal('vehicle')}
                  className="bg-slate-900 border border-slate-800/80 hover:border-emerald-500/50 rounded-xl p-3 text-left transition-all duration-300 group hover:shadow-lg hover:shadow-emerald-900/10 cursor-pointer text-slate-100"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                    <Icons.Truck className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold block">Add Vehicle</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5 font-medium">Provision new asset</span>
                </button>

                {/* Action 3: Add Driver */}
                <button
                  onClick={() => setActiveModal('driver')}
                  className="bg-slate-900 border border-slate-800/80 hover:border-cyan-500/50 rounded-xl p-3 text-left transition-all duration-300 group hover:shadow-lg hover:shadow-cyan-900/10 cursor-pointer text-slate-100"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                    <Icons.Users className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold block">Add Driver</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5 font-medium">Authorize credentials</span>
                </button>

                {/* Action 4: Maintenance Logs */}
                <button
                  onClick={() => setActiveModal('maintenance')}
                  className="bg-slate-900 border border-slate-800/80 hover:border-rose-500/50 rounded-xl p-3 text-left transition-all duration-300 group hover:shadow-lg hover:shadow-rose-900/10 cursor-pointer text-slate-100"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                    <Icons.AlertTriangle className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold block">Maintenance</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5 font-medium">Record defect log</span>
                </button>

                {/* Action 5: Fuel Entry */}
                <button
                  onClick={() => setActiveModal('fuel')}
                  className="bg-slate-900 border border-slate-800/80 hover:border-amber-500/50 rounded-xl p-3 text-left transition-all duration-300 group hover:shadow-lg hover:shadow-amber-900/10 cursor-pointer text-slate-100"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                    <Icons.Fuel className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold block">Fuel Log</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5 font-medium">Log gas or charging</span>
                </button>

                {/* Action 6: Record Expense */}
                <button
                  onClick={() => setActiveModal('expense')}
                  className="bg-slate-900 border border-slate-800/80 hover:border-purple-500/50 rounded-xl p-3 text-left transition-all duration-300 group hover:shadow-lg hover:shadow-purple-900/10 cursor-pointer text-slate-100"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                    <Icons.DollarSign className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold block">Expense</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5 font-medium">Post custom voucher</span>
                </button>
              </div>
            </article>

            {/* COMPONENT: COMPLIANCE AND ALARM NOTIFICATIONS */}
            <article className="bg-[#111827]/75 border border-slate-800/80 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
                  <Icons.AlertTriangle className="w-4 h-4 text-rose-500" />
                  Critical Defect & Compliance Alerts
                </h3>
                <span className="bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-bold font-mono px-2 py-0.5 rounded">
                  {alerts.length} Warnings
                </span>
              </div>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {alerts.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl">
                    <span className="text-emerald-400 text-xs font-bold block mb-1">🛡️ Systems Fully Cleared</span>
                    <span className="text-slate-500 text-[10px] font-medium">No unresolved incidents at present.</span>
                  </div>
                ) : (
                  alerts.map((alert) => {
                    const isCritical = alert.type === 'critical';
                    return (
                      <div 
                        key={alert.id} 
                        className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all duration-200 hover:bg-slate-800/10 ${
                          isCritical 
                            ? 'bg-rose-950/15 border-rose-800/60 hover:border-rose-500' 
                            : 'bg-amber-950/10 border-amber-800/40 hover:border-amber-500'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`} />
                            <span className="text-[10px] font-bold font-mono text-slate-200 uppercase">
                              {alert.vehicle || alert.driver}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-500 font-semibold font-mono">{alert.time}</span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium mt-1.5 leading-relaxed">
                          {alert.message}
                        </p>
                        <div className="flex justify-end gap-2 mt-3 pt-2.5 border-t border-slate-800/40">
                          <button 
                            onClick={() => handleAcknowledgeAlert(alert.id, !!alert.vehicle)}
                            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-[10px] font-bold px-3 py-1 rounded-lg text-slate-300 transition-colors cursor-pointer"
                          >
                            Resolve Alert
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </article>

            {/* COMPONENT: DRIVERS STANDBY DUTY ROSTER */}
            <article className="bg-[#111827]/75 border border-slate-800/80 rounded-2xl p-5 shadow-2xl">
              <h3 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider mb-4 flex items-center gap-2">
                <Icons.Users className="w-4 h-4 text-cyan-400" />
                Standby Driver Roster
              </h3>

              <div className="space-y-3">
                {drivers.map((driver, index) => (
                  <div key={index} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/70">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-400">
                        {driver.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">{driver.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono font-medium">{driver.shift}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-wide uppercase ${
                        driver.status === 'Standby' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {driver.status}
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-0.5 font-bold font-mono">⭐ {driver.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

          </div>

        </div>

      </div>

      {/* STATE-DRIVEN MODAL OVERLAY PORTAL SYSTEM */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal Backdrop Blur overlay */}
          <div 
            onClick={() => setActiveModal(null)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
          />

          {/* Modal Card Content Container */}
          <div className="bg-[#111827] border border-slate-800 shadow-2xl rounded-2xl max-w-md w-full relative z-10 overflow-hidden transform transition-all scale-100 flex flex-col">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#162035]/30">
              <h3 className="text-sm font-extrabold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                {activeModal === 'dispatch' && 'Deploy Fleet Mission (Dispatch)'}
                {activeModal === 'vehicle' && 'Add Asset (Provision Vehicle)'}
                {activeModal === 'driver' && 'Credentials Verification (Add Driver)'}
                {activeModal === 'maintenance' && 'Create Maintenance Defect Log'}
                {activeModal === 'fuel' && 'Log Energy/Fueling Transaction'}
                {activeModal === 'expense' && 'Post Financial Voucher'}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Icons.Close className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="p-5 max-h-[75vh] overflow-y-auto">
              
              {/* Form 1: Dispatch Trip */}
              {activeModal === 'dispatch' && (
                <form onSubmit={handleDispatchSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Route Path Waypoint Description</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Seattle Warehouse ➔ Portland Terminal"
                      value={dispatchForm.route} 
                      onChange={(e) => setDispatchForm({ ...dispatchForm, route: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Assigned Vehicle</label>
                      <input 
                        type="text" 
                        placeholder="e.g. HD Truck #402"
                        value={dispatchForm.vehicle} 
                        onChange={(e) => setDispatchForm({ ...dispatchForm, vehicle: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Assigned Driver</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Sarah Jenkins"
                        value={dispatchForm.driver} 
                        onChange={(e) => setDispatchForm({ ...dispatchForm, driver: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Mission Priority Rating</label>
                    <select
                      value={dispatchForm.priority}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, priority: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                    >
                      <option value="Low">Low - Deferred Route</option>
                      <option value="Medium">Medium - Regular Transit</option>
                      <option value="High">High - Critical Cargo/Time SLA</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg text-xs transition-colors mt-3"
                  >
                    Confirm Dispatch Launch
                  </button>
                </form>
              )}

              {/* Form 2: Add Vehicle */}
              {activeModal === 'vehicle' && (
                <form onSubmit={handleVehicleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Plate Number / ID</label>
                      <input 
                        type="text" 
                        placeholder="e.g. TX-9941A"
                        value={vehicleForm.plate} 
                        onChange={(e) => setVehicleForm({ ...vehicleForm, plate: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Model Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Ford F-550"
                        value={vehicleForm.model} 
                        onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Propulsion System</label>
                      <select
                        value={vehicleForm.propulsion}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, propulsion: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                      >
                        <option value="Diesel">Ultra Low Diesel</option>
                        <option value="EV">Electric Propulsion (EV)</option>
                        <option value="Hybrid">Hybrid Clean Energy</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Operational State</label>
                      <select
                        value={vehicleForm.status}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                      >
                        <option value="Active">Active Duty</option>
                        <option value="Maintenance">Scheduled Diagnostics</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs transition-colors mt-3"
                  >
                    Register Asset in Registry
                  </button>
                </form>
              )}

              {/* Form 3: Add Driver */}
              {activeModal === 'driver' && (
                <form onSubmit={handleDriverSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Driver Legal Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Johnathan Miller"
                      value={driverForm.name} 
                      onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">CDL License Class / ID</label>
                      <input 
                        type="text" 
                        placeholder="e.g. CDL-CLASS-A-421"
                        value={driverForm.cdl} 
                        onChange={(e) => setDriverForm({ ...driverForm, cdl: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Mobile Telephone</label>
                      <input 
                        type="text" 
                        placeholder="e.g. +1 (555) 019-2244"
                        value={driverForm.phone} 
                        onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Standard Shift Window</label>
                    <select
                      value={driverForm.shift}
                      onChange={(e) => setDriverForm({ ...driverForm, shift: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                    >
                      <option value="06:00 - 14:00">Morning Shift (06:00 - 14:00)</option>
                      <option value="08:00 - 16:00">Standard Shift (08:00 - 16:00)</option>
                      <option value="12:00 - 20:00">Evening Shift (12:00 - 20:00)</option>
                      <option value="20:00 - 04:00">Night Watch Shift (20:00 - 04:00)</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-lg text-xs transition-colors mt-3"
                  >
                    Authorize Standby Driver
                  </button>
                </form>
              )}

              {/* Form 4: Maintenance Defect Log */}
              {activeModal === 'maintenance' && (
                <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Defect Target Asset / Vehicle ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Bus #108 or Truck #301"
                      value={maintenanceForm.vehicle} 
                      onChange={(e) => setMaintenanceForm({ ...maintenanceForm, vehicle: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Operational Issue Description</label>
                    <textarea 
                      rows="3"
                      placeholder="e.g. Alternator failure leading to sub-optimal voltage outputs."
                      value={maintenanceForm.issue} 
                      onChange={(e) => setMaintenanceForm({ ...maintenanceForm, issue: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Threat Level / Alert Severity</label>
                    <div className="flex gap-4">
                      {['warning', 'critical'].map((level) => (
                        <label key={level} className="flex items-center gap-2 text-xs text-slate-300 font-bold capitalize">
                          <input 
                            type="radio" 
                            name="severity" 
                            value={level} 
                            checked={maintenanceForm.severity === level}
                            onChange={() => setMaintenanceForm({ ...maintenanceForm, severity: level })}
                            className="accent-rose-500"
                          />
                          {level}
                        </label>
                      ))}
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 rounded-lg text-xs transition-colors mt-3"
                  >
                    Broadcast Defect Alarm
                  </button>
                </form>
              )}

              {/* Form 5: Fuel Log */}
              {activeModal === 'fuel' && (
                <form onSubmit={handleFuelSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Target Vehicle Reference</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Truck #402"
                        value={fuelForm.vehicle} 
                        onChange={(e) => setFuelForm({ ...fuelForm, vehicle: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Liters Charged / Consumed</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 120"
                        value={fuelForm.liters} 
                        onChange={(e) => setFuelForm({ ...fuelForm, liters: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Receipt Invoice Cost ($)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 240.50"
                        value={fuelForm.cost} 
                        onChange={(e) => setFuelForm({ ...fuelForm, cost: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Fueling Station Location</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Sector-4 Charging Grid"
                        value={fuelForm.station} 
                        onChange={(e) => setFuelForm({ ...fuelForm, station: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded-lg text-xs transition-colors mt-3"
                  >
                    Register Energy Ledger Entry
                  </button>
                </form>
              )}

              {/* Form 6: Custom Expense Log */}
              {activeModal === 'expense' && (
                <form onSubmit={handleExpenseSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Voucher Category</label>
                      <select
                        value={expenseForm.category}
                        onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                      >
                        <option value="Fuel">Energy / Fuel</option>
                        <option value="Driver">Driver Wages</option>
                        <option value="Permit">Permits / Compliance Fees</option>
                        <option value="Maintenance">Service Maintenance</option>
                        <option value="Tolls">Highway Tolls & Transit Fees</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Total Bill Amount ($)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 85.00"
                        value={expenseForm.amount} 
                        onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Expense Description Audit Log</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Highway-80 state toll payment for route T-2094"
                      value={expenseForm.description} 
                      onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Asset Reference (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Truck #402"
                      value={expenseForm.reference} 
                      onChange={(e) => setExpenseForm({ ...expenseForm, reference: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-lg text-xs transition-colors mt-3"
                  >
                    Commit Financial Voucher
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Dashboard;
