import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Key,
  Users,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  Copy,
  Clock,
  DollarSign,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { AccessCode, Language, UserSessionLog } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface AdminModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  language,
  isOpen,
  onClose,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.uz;

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'codes' | 'users'>('codes');
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [sessions, setSessions] = useState<UserSessionLog[]>([]);
  const [loading, setLoading] = useState(false);

  // New code form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newPrice, setNewPrice] = useState('70 000 so‘m');
  const [newPaymentStatus, setNewPaymentStatus] = useState<'paid' | 'pending' | 'demo'>('paid');
  const [formMsg, setFormMsg] = useState<string | null>(null);

  // Copy indicator
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdminAuthenticated(true);
        fetchAdminData();
      } else {
        setAuthError(data.message || 'Admin paroli noto‘g‘ri!');
      }
    } catch {
      // Offline fallback
      if (adminPassword === 'admin7o2' || adminPassword === '07080717') {
        setIsAdminAuthenticated(true);
        fetchAdminData();
      } else {
        setAuthError('Admin paroli noto‘g‘ri!');
      }
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      const data = await res.json();
      if (data.success) {
        setCodes(data.codes || []);
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.warn('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated && isOpen) {
      fetchAdminData();
    }
  }, [isAdminAuthenticated, isOpen]);

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    try {
      const res = await fetch('/api/admin/create-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCode.trim(),
          label: newLabel.trim() || 'Telegram mijozi',
          price: newPrice,
          paymentStatus: newPaymentStatus,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormMsg('Yangi kod muvaffaqiyatli yaratildi!');
        setNewCode('');
        setNewLabel('');
        setShowCreateForm(false);
        fetchAdminData();
        setTimeout(() => setFormMsg(null), 3000);
      } else {
        setFormMsg(data.message || 'Xatolik yuz berdi');
      }
    } catch {
      setFormMsg('Server bilan aloqa uzildi.');
    }
  };

  const handleToggleCode = async (code: string) => {
    try {
      const res = await fetch('/api/admin/toggle-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generateRandomCode = () => {
    const random8 = Math.floor(10000000 + Math.random() * 90000000).toString();
    setNewCode(random8);
  };

  const copyToClipboard = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedCode(val);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {t.adminPortalTitle}
              </h3>
              <p className="text-xs text-slate-400">
                To‘lovlar, kirish kodlari va foydalanuvchilar nazorati
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {!isAdminAuthenticated ? (
          /* Password Authentication Gate */
          <div className="p-8 text-center max-w-md mx-auto my-auto">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Lock className="h-7 w-7" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">
              Himoyalangan boshqaruv paneli
            </h4>
            <p className="text-xs text-slate-400 mb-6">
              Faqat tizim egasi va administratorlar uchun. Kirish parolini kiriting. (Standart: admin7o2)
            </p>

            {authError && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder={t.adminPasswordLabel}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:brightness-110 transition cursor-pointer"
              >
                Kirish
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Nav Tabs & Refresh */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('codes')}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'codes'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Key className="h-4 w-4" />
                  <span>{t.manageCodes} ({codes.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>{t.userSessions} ({sessions.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchAdminData}
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 transition cursor-pointer"
                  title="Yangilash"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Yangilash</span>
                </button>
                {activeTab === 'codes' && (
                  <button
                    onClick={() => {
                      setShowCreateForm(!showCreateForm);
                      generateRandomCode();
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md transition cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t.createNewCode}</span>
                  </button>
                )}
              </div>
            </div>

            {formMsg && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-300">
                {formMsg}
              </div>
            )}

            {/* Create Code Form */}
            {showCreateForm && (
              <form
                onSubmit={handleCreateCode}
                className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 space-y-4 animate-in slide-in-from-top-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Key className="h-4 w-4 text-indigo-400" />
                    <span>Yangi 8 xonali kirish kodi yaratish</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Bekor qilish
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Kirish kodi (8 xonali)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        className="flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={generateRandomCode}
                        className="rounded-xl bg-white/10 px-2.5 py-2 hover:bg-white/20 text-slate-300"
                        title="Tasodifiy generatsiya"
                      >
                        Generatsiya
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Mijoz ismi / Izoh
                    </label>
                    <input
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Telegram: @username"
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Narxi
                    </label>
                    <input
                      type="text"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      To‘lov holati
                    </label>
                    <select
                      value={newPaymentStatus}
                      onChange={(e) => setNewPaymentStatus(e.target.value as any)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                    >
                      <option value="paid">To‘langan (Tasdiqlangan)</option>
                      <option value="pending">Kutilmoqda</option>
                      <option value="demo">Sinov / Demo</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md cursor-pointer"
                  >
                    Kodni saqlash va faollashtirish
                  </button>
                </div>
              </form>
            )}

            {/* TAB: Codes Table */}
            {activeTab === 'codes' && (
              <div className="space-y-3">
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/40">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-white/10 bg-white/5 text-slate-400">
                      <tr>
                        <th className="py-3 px-4">Kod</th>
                        <th className="py-3 px-4">Tavsif / Mijoz</th>
                        <th className="py-3 px-4">Narxi</th>
                        <th className="py-3 px-4">To‘lov</th>
                        <th className="py-3 px-4">Ishlatilgan</th>
                        <th className="py-3 px-4">Holat</th>
                        <th className="py-3 px-4 text-right">Amal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {codes.map((item) => (
                        <tr key={item.code} className="hover:bg-white/5 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 font-mono font-bold text-indigo-300">
                              <span>{item.code}</span>
                              <button
                                onClick={() => copyToClipboard(item.code)}
                                className="rounded p-1 hover:bg-white/10 text-slate-400 hover:text-white"
                                title="Nusxalash"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                              {copiedCode === item.code && (
                                <span className="text-[10px] text-emerald-400">Nusxalandi!</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-medium">
                            {item.label}
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {item.price}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                item.paymentStatus === 'paid'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : item.paymentStatus === 'demo'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {item.paymentStatus === 'paid'
                                ? 'To‘langan'
                                : item.paymentStatus === 'demo'
                                ? 'Demo'
                                : 'Kutilmoqda'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono">
                            {item.usageCount} marta
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`flex items-center gap-1 font-semibold ${
                                item.status === 'active'
                                  ? 'text-emerald-400'
                                  : 'text-red-400'
                              }`}
                            >
                              {item.status === 'active' ? (
                                <CheckCircle className="h-3.5 w-3.5" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5" />
                              )}
                              <span>{item.status === 'active' ? 'Faol' : 'Bekor qilingan'}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {item.code !== '07080717' && (
                              <button
                                onClick={() => handleToggleCode(item.code)}
                                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                                  item.status === 'active'
                                    ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                                }`}
                              >
                                {item.status === 'active' ? t.revokeCode : t.activateCode}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: User Logins */}
            {activeTab === 'users' && (
              <div className="space-y-3">
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/40">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-white/10 bg-white/5 text-slate-400">
                      <tr>
                        <th className="py-3 px-4">Foydalanuvchi</th>
                        <th className="py-3 px-4">Telefon</th>
                        <th className="py-3 px-4">Ishlatilgan kod</th>
                        <th className="py-3 px-4">Kirish vaqti</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sessions.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-500">
                            Hozircha tizimga kirgan foydalanuvchilar mavjud emas.
                          </td>
                        </tr>
                      ) : (
                        sessions.map((sess) => (
                          <tr key={sess.id} className="hover:bg-white/5 transition">
                            <td className="py-3 px-4 font-semibold text-white">
                              {sess.name}
                            </td>
                            <td className="py-3 px-4 text-slate-300 font-mono">
                              {sess.phone}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-indigo-300">
                                {sess.codeUsed}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-400 flex items-center gap-1.5">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(sess.loginTime).toLocaleString('uz-UZ')}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
