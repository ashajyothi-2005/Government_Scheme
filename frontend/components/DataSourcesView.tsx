import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { viewT } from '../i18n/viewTranslations';
import { SchemeSource } from '../../shared/types';
import {
  ShieldCheck,
  FileText,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  Database,
  GitBranch,
} from 'lucide-react';

export const DataSourcesView: React.FC = () => {
  const { language } = useLanguage();
  const [sources, setSources] = useState<SchemeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchSources() {
      setLoading(true);
      try {
        const res = await api.getSources();
        setSources(res.sources);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSources();
  }, []);

  const filtered = sources.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.ministry.toLowerCase().includes(search.toLowerCase()) ||
      s.documentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{viewT(language, 'sourceBadge')}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {viewT(language, 'sourceTitle')}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            {viewT(language, 'sourceIntro')}
        </p>

        {/* Source Stats */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
            <div className="text-xl font-black text-white">{sources.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{viewT(language, 'ingested')}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
            <div className="text-xl font-black text-emerald-400">100%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{viewT(language, 'grounding')}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
            <div className="text-xl font-black text-amber-400">2026-27</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{viewT(language, 'academic')}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700">
            <div className="text-xl font-black text-teal-400">8 Indian Langs</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{viewT(language, 'languages')}</div>
          </div>
        </div>
      </div>

      {/* RAG Lineage Pipeline Infographic */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-600" />
            <span>{viewT(language, 'pipeline')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {viewT(language, 'pipelineSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">1</span>
              <span>Source Retrieval</span>
            </div>
            <p className="text-xs text-slate-600">
              Download official guidelines from .gov.in domains (NSP, PM-KISAN, MoSJE, MoHUA).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">2</span>
              <span>Chunking & Page Tagging</span>
            </div>
            <p className="text-xs text-slate-600">
              Structured slicing with exact page numbers, section headers, and version tags.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">3</span>
              <span>Rule Engine Extraction</span>
            </div>
            <p className="text-xs text-slate-600">
              Explicit extraction of mathematical criteria (income limits, age bands, domicile rules).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">4</span>
              <span>Citation Generator</span>
            </div>
            <p className="text-xs text-slate-600">
              The AI Assistant attaches exact page citations and verification timestamps to every response.
            </p>
          </div>
        </div>
      </div>

      {/* Sources Search & Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">{viewT(language, 'registry')}</h3>
            <p className="text-xs text-slate-500">{viewT(language, 'registrySub')}</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={viewT(language, 'searchDocs')}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{viewT(language, 'document')}</th>
                <th className="py-3 px-4">{viewT(language, 'ministry')}</th>
                <th className="py-3 px-4">{viewT(language, 'version')}</th>
                <th className="py-3 px-4">{viewT(language, 'verified')}</th>
                <th className="py-3 px-4">{viewT(language, 'status')}</th>
                <th className="py-3 px-4 text-right">{viewT(language, 'official')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((src) => (
                <tr key={src.documentId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div>{src.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{src.documentId}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{src.ministry}</div>
                    <div className="text-[10px] text-slate-400">{src.department}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      v{src.version}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>{src.lastVerified}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        src.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {src.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={src.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                    >
                      <span>PDF</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
