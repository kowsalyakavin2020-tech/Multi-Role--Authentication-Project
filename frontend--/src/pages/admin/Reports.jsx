import { useState, useEffect } from "react";
import apiClient from "../../../../backend/services/api/apiClient";
import {
  BarChart2, Package, Clock, CheckCircle, XCircle,
  Search, Download, RefreshCw, Calendar,
} from "lucide-react";

function Reports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {};
      if (dateFrom) params.from = dateFrom;
      if (dateTo) params.to = dateTo;
      const response = await apiClient.get("/admin/reports", { params });
      setReports(response.data.data);
    } catch (err) {
      setError("Failed to load reports!");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!reports) return;
    const rows = [
      ["Report Summary"],
      ["Total Orders", reports.total_orders],
      ["Completed", reports.completed_orders],
      ["Pending", reports.pending_orders],
      ["Approved", reports.approved_orders],
      ["Rejected", reports.rejected_orders],
      [],
      ["Top Products"],
      ["Rank", "Product Name", "Orders", "Units Sold"],
      ...(reports.top_products?.map((p, i) => [i + 1, p.name, p.order_count, p.total_qty]) || []),
      [],
      ["Sales Summary (Last 7 Days)"],
      ["Date", "Orders"],
      ...(reports.sales_summary?.map((d) => [d.date, d.count]) || []),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredProducts = reports?.top_products?.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const maxSales = Math.max(...(reports?.sales_summary?.map((d) => d.count) || [1]));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Loading reports...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p className="text-red-700 font-semibold">{error}</p>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart2 className="text-gray-400 w-7 h-7" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
            <p className="text-gray-400 text-sm mt-0.5">View and export system reports</p>
          </div>
        </div>
        <button onClick={handleExportCSV}
          className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
          style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500 font-medium">Filter by date:</span>
        <div className="flex items-center gap-2">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 text-gray-600" />
          <span className="text-gray-400 text-sm">to</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 text-gray-600" />
        </div>
        <button onClick={fetchReports}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-sm font-medium transition">
          <RefreshCw className="w-3.5 h-3.5" /> Apply
        </button>
        {(dateFrom || dateTo) && (
          <button onClick={() => { setDateFrom(""); setDateTo(""); fetchReports(); }}
            className="text-sm text-gray-400 hover:text-red-500 transition">
            Clear
          </button>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total Orders", value: reports?.total_orders ?? 0, icon: <Package className="w-5 h-5" />, from: "#3b82f6", to: "#2563eb" },
          { label: "Completed", value: reports?.completed_orders ?? 0, icon: <CheckCircle className="w-5 h-5" />, from: "#22c55e", to: "#16a34a" },
          { label: "Pending", value: reports?.pending_orders ?? 0, icon: <Clock className="w-5 h-5" />, from: "#f59e0b", to: "#d97706" },
          { label: "Approved", value: reports?.approved_orders ?? 0, icon: <CheckCircle className="w-5 h-5" />, from: "#6366f1", to: "#4f46e5" },
          { label: "Rejected", value: reports?.rejected_orders ?? 0, icon: <XCircle className="w-5 h-5" />, from: "#ef4444", to: "#dc2626" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3 shadow-sm"
            style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              {s.icon}
            </div>
            <div>
              <p className="text-white/75 text-xs font-medium">{s.label}</p>
              <p className="text-white text-2xl font-extrabold leading-none mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-800">Top Products</h3>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input type="text" placeholder="Search..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-blue-400 w-32" />
            </div>
          </div>

          <div className="space-y-2">
            {filteredProducts.length > 0 ? filteredProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition"
                style={{ borderBottom: "1px solid #f8fafc" }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{
                      background: index === 0 ? "linear-gradient(135deg,#f59e0b,#d97706)"
                        : index === 1 ? "linear-gradient(135deg,#94a3b8,#64748b)"
                        : index === 2 ? "linear-gradient(135deg,#a78bfa,#7c3aed)"
                        : "linear-gradient(135deg,#6366f1,#4f46e5)"
                    }}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.order_count} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{product.total_qty}</p>
                  <p className="text-xs text-gray-400">units sold</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Package className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-gray-400 text-sm">No products found</p>
              </div>
            )}
          </div>
        </div>

        {/* Sales Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800">Sales Summary (Last 7 Days)</h3>
          </div>

          {reports?.sales_summary?.length > 0 ? (
            <div className="space-y-3">
              {reports.sales_summary.map((day, index) => (
                <div key={index} className="flex items-center gap-3">
                  <p className="text-xs text-gray-400 font-medium w-20 flex-shrink-0">
                    {new Date(day.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </p>
                  <div className="flex-1 bg-gray-100 rounded-full h-7 relative overflow-hidden">
                    <div
                      className="h-7 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                      style={{
                        width: `${Math.max((day.count / maxSales) * 100, 8)}%`,
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                      }}
                    >
                      <span className="text-white text-xs font-bold">{day.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <BarChart2 className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm font-medium">No sales data</p>
              <p className="text-gray-300 text-xs mt-1">Data will appear once orders are completed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;