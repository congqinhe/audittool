import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  CheckCircle2,
  Clock,
  FileSearch,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { companyScopeFilterOptions, type CompanyScope } from '../config/companyScope';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 识别流水线状态 */
export type RecognitionTaskStatus = 'queued' | 'parsing' | 'recognizing' | 'success' | 'failed';

export interface RecognitionTask {
  id: string;
  contractNo: string;
  contractTitle: string;
  /** 产业公司，对应库字段 company_scope */
  companyScope: CompanyScope;
  ruleId: string;
  ruleName: string;
  module: string;
  status: RecognitionTaskStatus;
  stageLabel: string;
  progress: number;
  startedAt: string;
  updatedAt: string;
  errorMessage?: string;
}

const statusMeta: Record<
  RecognitionTaskStatus,
  { label: string; icon: React.ReactNode; cls: string }
> = {
  queued: {
    label: '排队中',
    icon: <Clock className="w-3 h-3" />,
    cls: 'text-surface-600 bg-surface-100 border-surface-200',
  },
  parsing: {
    label: '解析中',
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
    cls: 'text-blue-700 bg-blue-50 border-blue-100',
  },
  recognizing: {
    label: '识别中',
    icon: <FileSearch className="w-3 h-3" />,
    cls: 'text-violet-700 bg-violet-50 border-violet-100',
  },
  success: {
    label: '识别成功',
    icon: <CheckCircle2 className="w-3 h-3" />,
    cls: 'text-green-700 bg-green-50 border-green-100',
  },
  failed: {
    label: '识别失败',
    icon: <XCircle className="w-3 h-3" />,
    cls: 'text-red-700 bg-red-50 border-red-100',
  },
};

const initialMockTasks: RecognitionTask[] = [
  {
    id: 'JOB-20260330-001',
    contractNo: 'HT-2026-8841',
    contractTitle: '华东区主变采购框架协议',
    companyScope: '输配电',
    ruleId: 'R001',
    ruleName: '交货方式要求',
    module: '履约交付平台',
    status: 'recognizing',
    stageLabel: '多规则并行识别',
    progress: 62,
    startedAt: '2026-03-30 12:58:02',
    updatedAt: '2026-03-30 13:01:18',
  },
  {
    id: 'JOB-20260330-002',
    contractNo: 'HT-2026-8837',
    contractTitle: '技术服务年度合同',
    companyScope: '诺雅克',
    ruleId: 'R003',
    ruleName: '质保期条款',
    module: '法务部',
    status: 'parsing',
    stageLabel: 'PDF 版面分析与段落切分',
    progress: 35,
    startedAt: '2026-03-30 13:00:41',
    updatedAt: '2026-03-30 13:00:55',
  },
  {
    id: 'JOB-20260330-003',
    contractNo: 'HT-2026-8820',
    contractTitle: '出口配套设备销售合同',
    companyScope: '低压',
    ruleId: 'R002',
    ruleName: '付款方式要求',
    module: '财务部',
    status: 'queued',
    stageLabel: '等待调度',
    progress: 0,
    startedAt: '2026-03-30 13:02:10',
    updatedAt: '2026-03-30 13:02:10',
  },
  {
    id: 'JOB-20260329-118',
    contractNo: 'HT-2026-8702',
    contractTitle: '智慧园区弱电总包',
    companyScope: '全集团',
    ruleId: 'R005',
    ruleName: '知识产权归属',
    module: '知识产权部',
    status: 'success',
    stageLabel: '识别完成',
    progress: 100,
    startedAt: '2026-03-29 16:20:00',
    updatedAt: '2026-03-29 16:24:33',
  },
  {
    id: 'JOB-20260329-105',
    contractNo: 'HT-2026-8688',
    contractTitle: '年度框架物流协议',
    companyScope: '诺雅克',
    ruleId: 'R004',
    ruleName: '违约金上限',
    module: '合规部',
    status: 'failed',
    stageLabel: '模型调用失败',
    progress: 0,
    startedAt: '2026-03-29 11:05:22',
    updatedAt: '2026-03-29 11:07:01',
    errorMessage: '上游 OCR 服务超时（HTTP 504），未返回段落坐标，已中止本次识别。',
  },
  {
    id: 'JOB-20260328-092',
    contractNo: 'HT-2026-8550',
    contractTitle: '元器件批量采购',
    companyScope: '输配电',
    ruleId: 'R001',
    ruleName: '交货方式要求',
    module: '履约交付平台',
    status: 'success',
    stageLabel: '识别完成',
    progress: 100,
    startedAt: '2026-03-28 09:12:00',
    updatedAt: '2026-03-28 09:14:28',
  },
];

type StatusFilter = 'all' | RecognitionTaskStatus;

const filterOptions: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'queued', label: '排队中' },
  { key: 'parsing', label: '解析中' },
  { key: 'recognizing', label: '识别中' },
  { key: 'success', label: '成功' },
  { key: 'failed', label: '失败' },
];

function nowStamp() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<RecognitionTask[]>(() => [...initialMockTasks]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [companyScopeFilter, setCompanyScopeFilter] =
    useState<(typeof companyScopeFilterOptions)[number]>('全部产业公司');
  const [query, setQuery] = useState('');
  const retryTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>[]>>({});

  const clearRetryTimers = useCallback((id: string) => {
    const list = retryTimersRef.current[id];
    if (list) {
      list.forEach(clearTimeout);
      delete retryTimersRef.current[id];
    }
  }, []);

  const scheduleDemoProgress = useCallback((id: string) => {
    clearRetryTimers(id);
    const t1 = setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status: 'recognizing' as const,
                stageLabel: '规则识别中',
                progress: 55,
                updatedAt: nowStamp(),
                errorMessage: undefined,
              }
            : t
        )
      );
    }, 1600);
    const t2 = setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status: 'success' as const,
                stageLabel: '识别完成',
                progress: 100,
                updatedAt: nowStamp(),
              }
            : t
        )
      );
      clearRetryTimers(id);
    }, 3600);
    retryTimersRef.current[id] = [t1, t2];
  }, [clearRetryTimers]);

  const handleRetry = useCallback(
    (task: RecognitionTask) => {
      clearRetryTimers(task.id);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? {
                ...t,
                status: 'parsing',
                stageLabel: '文档解析中',
                progress: 25,
                updatedAt: nowStamp(),
                errorMessage: undefined,
              }
            : t
        )
      );
      scheduleDemoProgress(task.id);
    },
    [clearRetryTimers, scheduleDemoProgress]
  );

  const handleDelete = useCallback(
    (task: RecognitionTask) => {
      if (
        !window.confirm(
          `确定删除任务 ${task.id}？\n合同：${task.contractTitle}\n删除后不可恢复（演示数据）。`
        )
      ) {
        return;
      }
      clearRetryTimers(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    },
    [clearRetryTimers]
  );

  const stats = useMemo(() => {
    const c = { queued: 0, parsing: 0, recognizing: 0, success: 0, failed: 0 };
    tasks.forEach((t) => {
      c[t.status]++;
    });
    return c;
  }, [tasks]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      const statusOk = statusFilter === 'all' || t.status === statusFilter;
      const scopeOk = companyScopeFilter === '全部产业公司' || t.companyScope === companyScopeFilter;
      const textOk =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.contractNo.toLowerCase().includes(q) ||
        t.contractTitle.toLowerCase().includes(q) ||
        t.ruleId.toLowerCase().includes(q) ||
        t.ruleName.toLowerCase().includes(q) ||
        t.companyScope.toLowerCase().includes(q);
      return statusOk && scopeOk && textOk;
    });
  }, [tasks, statusFilter, companyScopeFilter, query]);

  const inFlight = stats.parsing + stats.recognizing + stats.queued;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-surface-900 tracking-tight">任务进度</h2>
          <p className="text-surface-500 mt-1 text-sm">
            按产业公司（company_scope）隔离观测识别任务；失败或成功均可重试或删除（当前为演示数据）。
          </p>
        </div>
        <button
          type="button"
          onClick={() => setTasks([...initialMockTasks])}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-200 bg-white text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          重置演示数据
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center gap-2 text-surface-500 text-sm font-medium mb-2">
            <Activity className="w-4 h-4 text-blue-600" />
            进行中
          </div>
          <div className="text-2xl font-bold text-surface-900 tabular-nums">{inFlight}</div>
          <p className="text-xs text-surface-400 mt-1">排队 + 解析 + 识别</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center gap-2 text-surface-500 text-sm font-medium mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            成功
          </div>
          <div className="text-2xl font-bold text-surface-900 tabular-nums">{stats.success}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center gap-2 text-surface-500 text-sm font-medium mb-2">
            <XCircle className="w-4 h-4 text-red-600" />
            失败
          </div>
          <div className="text-2xl font-bold text-surface-900 tabular-nums">{stats.failed}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-surface-200 shadow-sm">
          <div className="flex items-center gap-2 text-surface-500 text-sm font-medium mb-2">
            <FileSearch className="w-4 h-4 text-violet-600" />
            任务总数
          </div>
          <div className="text-2xl font-bold text-surface-900 tabular-nums">{tasks.length}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-surface-200 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
          <label className="flex flex-col gap-1.5 w-full sm:w-auto sm:min-w-[140px]">
            <span className="text-xs font-medium text-surface-500">任务状态</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm font-medium text-surface-900 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            >
              {filterOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 w-full sm:w-auto sm:min-w-[180px]">
            <span className="text-xs font-medium text-surface-500">
              产业公司 <span className="text-surface-400 font-normal">（company_scope）</span>
            </span>
            <select
              value={companyScopeFilter}
              onChange={(e) =>
                setCompanyScopeFilter(e.target.value as (typeof companyScopeFilterOptions)[number])
              }
              className="w-full rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm font-medium text-surface-900 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            >
              {companyScopeFilterOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
          <div className="flex-1 min-w-[min(100%,220px)] w-full lg:min-w-[240px]">
            <span className="text-xs font-medium text-surface-500 mb-1.5 block lg:sr-only">关键词</span>
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索任务 ID、合同、规则、产业公司…"
                className="w-full pl-9 pr-3 py-2 bg-surface-50 border border-surface-200 rounded-lg focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium text-surface-900 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[960px]">
            <thead>
              <tr className="border-b border-surface-200">
                <th className="py-4 px-6 font-semibold text-xs text-surface-500 uppercase tracking-wider bg-white">
                  任务 / 合同
                </th>
                <th className="py-4 px-6 font-semibold text-xs text-surface-500 uppercase tracking-wider bg-white">
                  <span className="block">产业公司</span>
                  <span className="block text-[10px] font-normal text-surface-400 normal-case tracking-normal">company_scope</span>
                </th>
                <th className="py-4 px-6 font-semibold text-xs text-surface-500 uppercase tracking-wider bg-white">
                  规则
                </th>
                <th className="py-4 px-6 font-semibold text-xs text-surface-500 uppercase tracking-wider bg-white">
                  状态与阶段
                </th>
                <th className="py-4 px-6 font-semibold text-xs text-surface-500 uppercase tracking-wider bg-white w-[140px]">
                  进度
                </th>
                <th className="py-4 px-6 font-semibold text-xs text-surface-500 uppercase tracking-wider bg-white">
                  更新时间
                </th>
                <th className="py-4 px-6 font-semibold text-xs text-surface-500 uppercase tracking-wider text-right bg-white">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {filtered.map((task) => {
                const st = statusMeta[task.status];
                const busy = task.status === 'parsing' || task.status === 'recognizing';
                return (
                  <tr key={task.id} className="hover:bg-blue-50/50 transition-colors align-top">
                    <td className="py-4 px-6">
                      <div className="font-mono text-xs text-surface-500 mb-1">{task.id}</div>
                      <div className="font-semibold text-surface-900 text-sm">{task.contractTitle}</div>
                      <div className="text-xs text-surface-400 mt-0.5">{task.contractNo}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-100">
                        {task.companyScope}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-surface-800">{task.ruleName}</div>
                      <div className="text-xs text-surface-400 font-mono">{task.ruleId}</div>
                      <span className="inline-flex mt-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-100 text-surface-600">
                        {task.module}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border',
                          st.cls
                        )}
                      >
                        {st.icon} {st.label}
                      </span>
                      <p className="text-xs text-surface-600 mt-2 leading-relaxed max-w-[240px]">
                        {task.stageLabel}
                      </p>
                      {task.status === 'failed' && task.errorMessage && (
                        <p className="text-xs text-red-600 mt-2 flex gap-1.5 items-start max-w-[280px]">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{task.errorMessage}</span>
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {busy || task.status === 'queued' ? (
                        <div>
                          <div className="h-1.5 rounded-full bg-surface-100 overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-500',
                                task.status === 'queued' ? 'bg-surface-300 w-[5%]' : 'bg-blue-500'
                              )}
                              style={{
                                width: task.status === 'queued' ? '8%' : `${Math.min(100, task.progress)}%`,
                              }}
                            />
                          </div>
                          <span className="text-[11px] text-surface-400 tabular-nums mt-1 inline-block">
                            {task.status === 'queued' ? '—' : `${task.progress}%`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-surface-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-surface-500 tabular-nums">
                      <div>{task.updatedAt}</div>
                      <div className="text-xs text-surface-400 mt-0.5">开始 {task.startedAt}</div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                        {task.status === 'success' && (
                          <Link
                            to="/reviewer"
                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 transition-colors"
                          >
                            打开审核页
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleRetry(task)}
                          title={busy ? '进行中不可重复重试' : '重新执行识别流水线'}
                          className={cn(
                            'inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors',
                            busy
                              ? 'text-surface-300 border-surface-100 bg-surface-50 cursor-not-allowed'
                              : 'text-surface-700 border-surface-200 bg-white hover:bg-surface-50'
                          )}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          重试
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(task)}
                          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-surface-500 text-sm">没有符合条件的任务</div>
        )}

        <div className="bg-white p-4 border-t border-surface-200 flex items-center justify-between text-sm">
          <span className="text-surface-500 font-medium">
            共 {filtered.length} 条
            {statusFilter !== 'all' || companyScopeFilter !== '全部产业公司' || query.trim()
              ? `（全部 ${tasks.length} 条）`
              : ''}
          </span>
          <span className="text-xs text-surface-400">接入后端后支持分页与实时推送</span>
        </div>
      </div>
    </div>
  );
}
