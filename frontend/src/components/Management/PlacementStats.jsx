import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart, AreaChart, Area
} from 'recharts';
import {
  FaPercent, FaMoneyBillWave, FaBriefcase,
  FaFileExport, FaChartLine, FaGraduationCap
} from 'react-icons/fa';
import Toast from '../Toast';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const PlacementStats = () => {
  document.title = 'CPMS | Placement Analytics';

  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'table' | 'stipend'

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
        <p className="text-gray-600 font-medium animate-pulse">Loading Placement Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 my-4 text-center">
        <h4 className="font-semibold text-lg mb-2">Error Loading Statistics</h4>
        <p className="mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate Overall aggregates
  const overallStrength = stats.reduce((acc, curr) => acc + curr.totalStrength, 0);
  const overallPlaced = stats.reduce((acc, curr) => acc + curr.placed, 0);
  const overallUnplaced = stats.reduce((acc, curr) => acc + curr.unplaced, 0);
  const overallPercentPlaced = overallStrength > 0 ? parseFloat(((overallPlaced / overallStrength) * 100).toFixed(2)) : 0;
  const overallMultipleOffers = stats.reduce((acc, curr) => acc + curr.multipleOffers, 0);
  const overallOnCampus = stats.reduce((acc, curr) => acc + curr.onCampus, 0);
  const overallOffCampus = stats.reduce((acc, curr) => acc + curr.offCampus, 0);

  const highestLPA = stats.length > 0 ? Math.max(...stats.map(s => s.highestLPA)) : 0;
  const highestStipend = stats.length > 0 ? Math.max(...stats.map(s => s.highestStipend)) : 0;

  // Weighted Average package
  const placedTotalCTC = stats.reduce((acc, curr) => acc + (curr.avgLPA * curr.placed), 0);
  const overallAvgLPA = overallPlaced > 0 ? parseFloat((placedTotalCTC / overallPlaced).toFixed(2)) : 0;

  // Chart Data formatters
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
    <div className="p-1 space-y-6">
      {/* Toast Notification */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {/* Header section with summary and export button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-indigo-700 via-indigo-800 to-blue-900 rounded-2xl p-6 text-white shadow-xl gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Placement Statistics & Insights</h2>
          <p className="text-indigo-100 mt-1 text-sm sm:text-base">Real-time analytical metrics, packages, and department summaries</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base"
        >
          <FaFileExport />
          <span>Export Summary (CSV)</span>
        </button>
      </div>

      {/* Top Level Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Overall Placement % */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl hover:border-indigo-100 transition duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition duration-300"></div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-semibold text-sm tracking-wide uppercase">Placement Rate</span>
            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
              <FaPercent className="text-lg" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-gray-800">{overallPercentPlaced}%</h3>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mt-3 overflow-hidden">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${overallPercentPlaced}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              {overallPlaced} of {overallStrength} students placed
            </p>
          </div>
        </div>

        {/* Card 2: Average CTC */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl hover:border-emerald-100 transition duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition duration-300"></div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-semibold text-sm tracking-wide uppercase">Average Package</span>
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
              <FaMoneyBillWave className="text-lg" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-gray-800">{overallAvgLPA} LPA</h3>
            <p className="text-xs text-emerald-600 mt-2 font-semibold flex items-center gap-1">
              <FaChartLine />
              <span>Overall weighted average</span>
            </p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Calculated across hired candidates</p>
          </div>
        </div>

        {/* Card 3: Highest CTC */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl hover:border-amber-100 transition duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition duration-300"></div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-semibold text-sm tracking-wide uppercase">Highest CTC Offered</span>
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
              <FaGraduationCap className="text-lg" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-gray-800">{highestLPA} LPA</h3>
            <p className="text-xs text-amber-600 mt-2 font-semibold flex items-center gap-1">
              <span>★ Peak offer in cohort</span>
            </p>
            <p className="text-xs text-gray-500 mt-1 font-medium">Driven by Dream category listings</p>
          </div>
        </div>

        {/* Card 4: Placements Overview */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl hover:border-violet-100 transition duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-50 rounded-bl-full -z-10 group-hover:scale-110 transition duration-300"></div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-semibold text-sm tracking-wide uppercase">Multiple Offers</span>
            <div className="p-3 bg-violet-100 rounded-xl text-violet-600">
              <FaBriefcase className="text-lg" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-gray-800">{overallMultipleOffers}</h3>
            <p className="text-xs text-gray-500 mt-2 font-semibold">
              On-Campus Placements: {overallOnCampus}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">
              Off-Campus Placements: {overallOffCampus}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition duration-300 ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
          }`}
        >
          Overview Charts
        </button>
        <button
          onClick={() => setActiveTab('table')}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition duration-300 ${
            activeTab === 'table'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
          }`}
        >
          Detailed Branch Report
        </button>
        <button
          onClick={() => setActiveTab('stipend')}
          className={`py-3 px-6 font-semibold text-sm border-b-2 transition duration-300 ${
            activeTab === 'stipend'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
          }`}
        >
          Stipend Reports
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Chart Rows */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Placed vs Unplaced per Branch */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Placed vs Unplaced Students by Branch</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchBarData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                    <Legend iconType="circle" />
                    <Bar dataKey="Placed" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Unplaced" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Package Comparison */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Package Comparison by Branch (LPA)</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={packageLineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} label={{ value: 'LPA', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                    <Legend iconType="circle" />
                    <Bar dataKey="Highest Package" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={25} />
                    <Line type="monotone" dataKey="Average Package" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
                    <Line type="monotone" dataKey="Median Package" stroke="#4F46E5" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 3: On-Campus vs Off-Campus */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Campus Placement Distribution</h4>
                <p className="text-sm text-gray-500 mb-4">Comparison between On-Campus drives and Off-Campus selection metrics</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                {campusPieData.length > 0 ? (
                  <>
                    <div className="w-56 h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={campusPieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
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
                    <div className="space-y-4">
                      {campusPieData.map((item, index) => (
                        <div key={item.name} className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <div>
                            <span className="font-semibold text-gray-800">{item.name}</span>
                            <span className="text-gray-500 ml-2">({item.value} offers)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-10 w-full">No active placement data available</p>
                )}
              </div>
            </div>

            {/* Chart 4: Branch Placed Contribution */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Placed Student Share by Branch</h4>
                <p className="text-sm text-gray-500 mb-4">Relative contribution of each department to total cohort placements</p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                {branchPieData.length > 0 ? (
                  <>
                    <div className="w-56 h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={branchPieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
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
                    <div className="space-y-3">
                      {branchPieData.map((item, index) => (
                        <div key={item.name} className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] }}></div>
                          <div>
                            <span className="font-semibold text-gray-800">{item.name}</span>
                            <span className="text-gray-500 ml-2">({item.value} placed)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-10 w-full">No hired student records found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'table' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h4 className="text-lg font-bold text-gray-800">Department Performance Spreadsheet</h4>
            <p className="text-xs text-gray-500">Comprehensive summary of recruitment stats, package ranges, and offer types</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 text-gray-700 font-semibold text-xs tracking-wider uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">Branch</th>
                  <th scope="col" className="px-6 py-3 text-center">Strength</th>
                  <th scope="col" className="px-6 py-3 text-center">Placed</th>
                  <th scope="col" className="px-6 py-3 text-center">Unplaced</th>
                  <th scope="col" className="px-6 py-3 text-center">% Placed</th>
                  <th scope="col" className="px-6 py-3 text-center">Avg CTC</th>
                  <th scope="col" className="px-6 py-3 text-center">Highest CTC</th>
                  <th scope="col" className="px-6 py-3 text-center">Median CTC</th>
                  <th scope="col" className="px-6 py-3 text-center">Campus Type</th>
                  <th scope="col" className="px-6 py-3 text-center">Multiple Offers</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                {stats.map((s, index) => (
                  <tr 
                    key={s.branch} 
                    className="hover:bg-indigo-50/20 transition duration-150 cursor-pointer"
                  >
                    <td className="px-6 py-4 font-bold text-indigo-700">{s.branch}</td>
                    <td className="px-6 py-4 text-center font-medium">{s.totalStrength}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {s.placed}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-rose-100 text-rose-800 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {s.unplaced}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-800">{s.percentPlaced}%</td>
                    <td className="px-6 py-4 text-center font-semibold text-emerald-600">{s.avgLPA} LPA</td>
                    <td className="px-6 py-4 text-center font-semibold text-indigo-600">{s.highestLPA} LPA</td>
                    <td className="px-6 py-4 text-center font-medium text-gray-600">{s.medianLPA} LPA</td>
                    <td className="px-6 py-4 text-center text-xs">
                      <div className="flex flex-col gap-0.5 justify-center">
                        <span className="text-blue-700 font-medium">On-Campus: {s.onCampus}</span>
                        <span className="text-amber-700 font-medium">Off-Campus: {s.offCampus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {s.multipleOffers}
                      </span>
                    </td>
                  </tr>
                ))}
                {/* Overall Aggregations Row */}
                <tr className="bg-indigo-50/50 font-semibold border-t-2 border-indigo-200">
                  <td className="px-6 py-4 font-black text-indigo-900">Overall Summary</td>
                  <td className="px-6 py-4 text-center font-black">{overallStrength}</td>
                  <td className="px-6 py-4 text-center font-black text-emerald-700">{overallPlaced}</td>
                  <td className="px-6 py-4 text-center font-black text-rose-700">{overallUnplaced}</td>
                  <td className="px-6 py-4 text-center font-black text-indigo-950">{overallPercentPlaced}%</td>
                  <td className="px-6 py-4 text-center font-black text-emerald-600">{overallAvgLPA} LPA</td>
                  <td className="px-6 py-4 text-center font-black text-indigo-600">{highestLPA} LPA</td>
                  <td className="px-6 py-4 text-center font-black text-gray-600">-</td>
                  <td className="px-6 py-4 text-center text-xs">
                    <div className="flex flex-col gap-0.5 justify-center font-bold">
                      <span className="text-blue-800">On-Campus: {overallOnCampus}</span>
                      <span className="text-amber-800">Off-Campus: {overallOffCampus}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-black text-purple-700">{overallMultipleOffers}</td>
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
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Internship Stipend Performance (INR/Month)</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stipendBarData} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                    <Legend iconType="circle" />
                    <Bar dataKey="Average Stipend" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Highest Stipend" fill="#EC4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Stipend Summary Cards */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Highest Monthly Stipend</h4>
                <p className="text-sm text-gray-500 mb-6">Peak internship stipend recorded in this placement season</p>
                <div className="flex items-center gap-4 bg-purple-50 border border-purple-100 p-6 rounded-2xl">
                  <div className="p-4 bg-purple-600 text-white rounded-2xl shadow-lg">
                    <FaMoneyBillWave className="text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-purple-900">₹{highestStipend.toLocaleString()}<span className="text-sm font-semibold text-purple-500"> /mo</span></h3>
                    <p className="text-sm text-purple-700 font-semibold mt-1">Top tier technical internship offer</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-gray-100 pt-6">
                <h5 className="font-bold text-gray-800 mb-3">Stipends by Branch</h5>
                <div className="space-y-3">
                  {stats.map(s => (
                    <div key={s.branch} className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-gray-700">{s.branch} Avg Stipend</span>
                      <span className="font-bold text-purple-700">₹{s.avgStipend.toLocaleString()}/mo</span>
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
