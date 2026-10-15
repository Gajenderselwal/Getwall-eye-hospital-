import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Phone,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  Settings,
  Image as ImageIcon,
  UserCheck,
  Building,
  LogOut,
  RefreshCw,
  Plus,
  AlertTriangle,
  Eye,
  MessageCircle,
} from 'lucide-react';
import { Appointment, HospitalInfo } from '../../types.ts';

interface AdminDashboardProps {
  token: string;
  adminUser: { email: string; name: string };
  onLogout: () => void;
  onBackToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  adminUser,
  onLogout,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'settings' | 'gallery'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);

  // New gallery image form state
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageCategory, setNewImageCategory] = useState<'exterior' | 'interior' | 'consultation' | 'equipment'>('consultation');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');

  // Editable settings form state
  const [editablePhone, setEditablePhone] = useState('');
  const [editableSecondaryPhone, setEditableSecondaryPhone] = useState('');
  const [editableWhatsapp, setEditableWhatsapp] = useState('');
  const [editableAddress, setEditableAddress] = useState('');
  const [editableMapsUrl, setEditableMapsUrl] = useState('');
  const [editableHours, setEditableHours] = useState('');
  const [editableDoctorName, setEditableDoctorName] = useState('');
  const [editableDoctorTitle, setEditableDoctorTitle] = useState('');
  const [editableDoctorQualifications, setEditableDoctorQualifications] = useState('');
  const [editableDoctorExperience, setEditableDoctorExperience] = useState('');
  const [editableDoctorBio, setEditableDoctorBio] = useState('');
  const [editableDoctorImage, setEditableDoctorImage] = useState('');

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Appointments (protected)
      const apptRes = await fetch('/api/admin/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (apptRes.status === 401) {
        onLogout();
        return;
      }
      const apptData = await apptRes.json();
      setAppointments(apptData.appointments || []);

      // 2. Hospital Info
      const infoRes = await fetch('/api/hospital-info');
      const infoData: HospitalInfo = await infoRes.json();
      setHospitalInfo(infoData);

      // Populate settings form
      setEditablePhone(infoData.phone);
      setEditableSecondaryPhone(infoData.secondaryPhone || '');
      setEditableWhatsapp(infoData.whatsappNumber || '');
      setEditableAddress(infoData.address);
      setEditableMapsUrl(infoData.googleMapsUrl);
      setEditableHours(infoData.openingHours);
      setEditableDoctorName(infoData.doctor.name);
      setEditableDoctorTitle(infoData.doctor.title);
      setEditableDoctorQualifications(infoData.doctor.qualifications);
      setEditableDoctorExperience(infoData.doctor.experience);
      setEditableDoctorBio(infoData.doctor.bio);
      setEditableDoctorImage(infoData.doctor.image);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update appointment status
  const handleStatusChange = async (id: string, newStatus: Appointment['status']) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? data.appointment : a))
        );
        if (selectedAppointment && selectedAppointment.id === id) {
          setSelectedAppointment(data.appointment);
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete appointment
  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        setDeleteConfirmId(null);
        if (selectedAppointment && selectedAppointment.id === id) {
          setSelectedAppointment(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete appointment:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setSettingsSuccess(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone: editablePhone,
          secondaryPhone: editableSecondaryPhone,
          whatsappNumber: editableWhatsapp,
          address: editableAddress,
          googleMapsUrl: editableMapsUrl,
          openingHours: editableHours,
          doctor: {
            ...hospitalInfo?.doctor,
            name: editableDoctorName,
            title: editableDoctorTitle,
            qualifications: editableDoctorQualifications,
            experience: editableDoctorExperience,
            bio: editableDoctorBio,
            image: editableDoctorImage,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setHospitalInfo(data.hospitalInfo);
        setSettingsSuccess('Hospital configuration and doctor profile updated successfully!');
        setTimeout(() => setSettingsSuccess(null), 4000);
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Add Gallery Image
  const handleAddGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl || !newImageTitle) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newImageTitle,
          category: newImageCategory,
          imageUrl: newImageUrl,
          altText: newImageAlt || newImageTitle,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (hospitalInfo) {
          setHospitalInfo({ ...hospitalInfo, gallery: data.gallery });
        }
        setNewImageTitle('');
        setNewImageUrl('');
        setNewImageAlt('');
      }
    } catch (err) {
      console.error('Failed to add gallery image:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Gallery Image
  const handleDeleteGalleryImage = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (hospitalInfo) {
          setHospitalInfo({ ...hospitalInfo, gallery: data.gallery });
        }
      }
    } catch (err) {
      console.error('Failed to delete gallery image:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Copy details helper
  const handleCopyDetails = (appt: Appointment) => {
    const text = `GetWell Eye Hospital Appointment\nID: ${appt.id}\nPatient: ${appt.patientName}\nPhone: ${appt.phoneNumber}\nDate: ${appt.requestedDate}\nStatus: ${appt.status}\nReason: ${appt.visitReason || 'General Examination'}`;
    navigator.clipboard.writeText(text);
    setCopyFeedback(appt.id);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Patient Name', 'Phone', 'Requested Date', 'Status', 'Reason', 'Created At'];
    const rows = filteredAppointments.map((a) => [
      `"${a.id}"`,
      `"${a.patientName.replace(/"/g, '""')}"`,
      `"${a.cleanPhoneNumber}"`,
      `"${a.requestedDate}"`,
      `"${a.status}"`,
      `"${(a.visitReason || '').replace(/"/g, '""')}"`,
      `"${a.createdAt}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GetWell_Appointments_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Stats calculation
  const totalCount = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

  // Filtered appointments
  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      searchQuery === '' ||
      appt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.phoneNumber.includes(searchQuery) ||
      appt.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;
    const matchesDate = dateFilter === '' || appt.requestedDate === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-16 text-left">
      
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base sm:text-lg">GetWell Eye Hospital</span>
                <span className="hidden sm:inline-block ml-2 text-xs bg-sky-800/80 text-sky-200 px-2 py-0.5 rounded-full font-medium">
                  Admin Dashboard
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onBackToHome}
                type="button"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Public Site</span>
              </button>

              <div className="text-xs text-slate-300 hidden md:block">
                <span>{adminUser.email}</span>
              </div>

              <button
                onClick={onLogout}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-300 mb-6 gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('appointments')}
            type="button"
            className={`pb-3 px-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'appointments'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Appointments</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            type="button"
            className={`pb-3 px-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Hospital Settings & Doctor</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            type="button"
            className={`pb-3 px-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'gallery'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Photo Gallery Management</span>
          </button>
        </div>

        {/* TAB 1: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            
            {/* Overview Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Requests</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 block">{totalCount}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs bg-amber-50/30">
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">Pending</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-1 block">{pendingCount}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-sky-200 shadow-2xs bg-sky-50/30">
                <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider block">Confirmed</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-sky-700 mt-1 block">{confirmedCount}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs bg-emerald-50/30">
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">Completed</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1 block">{completedCount}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-2xs bg-rose-50/30 col-span-2 sm:col-span-1">
                <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block">Cancelled</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-700 mt-1 block">{cancelledCount}</span>
              </div>
            </div>

            {/* Filter and Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search patient name, phone, or ID..."
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white text-slate-700 font-medium cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {/* Date Filter */}
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white text-slate-700"
                  title="Filter by appointment date"
                />

                {(searchQuery || statusFilter !== 'all' || dateFilter) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setDateFilter('');
                    }}
                    type="button"
                    className="text-xs text-sky-600 hover:underline font-semibold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchData}
                  type="button"
                  className="p-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 cursor-pointer"
                  title="Refresh list"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleExportCSV}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Appointments List / Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              {filteredAppointments.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-700 text-base">No appointments found</h4>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or status filter.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Patient & Phone</th>
                        <th className="py-3 px-4">Appointment Date</th>
                        <th className="py-3 px-4">Visit Reason</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Submitted At</th>
                        <th className="py-3 px-4 text-right">Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAppointments.map((appt) => (
                        <tr key={appt.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{appt.patientName}</div>
                            <div className="text-xs text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                              <span>{appt.cleanPhoneNumber}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              ID: {appt.id}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-slate-800">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-sky-600" />
                              <span>{appt.requestedDate}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                            <span className="line-clamp-2 text-xs">
                              {appt.visitReason || <em className="text-slate-400">Routine Vision Checkup</em>}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <select
                              value={appt.status}
                              onChange={(e) => handleStatusChange(appt.id, e.target.value as any)}
                              className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer ${
                                appt.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : appt.status === 'Confirmed'
                                  ? 'bg-sky-50 text-sky-800 border-sky-300'
                                  : appt.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : 'bg-rose-50 text-rose-800 border-rose-300'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-xs text-slate-400">
                            {new Date(appt.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`tel:${appt.phoneNumber.replace(/[\s\+]/g, '')}`}
                                className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
                                title={`Call patient ${appt.patientName}`}
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                              <a
                                href={`https://wa.me/${appt.phoneNumber.replace(/[\s\+]/g, '')}?text=${encodeURIComponent(
                                  `Hello ${appt.patientName}, this is GetWell Eye Hospital Bikaner regarding your appointment request for ${appt.requestedDate}.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                title="Message on WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleCopyDetails(appt)}
                                type="button"
                                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                                title="Copy details to clipboard"
                              >
                                {copyFeedback === appt.id ? (
                                  <CheckCircle className="w-4 h-4 text-teal-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(appt.id)}
                                type="button"
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: HOSPITAL SETTINGS & DOCTOR */}
        {activeTab === 'settings' && hospitalInfo && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Hospital Contact & Doctor Configuration</h3>
              <p className="text-xs text-slate-500 mt-1">
                All details updated here are immediately reflected across the public website and booking flows.
              </p>
            </div>

            {settingsSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{settingsSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Section A: Contact Details */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>Contact & Helpline Numbers</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Primary Mobile (Click-to-Call)</label>
                    <input
                      type="text"
                      value={editablePhone}
                      onChange={(e) => setEditablePhone(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-sky-600 focus:ring-1 focus:ring-sky-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Secondary Landline Number</label>
                    <input
                      type="text"
                      value={editableSecondaryPhone}
                      onChange={(e) => setEditableSecondaryPhone(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-sky-600 focus:ring-1 focus:ring-sky-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">WhatsApp Business Number</label>
                    <input
                      type="text"
                      value={editableWhatsapp}
                      onChange={(e) => setEditableWhatsapp(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-sky-600 focus:ring-1 focus:ring-sky-200"
                    />
                  </div>
                </div>
              </div>

              {/* Section B: Address and Hours */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  <Building className="w-4 h-4 text-sky-600" />
                  <span>Address & Operating Hours</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Physical Address</label>
                    <input
                      type="text"
                      value={editableAddress}
                      onChange={(e) => setEditableAddress(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-sky-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Google Maps URL</label>
                    <input
                      type="text"
                      value={editableMapsUrl}
                      onChange={(e) => setEditableMapsUrl(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-sky-600"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700">Opening Hours Notice</label>
                    <input
                      type="text"
                      value={editableHours}
                      onChange={(e) => setEditableHours(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-sky-600"
                    />
                  </div>
                </div>
              </div>

              {/* Section C: Doctor Profile */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-sky-600" />
                  <span>Doctor Profile (Ophthalmologist)</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Doctor Full Name</label>
                    <input
                      type="text"
                      value={editableDoctorName}
                      onChange={(e) => setEditableDoctorName(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-sky-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Title / Designation</label>
                    <input
                      type="text"
                      value={editableDoctorTitle}
                      onChange={(e) => setEditableDoctorTitle(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-sky-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Medical Qualifications</label>
                    <input
                      type="text"
                      value={editableDoctorQualifications}
                      onChange={(e) => setEditableDoctorQualifications(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-sky-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Clinical Experience</label>
                    <input
                      type="text"
                      value={editableDoctorExperience}
                      onChange={(e) => setEditableDoctorExperience(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-sky-600"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700">Doctor Photograph URL</label>
                    <input
                      type="text"
                      value={editableDoctorImage}
                      onChange={(e) => setEditableDoctorImage(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-sky-600"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700">Biography & Specialty Summary</label>
                    <textarea
                      rows={3}
                      value={editableDoctorBio}
                      onChange={(e) => setEditableDoctorBio(e.target.value)}
                      className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:border-sky-600"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm cursor-pointer shadow-md"
                >
                  {actionLoading ? 'Saving changes...' : 'Save Hospital & Doctor Settings'}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 3: GALLERY MANAGEMENT */}
        {activeTab === 'gallery' && hospitalInfo && (
          <div className="space-y-8">
            
            {/* Add New Image Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-600" />
                <span>Upload / Add New Hospital Photograph</span>
              </h3>

              <form onSubmit={handleAddGalleryImage} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Photo Title</label>
                  <input
                    type="text"
                    required
                    value={newImageTitle}
                    onChange={(e) => setNewImageTitle(e.target.value)}
                    placeholder="e.g. Slit Lamp Examination Suite"
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={newImageCategory}
                    onChange={(e) => setNewImageCategory(e.target.value as any)}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white"
                  >
                    <option value="exterior">Exterior & Entrance</option>
                    <option value="interior">Reception & Waiting</option>
                    <option value="consultation">Consultation Suite</option>
                    <option value="equipment">Diagnostic Equipment</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700">Image URL</label>
                  <input
                    type="url"
                    required
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://... image link"
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700">Alt Description (SEO & Accessibility)</label>
                  <input
                    type="text"
                    value={newImageAlt}
                    onChange={(e) => setNewImageAlt(e.target.value)}
                    placeholder="Accurate description of the equipment or room"
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm cursor-pointer shadow-xs"
                  >
                    {actionLoading ? 'Adding...' : 'Add to Gallery'}
                  </button>
                </div>
              </form>
            </div>

            {/* Current Gallery Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Current Gallery Images ({hospitalInfo.gallery.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {hospitalInfo.gallery.map((img) => (
                  <div key={img.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="h-40 overflow-hidden bg-slate-200">
                        <img src={img.imageUrl} alt={img.altText} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded uppercase">
                          {img.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{img.title}</h4>
                      </div>
                    </div>
                    <div className="p-3 border-t border-slate-200 bg-white flex justify-end">
                      <button
                        onClick={() => handleDeleteGalleryImage(img.id)}
                        type="button"
                        className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Explicit Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-left space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Confirm Appointment Deletion</h3>
              <p className="text-xs text-slate-600 mt-1">
                Are you sure you want to permanently delete appointment record <span className="font-mono font-bold">{deleteConfirmId}</span>? This operation cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                type="button"
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                type="button"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
