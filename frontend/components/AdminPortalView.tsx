import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  ShieldAlert,
  Upload,
  CheckCircle2,
  Archive,
  Layers,
  Database,
  GitCompare,
  Sparkles,
  BarChart3,
  ThumbsUp,
  MessageSquare,
  Clock,
  ArrowRight,
  FileCheck,
} from 'lucide-react';

export const AdminPortalView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'version_diff' | 'feedback'>('overview');
  const [versionDiff, setVersionDiff] = useState<any>(null);

  // Document upload state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    ministry: '',
    department: '',
    version: '1.0',
    sourceUrl: '',
    textContent: '',
  });
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    setLoading(true);
    try {
      const [dashRes, diffRes] = await Promise.all([
        api.getAdminDashboard(),
        api.getVersionComparison(),
      ]);
      setData(dashRes);
      setVersionDiff(diffRes);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (docId: string) => {
    try {
      await api.approveDocument(docId);
      await fetchDashboard();
    } catch (e) {
      console.error(e);
    }
  };

  const handleArchive = async (docId: string) => {
    try {
      await api.archiveDocument(docId);
      await fetchDashboard();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.textContent) return;

    try {
      await api.uploadAdminDocument(uploadForm);
      setUploadSuccess(true);
      setUploadForm({
        title: '',
        ministry: '',
        department: '',
        version: '1.0',
        sourceUrl: '',
        textContent: '',
      });
      setTimeout(() => setUploadSuccess(false), 4000);
      await fetchDashboard();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500">
        <Sparkles className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold">Loading Admin & Governance Portal...</p>
      </div>
    );
  }

  const analytics = data?.analytics || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-semibold mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Civic Governance & Knowledge Management</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrator & Reviewer Portal
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            Manage scheme gazette documents, inspect RAG chunk indexes, verify version diffs, and review real citizen query logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('upload')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Ingest Document</span>
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Schemes</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{analytics.activeSchemes || 8}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% Verified Rules</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Indexed Chunks</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{analytics.totalChunks || 10}</div>
          <div className="text-[11px] text-slate-500 mt-1">Embeddings + Keyword RAG</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sources Registered</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{analytics.totalDocuments || 8}</div>
          <div className="text-[11px] text-slate-500 mt-1">Official Ministry Gazettes</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Citizen Queries</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{analytics.totalQueries || 14}</div>
          <div className="text-[11px] text-slate-500 mt-1">Asha Multilingual Live</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 bg-white rounded-2xl p-1 shadow-xs flex overflow-x-auto gap-2">
        {[
          { id: 'overview', label: 'Document Review & Approvals', icon: Layers },
          { id: 'version_diff', label: 'Version Diff Comparison (v2.8 vs v3.2)', icon: GitCompare },
          { id: 'upload', label: 'Ingest New Guideline Circular', icon: Upload },
          { id: 'feedback', label: 'Citizen Interaction Logs', icon: MessageSquare },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Document Review */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Ingested Official Documents & Lifecycle Status</h3>
          <div className="space-y-3">
            {data?.sources?.map((src: any) => (
              <div
                key={src.documentId}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        src.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : src.status === 'UNDER_REVIEW'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {src.status}
                    </span>
                    <span className="text-xs font-bold text-slate-800">Version {src.version}</span>
                    <span className="text-xs text-slate-500 font-mono">[{src.documentId}]</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{src.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{src.ministry}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {src.status !== 'ACTIVE' && (
                    <button
                      onClick={() => handleApprove(src.documentId)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Active</span>
                    </button>
                  )}
                  {src.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleArchive(src.documentId)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archive</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Version Diff Comparison */}
      {activeTab === 'version_diff' && versionDiff && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <div className="text-xs font-bold uppercase text-amber-600 tracking-wider">
              Automatic Policy Revision Tracking
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{versionDiff.schemeName}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Highlighting key eligibility ceiling and disbursement rule changes between annual cycles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Version A: Old */}
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-900 text-sm">Previous Version ({versionDiff.versionA.version})</span>
                <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                  {versionDiff.versionA.status}
                </span>
              </div>
              <div><strong>Academic Cycle:</strong> {versionDiff.versionA.year}</div>
              <div><strong>Income Ceiling:</strong> {versionDiff.versionA.incomeLimit}</div>
              <div><strong>Maintenance Grant:</strong> {versionDiff.versionA.maintenanceAllowance}</div>
              <div><strong>Disbursement Mode:</strong> {versionDiff.versionA.mode}</div>
            </div>

            {/* Version B: Current Active */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-300 text-xs space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 text-sm">Current Active Version ({versionDiff.versionB.version})</span>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {versionDiff.versionB.status}
                </span>
              </div>
              <div><strong>Academic Cycle:</strong> {versionDiff.versionB.year}</div>
              <div><strong>Income Ceiling:</strong> <span className="text-emerald-800 font-bold">{versionDiff.versionB.incomeLimit}</span> (Expanded)</div>
              <div><strong>Maintenance Grant:</strong> <span className="text-emerald-800 font-bold">{versionDiff.versionB.maintenanceAllowance}</span></div>
              <div><strong>Disbursement Mode:</strong> <span className="text-emerald-800 font-bold">{versionDiff.versionB.mode}</span></div>
            </div>
          </div>

          {/* Change Summary Table */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Structured Rule Changes</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Rule / Field</th>
                    <th className="py-2.5 px-3">Old Value</th>
                    <th className="py-2.5 px-3">New Value (2026)</th>
                    <th className="py-2.5 px-3">Impact Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {versionDiff.changes.map((c: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{c.field}</td>
                      <td className="py-2.5 px-3 text-slate-500 line-through">{c.oldVal}</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-bold">{c.newVal}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          {c.changeType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Ingest Document */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5 max-w-2xl">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Ingest New Official Ministry Circular</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Uploads are automatically chunked, tagged with page & section metadata, and indexed into Asha AI's RAG knowledge repository.
            </p>
          </div>

          {uploadSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Document successfully ingested and indexed into RAG memory!</span>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Document / Scheme Title</label>
              <input
                type="text"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                placeholder="e.g. National Scholarship Scheme 2026-27 Guidelines"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ministry Authority</label>
                <input
                  type="text"
                  value={uploadForm.ministry}
                  onChange={(e) => setUploadForm({ ...uploadForm, ministry: e.target.value })}
                  placeholder="e.g. Ministry of Education"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Version</label>
                <input
                  type="text"
                  value={uploadForm.version}
                  onChange={(e) => setUploadForm({ ...uploadForm, version: e.target.value })}
                  placeholder="e.g. 3.2"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official .gov.in URL</label>
              <input
                type="url"
                value={uploadForm.sourceUrl}
                onChange={(e) => setUploadForm({ ...uploadForm, sourceUrl: e.target.value })}
                placeholder="https://scholarships.gov.in/guidelines.pdf"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Operational Circular Text / Excerpt</label>
              <textarea
                rows={5}
                value={uploadForm.textContent}
                onChange={(e) => setUploadForm({ ...uploadForm, textContent: e.target.value })}
                placeholder="Paste the official rules, eligibility clauses, and benefit calculations from the PDF..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Ingest & Index Into RAG Knowledge Base</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: Feedback Logs */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Recent Citizen Inquiries & Feedback</h3>
          <div className="space-y-3">
            {data?.queryLogs?.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-6">No queries logged yet.</div>
            ) : (
              data?.queryLogs?.map((log: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="uppercase font-bold text-amber-600">Lang: {log.language}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="font-semibold text-slate-900">"{log.question}"</div>
                  <div className="text-[10px] text-emerald-700 mt-1">
                    Retrieved {log.retrievedChunksCount} grounded official knowledge chunks
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
