import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart
} from 'recharts';
import {
  FaPercent, FaMoneyBillWave, FaBriefcase,
  FaFileExport, FaChartLine, FaGraduationCap
} from 'react-icons/fa';
import Toast from '../Toast';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const COLORS = ['#D97706', '#059669', '#7C3AED', '#DC2626', '#2563EB', '#DB2777'];

const PlacementStats = () => {
  document.title = 'CPMS | Placement Analytics';

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const pathPrefix = window.location.pathname.startsWith('/admin') ? 'admin' :
                           window.location.pathname.startsWith('/tpo') ? 'tpo' : 'management';

        const response = await axios.get(`${BASE_URL}/${pathPrefix}/placement-stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setStats(response.data.branchStats || []);
      } catch (err) {
        console.error('Error fetching placement stats:', err);
        setError(err.response?.data?.msg || 'Failed to load placement stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-amber-600 border-t-transparent animate-spin"></div>
        <p className="text-stone-500 font-medium text-xs animate-pulse">Loading Placement Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-3xl p-8 my-4 text-center max-w-xl mx-auto space-y-4">
        <h4 className="font-bold text-lg">Error Loading Statistics</h4>
        <p className="text-xs">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition cursor-pointer"
        >
          Retry Fetching Data
        </button>
      </div>
    );
  }

  const overallStrength = stats.reduce((acc, curr) => acc + curr.totalStrength, 0);
  const overallPlaced = stats.reduce((acc, curr) => acc + curr.placed, 0);
  const overallUnplaced = stats.reduce((acc, curr) => acc + curr.unplaced, 0);
  const overallPercentPlaced = overallStrength > 0 ? parseFloat(((overallPlaced / overallStrength) * 100).toFixed(2)) : 0;
  const overallMultipleOffers = stats.reduce((acc, curr) => acc + curr.multipleOffers, 0);
  const overallOnCampus = stats.reduce((acc, curr) => acc + curr.onCampus, 0);
  const overallOffCampus = stats.reduce((acc, curr) => acc + curr.offCampus, 0);

  const highestLPA = stats.length > 0 ? Math.max(...stats.map(s => s.highestLPA)) : 0;
  const highestStipend = stats.length > 0 ? Math.max(...stats.map(s => s.highestStipend)) : 0;

  const placedTotalCTC = stats.reduce((acc, curr) => acc + (curr.avgLPA * curr.placed), 0);
  const overallAvgLPA = overallPlaced > 0 ? parseFloat((placedTotalCTC / overallPlaced).toFixed(2)) : 0;

  const branchBarData = stats.map(s => ({
    name: s.branch,
    Placed: s.placed,
    Unplaced: s.unplaced,
  }));

  const packageLineData = stats.map(s => ({
    name: s.branch,
    'Average Package': s.avgLPA,
    'Highest Package': s.highestLPA,
    'Median Package': s.medianLPA,
  }));

  const campusPieData = [
    { name: 'On-Campus', value: overallOnCampus },
    { name: 'Off-Campus', value: overallOffCampus }
  ].filter(item => item.value > 0);

  const branchPieData = stats.map(s => ({
    name: s.branch,
    value: s.placed
  })).filter(item => item.value > 0);

  const stipendBarData = stats.map(s => ({
    name: s.branch,
    'Average Stipend': s.avgStipend,
    'Highest Stipend': s.highestStipend,
  }));

  const handleExportCSV = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Branch,Total Strength,Placed Students,Unplaced Students,% Placed,Avg LPA,Highest LPA,Median LPA,Lowest LPA,On-Campus Placements,Off-Campus Placements,Multiple Offers,Avg Stipend/mo,Highest Stipend/mo\n";
      
      stats.forEach(s => {
        csvContent += `"${s.branch}",${s.totalStrength},${s.placed},${s.unplaced},${s.percentPlaced}%,${s.avgLPA},${s.highestLPA},${s.medianLPA},${s.lowestLPA},${s.onCampus},${s.offCampus},${s.multipleOffers},${s.avgStipend},${s.highestStipend}\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `placement_stats_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setToastMessage("Statistics report exported successfully!");
      setShowToast(true);
    } catch (e) {
      setToastMessage("Failed to export stats.");
      setShowToast(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {/* Hero Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 p-8 sm:p-10 border border-stone-800 shadow-2xl overflow-hidden text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-600 to-amber-700" />
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/20 text-amber-400 text-xs font-semibold border border-amber-500/30">
            <FaChartLine className="text-xs" /> Placement Intelligence Hub
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Placement Statistics & Insights</h2>
          <p className="text-stone-400 text-xs sm:text-sm max-w-xl">
            Real-time analytical metrics, salary packages, stipend distributions, and department breakdowns.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-amber-600/20 transition-all cursor-pointer text-xs sm:text-sm shrink-0"
        >
          <FaFileExport />
          <span>Export Summary (CSV)</span>
        </button>
      </div>

      {/* Top Level Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placement Rate */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-bold text-xs uppercase tracking-wider">Placement Rate</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center text-sm shadow-xs">
              <FaPercent />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <h3 className="text-3xl font-extrabold text-stone-900">{overallPercentPlaced}%</h3>
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-600 to-amber-700 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${overallPercentPlaced}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-500 font-semibold">
              {overallPlaced} of {overallStrength} students placed
            </p>
          </div>
        </div>

        {/* Average Package */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-bold text-xs uppercase tracking-wider">Average Package</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center text-sm shadow-xs">
              <FaMoneyBillWave />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-3xl font-extrabold text-stone-900">{overallAvgLPA} LPA</h3>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-2">
              <FaChartLine />
              <span>Overall weighted average</span>
            </p>
            <p className="text-[11px] text-stone-500 font-medium">Calculated across hired candidates</p>
          </div>
        </div>

        {/* Highest CTC */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-bold text-xs uppercase tracking-wider">Highest Package</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center justify-center text-sm shadow-xs">
              <FaGraduationCap />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-3xl font-extrabold text-stone-900">{highestLPA} LPA</h3>
            <p className="text-[11px] text-purple-600 font-bold mt-2">
              ★ Peak offer in cohort
            </p>
            <p className="text-[11px] text-stone-500 font-medium">Driven by Dream tier companies</p>
          </div>
        </div>

        {/* Multiple Offers */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-bold text-xs uppercase tracking-wider">Multiple Offers</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center justify-center text-sm shadow-xs">
              <FaBriefcase />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <h3 className="text-3xl font-extrabold text-stone-900">{overallMultipleOffers}</h3>
            <p className="text-[11px] text-stone-600 font-semibold mt-2">
              On-Campus: {overallOnCampus}
            </p>
            <p className="text-[11px] text-stone-500 font-medium">
              Off-Campus: {overallOffCampus}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-stone-200/80 bg-white rounded-2xl p-1.5 shadow-xs gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 px-4 font-bold text-xs rounded-xl transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Overview Visual Analytics
        </button>
        <button
          onClick={() => setActiveTab('table')}
          className={`flex-1 py-2.5 px-4 font-bold text-xs rounded-xl transition-all cursor-pointer ${
            activeTab === 'table'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Department Performance Matrix
        </button>
        <button
          onClick={() => setActiveTab('stipend')}
          className={`flex-1 py-2.5 px-4 font-bold text-xs rounded-xl transition-all cursor-pointer ${
            activeTab === 'stipend'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Internship Stipend Reports
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Placed vs Unplaced per Branch */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
              <h4 className="text-base font-bold text-stone-900 tracking-tight">Placed vs Unplaced Students by Branch</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchBarData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                    <XAxis dataKey="name" stroke="#78716C" fontSize={11} tickLine={false} />
                    <YAxis stroke="#78716C" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E7E5E4', fontSize: '12px' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="Placed" fill="#D97706" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Unplaced" fill="#E11D48" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Package Comparison */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
              <h4 className="text-base font-bold text-stone-900 tracking-tight">Package Comparison by Branch (LPA)</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={packageLineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                    <XAxis dataKey="name" stroke="#78716C" fontSize={11} tickLine={false} />
                    <YAxis stroke="#78716C" fontSize={11} tickLine={false} label={{ value: 'LPA', angle: -90, position: 'insideLeft', fill: '#78716C', fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E7E5E4', fontSize: '12px' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="Highest Package" fill="#7C3AED" radius={[6, 6, 0, 0]} barSize={24} />
                    <Line type="monotone" dataKey="Average Package" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Median Package" stroke="#D97706" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 3: On-Campus vs Off-Campus */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-base font-bold text-stone-900 tracking-tight">Campus Placement Distribution</h4>
                <p className="text-xs text-stone-500 mt-0.5">Comparison between On-Campus drives and Off-Campus selection metrics</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
                {campusPieData.length > 0 ? (
                  <>
                    <div className="w-52 h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={campusPieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {campusPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 text-xs">
                      {campusPieData.map((item, index) => (
                        <div key={item.name} className="flex items-center gap-2.5">
                          <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <div>
                            <span className="font-bold text-stone-900">{item.name}</span>
                            <span className="text-stone-500 ml-1.5">({item.value} offers)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-stone-400 text-xs text-center py-10 w-full">No active placement data available</p>
                )}
              </div>
            </div>

            {/* Chart 4: Branch Placed Contribution */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-base font-bold text-stone-900 tracking-tight">Placed Student Share by Branch</h4>
                <p className="text-xs text-stone-500 mt-0.5">Relative contribution of each department to total cohort placements</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
                {branchPieData.length > 0 ? (
                  <>
                    <div className="w-52 h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={branchPieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={75}
                            fill="#8884d8"
                            dataKey="value"
                            labelLine={false}
                          >
                            {branchPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2.5 text-xs">
                      {branchPieData.map((item, index) => (
                        <div key={item.name} className="flex items-center gap-2.5">
                          <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] }} />
                          <div>
                            <span className="font-bold text-stone-900">{item.name}</span>
                            <span className="text-stone-500 ml-1.5">({item.value} placed)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-stone-400 text-xs text-center py-10 w-full">No hired student records found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'table' && (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden space-y-4">
          <div className="p-6 border-b border-stone-200/80 bg-stone-50/50">
            <h4 className="text-base font-bold text-stone-900 tracking-tight">Department Performance Spreadsheet</h4>
            <p className="text-xs text-stone-500 mt-0.5">Comprehensive summary of recruitment stats, package ranges, and offer types</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-900 text-stone-300 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-800">
                  <th className="py-3.5 px-4">Branch</th>
                  <th className="py-3.5 px-4 text-center">Strength</th>
                  <th className="py-3.5 px-4 text-center">Placed</th>
                  <th className="py-3.5 px-4 text-center">Unplaced</th>
                  <th className="py-3.5 px-4 text-center">% Placed</th>
                  <th className="py-3.5 px-4 text-center">Avg CTC</th>
                  <th className="py-3.5 px-4 text-center">Highest CTC</th>
                  <th className="py-3.5 px-4 text-center">Median CTC</th>
                  <th className="py-3.5 px-4 text-center">Campus Type</th>
                  <th className="py-3.5 px-4 text-center">Multiple Offers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/70 text-stone-700 bg-white">
                {stats.map((s) => (
                  <tr key={s.branch} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-stone-900 text-sm">{s.branch}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-stone-800">{s.totalStrength}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                        {s.placed}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                        {s.unplaced}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-extrabold text-amber-700">{s.percentPlaced}%</td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-700">{s.avgLPA} LPA</td>
                    <td className="py-3.5 px-4 text-center font-bold text-purple-700">{s.highestLPA} LPA</td>
                    <td className="py-3.5 px-4 text-center font-medium text-stone-600">{s.medianLPA} LPA</td>
                    <td className="py-3.5 px-4 text-center text-[11px]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-blue-700 font-semibold">On-Campus: {s.onCampus}</span>
                        <span className="text-amber-700 font-semibold">Off-Campus: {s.offCampus}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-extrabold text-stone-900">{s.multipleOffers}</td>
                  </tr>
                ))}
                {/* Summary Row */}
                <tr className="bg-stone-900 text-white font-bold border-t-2 border-amber-600">
                  <td className="py-4 px-4 font-black">Overall Summary</td>
                  <td className="py-4 px-4 text-center">{overallStrength}</td>
                  <td className="py-4 px-4 text-center text-emerald-400">{overallPlaced}</td>
                  <td className="py-4 px-4 text-center text-rose-400">{overallUnplaced}</td>
                  <td className="py-4 px-4 text-center text-amber-400 font-extrabold">{overallPercentPlaced}%</td>
                  <td className="py-4 px-4 text-center text-emerald-400">{overallAvgLPA} LPA</td>
                  <td className="py-4 px-4 text-center text-purple-400">{highestLPA} LPA</td>
                  <td className="py-4 px-4 text-center text-stone-400">-</td>
                  <td className="py-4 px-4 text-center text-[11px]">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-blue-300">On-Campus: {overallOnCampus}</span>
                      <span className="text-amber-300">Off-Campus: {overallOffCampus}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center text-purple-300">{overallMultipleOffers}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'stipend' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart: Stipend Comparison */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
              <h4 className="text-base font-bold text-stone-900 tracking-tight">Internship Stipend Performance (INR/Month)</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stipendBarData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                    <XAxis dataKey="name" stroke="#78716C" fontSize={11} tickLine={false} />
                    <YAxis stroke="#78716C" fontSize={11} tickLine={false} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} contentStyle={{ borderRadius: '12px', border: '1px solid #E7E5E4', fontSize: '12px' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="Average Stipend" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Highest Stipend" fill="#D97706" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Stipend Summary Cards */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-6">
              <div>
                <h4 className="text-base font-bold text-stone-900 tracking-tight">Highest Monthly Stipend</h4>
                <p className="text-xs text-stone-500 mt-0.5 mb-6">Peak internship stipend recorded in this placement season</p>
                <div className="flex items-center gap-4 bg-amber-50 border border-amber-200/80 p-6 rounded-2xl">
                  <div className="p-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl shadow-md">
                    <FaMoneyBillWave className="text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold text-amber-950">₹{highestStipend.toLocaleString()}<span className="text-xs font-semibold text-amber-700"> /mo</span></h3>
                    <p className="text-xs text-amber-800 font-bold mt-1">Top tier technical internship stipend offer</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-stone-200/80 pt-6 space-y-3">
                <h5 className="font-bold text-xs uppercase tracking-wider text-stone-900">Stipends by Branch</h5>
                <div className="space-y-2.5">
                  {stats.map(s => (
                    <div key={s.branch} className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-stone-700">{s.branch} Avg Stipend</span>
                      <span className="font-bold text-amber-700">₹{s.avgStipend.toLocaleString()}/mo</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementStats;
