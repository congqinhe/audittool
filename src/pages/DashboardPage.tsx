import React, { useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  Download,
  FileSearch,
  LayoutDashboard,
  ListChecks,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { companyScopeFilterOptions } from '../config/companyScope';
import { mockRules } from './RulesPage';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TabKey = 'overview' | 'logs';

export type RuleFeedbackAction =
  | 'accept'
  | 'confirm_after_edit'
  | 'ignore'
  | 'recognition_up'
  | 'recognition_down';

export type LogRuleMode = 'bpm_structured' | 'recognition_only';

export interface RuleEffectLogRow {
  id: string;
  at: string;
  taskId: string;
  contractTitle: string;
  ruleId: string;
  ruleName: string;
  companyScope: string;
  action: RuleFeedbackAction;
  ruleMode: LogRuleMode;
}

const actionMeta: Record<RuleFeedbackAction, { label: string; cls: string }> = {
  accept: { label: '采纳', cls: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
  confirm_after_edit: { label: '修改后确认', cls: 'text-teal-800 bg-teal-50 border-teal-100' },
  ignore: { label: '忽略', cls: 'text-surface-600 bg-surface-100 border-surface-200' },
  recognition_up: { label: '点赞', cls: 'text-blue-700 bg-blue-50 border-blue-100' },
  recognition_down: { label: '点踩', cls: 'text-amber-800 bg-amber-50 border-amber-100' },
};

const ruleModeLabel: Record<LogRuleMode, string> = {
  bpm_structured: '评审结果',
  recognition_only: '仅识别',
};

const ALL_ACTIONS = '全部动作' as const;
const ALL_RULES = '全部规则' as const;
const DATE_PRESETS = ['近7日', '近30日', '全部'] as const;

/** 演示：规则效果日志（接入后端后由 API 替换） */
const mockRuleEffectLogs: RuleEffectLogRow[] = [
  {
    id: 'L001',
    at: '2026-03-30 09:12:33',
    taskId: 'CON-20260330-008',
    contractTitle: '华东主变采购框架协议',
    ruleId: 'R001',
    ruleName: '交货方式要求',
    companyScope: '输配电',
    action: 'accept',
    ruleMode: 'bpm_structured',
  },
  {
    id: 'L002',
    at: '2026-03-30 09:18:02',
    taskId: 'CON-20260330-008',
    contractTitle: '华东主变采购框架协议',
    ruleId: 'R002',
    ruleName: '付款方式要求',
    companyScope: '输配电',
    action: 'confirm_after_edit',
    ruleMode: 'bpm_structured',
  },
  {
    id: 'L003',
    at: '2026-03-30 10:05:41',
    taskId: 'CON-20260330-009',
    contractTitle: '低压柜体年度框架',
    ruleId: 'R004',
    ruleName: '违约金上限',
    companyScope: '低压',
    action: 'ignore',
    ruleMode: 'bpm_structured',
  },
  {
    id: 'L004',
    at: '2026-03-29 16:22:10',
    taskId: 'CON-20260329-102',
    contractTitle: '出口设备销售合同',
    ruleId: 'R006',
    ruleName: '运输方式（仅识别）',
    companyScope: '诺雅克',
    action: 'recognition_up',
    ruleMode: 'recognition_only',
  },
  {
    id: 'L005',
    at: '2026-03-29 16:25:55',
    taskId: 'CON-20260329-102',
    contractTitle: '出口设备销售合同',
    ruleId: 'R006',
    ruleName: '运输方式（仅识别）',
    companyScope: '诺雅克',
    action: 'recognition_down',
    ruleMode: 'recognition_only',
  },
  {
    id: 'L006',
    at: '2026-03-29 11:40:00',
    taskId: 'CON-20260329-088',
    contractTitle: '技术服务合同',
    ruleId: 'R003',
    ruleName: '质保期要求',
    companyScope: '全集团',
    action: 'accept',
    ruleMode: 'bpm_structured',
  },
  {
    id: 'L007',
    at: '2026-03-28 14:30:22',
    taskId: 'CON-20260328-071',
    contractTitle: '元器件批量采购',
    ruleId: 'R001',
    ruleName: '交货方式要求',
    companyScope: '输配电',
    action: 'ignore',
    ruleMode: 'bpm_structured',
  },
  {
    id: 'L008',
    at: '2026-03-28 15:01:08',
    taskId: 'CON-20260328-071',
    contractTitle: '元器件批量采购',
    ruleId: 'R007',
    ruleName: '检验与试验不合格处罚（仅识别）',
    companyScope: '输配电',
    action: 'recognition_up',
    ruleMode: 'recognition_only',
  },
  {
    id: 'L009',
    at: '2026-03-27 09:15:00',
    taskId: 'CON-20260327-055',
    contractTitle: '智慧园区弱电总包',
    ruleId: 'R005',
    ruleName: '发票开具要求',
    companyScope: '低压',
    action: 'confirm_after_edit',
    ruleMode: 'bpm_structured',
  },
  {
    id: 'L010',
    at: '2026-03-26 11:20:44',
    taskId: 'CON-20260326-041',
    contractTitle: '年度物流框架',
    ruleId: 'R002',
    ruleName: '付款方式要求',
    companyScope: '诺雅克',
    action: 'accept',
    ruleMode: 'bpm_structured',
  },
  {
    id: 'L011',
    at: '2026-03-25 08:50:12',
    taskId: 'CON-20260325-033',
    contractTitle: '海外项目配套合同',
    ruleId: 'R004',
    ruleName: '违约金上限',
    companyScope: '诺雅克',
    action: 'confirm_after_edit',
    ruleMode: 'bpm_structured',
  },
  {
    id: 'L012',
    at: '2026-03-24 17:05:33',
    taskId: 'CON-20260324-028',
    contractTitle: '母线槽供货合同',
    ruleId: 'R001',
    ruleName: '交货方式要求',
    companyScope: '低压',
    action: 'ignore',
    ruleMode: 'bpm_structured',
  },
  {
    id: 'L013',
    at: '2026-03-10 10:00:00',
    taskId: 'CON-20260310-001',
    contractTitle: '历史归档样本',
    ruleId: 'R002',
    ruleName: '付款方式要求',
    companyScope: '全集团',
    action: 'accept',
    ruleMode: 'bpm_structured',
  },
];

const trendData = [
  { day: '03-24', 输配电: 42, 诺雅克: 28, 低压: 35 },
  { day: '03-25', 输配电: 38, 诺雅克: 31, 低压: 30 },
  { day: '03-26', 输配电: 55, 诺雅克: 22, 低压: 40 },
  { day: '03-27', 输配电: 48, 诺雅克: 35, 低压: 33 },
  { day: '03-28', 输配电: 62, 诺雅克: 29, 低压: 45 },
  { day: '03-29', 输配电: 51, 诺雅克: 40, 低压: 38 },
  { day: '03-30', 输配电: 58, 诺雅克: 33, 低压: 42 },
];

function parseLogAt(at: string) {
  return new Date(at.replace(' ', 'T'));
}

function withinPreset(at: string, preset: (typeof DATE_PRESETS)[number]) {
  if (preset === '全部') return true;
  const d = parseLogAt(at);
  const now = new Date('2026-03-30T23:59:59');
  const days = preset === '近7日' ? 7 : 30;
  const start = new Date(now);
  start.setDate(start.getDate() - days);
  return d >= start && d <= now;
}

function downloadCsv(rows: RuleEffectLogRow[], filename: string) {
  const headers = [
    'id',
    '时间',
    '任务ID',
    '合同标题',
    '规则ID',
    '规则名称',
    'company_scope',
    '动作',
    '规则模式',
  ];
  const lines = [
    '\ufeff' + headers.join(','),
    ...rows.map((r) =>
      [
        r.id,
        r.at,
        r.taskId,
        `"${r.contractTitle.replace(/"/g, '""')}"`,
        r.ruleId,
        `"${r.ruleName.replace(/"/g, '""')}"`,
        r.companyScope,
        actionMeta[r.action].label,
        ruleModeLabel[r.ruleMode],
      ].join(',')
    ),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DashboardPage() {
  const [tab, setTab] = useState<TabKey>('overview');
  const [logCompanyScope, setLogCompanyScope] = useState<(typeof companyScopeFilterOptions)[number]>('全部产业公司');
  const [logRuleId, setLogRuleId] = useState<string>(ALL_RULES);
  const [logAction, setLogAction] = useState<typeof ALL_ACTIONS | RuleFeedbackAction>(ALL_ACTIONS);
  const [logDatePreset, setLogDatePreset] = useState<(typeof DATE_PRESETS)[number]>('近7日');

  const filteredLogs = useMemo(() => {
    return mockRuleEffectLogs.filter((row) => {
      if (logCompanyScope !== '全部产业公司' && row.companyScope !== logCompanyScope) return false;
      if (logRuleId !== ALL_RULES && row.ruleId !== logRuleId) return false;
      if (logAction !== ALL_ACTIONS && row.action !== logAction) return false;
      if (!withinPreset(row.at, logDatePreset)) return false;
      return true;
    });
  }, [logCompanyScope, logRuleId, logAction, logDatePreset]);

  const handleExportLogs = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(filteredLogs, `规则效果日志_${stamp}.csv`);
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">控制台首页</h2>
          <p className="text-surface-500 mt-1 text-sm">
            智能审核数据概览与规则效果日志（演示数据）；不含规则命中次数 / category 曝光统计。
          </p>
        </div>
        <div className="flex gap-1 bg-surface-100 p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setTab('overview')}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === 'overview' ? 'bg-white text-blue-700 shadow-sm' : 'text-surface-600 hover:text-surface-900'
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            数据概览
          </button>
          <button
            type="button"
            onClick={() => setTab('logs')}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === 'logs' ? 'bg-white text-blue-700 shadow-sm' : 'text-surface-600 hover:text-surface-900'
            )}
          >
            <ListChecks className="w-4 h-4" />
            规则效果日志
          </button>
        </div>
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <FileSearch className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-surface-500">近7日识别任务</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-surface-900 tracking-tight">1,842</span>
              </div>
              <p className="text-xs text-surface-500 mt-2">成功率 96.2% · 平均耗时 2.4 min</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-surface-500">采纳率</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-surface-900 tracking-tight">71%</span>
              </div>
              <p className="text-xs text-surface-500 mt-2 leading-relaxed">
                采纳 + 修改后确认的审核结果 / 已处理审核结果
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
                  <ThumbsUp className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-surface-500">仅识别反馈</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-surface-900 tracking-tight">62%</span>
              </div>
              <p className="text-xs text-surface-500 mt-2">点赞 / (点赞+点踩) · 近7日</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-surface-900">各产业公司处理量趋势</h3>
                  <p className="text-sm text-surface-500 mt-1">近7日识别与审核合并处理次数（演示）</p>
                </div>
                <BarChart3 className="w-5 h-5 text-surface-400" />
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-surface-200" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} className="text-surface-500" />
                    <YAxis tick={{ fontSize: 12 }} className="text-surface-500" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #e2e8f0',
                        fontSize: 12,
                      }}
                    />
                    <Legend />
                    <Bar dataKey="输配电" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="诺雅克" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="低压" fill="#a5b4fc" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-surface-200 shadow-sm flex flex-col">
              <div className="p-6 border-b border-surface-100">
                <h3 className="text-lg font-bold text-surface-900">待处理与队列</h3>
                <p className="text-sm text-surface-500 mt-1">识别流水线与 BPM 提交（演示）</p>
              </div>
              <div className="p-6 space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-600">识别任务排队/进行中</span>
                  <span className="text-lg font-bold text-blue-600 tabular-nums">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-600">今日已提交 BPM</span>
                  <span className="text-lg font-bold text-surface-900 tabular-nums">156</span>
                </div>
              </div>
              <div className="p-4 border-t border-surface-100 bg-surface-50/50">
                <p className="text-xs text-surface-500 leading-relaxed">
                  规则级行为明细见「规则效果日志」；可筛选产业公司、动作类型并导出 CSV。
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-surface-200 shadow-sm">
            <div className="flex flex-col xl:flex-row xl:items-end gap-4 flex-wrap">
              <label className="flex flex-col gap-1.5 min-w-[140px]">
                <span className="text-xs font-medium text-surface-500">时间范围</span>
                <select
                  value={logDatePreset}
                  onChange={(e) => setLogDatePreset(e.target.value as (typeof DATE_PRESETS)[number])}
                  className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm font-medium text-surface-900 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 outline-none"
                >
                  {DATE_PRESETS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 min-w-[160px]">
                <span className="text-xs font-medium text-surface-500">产业 company_scope</span>
                <select
                  value={logCompanyScope}
                  onChange={(e) =>
                    setLogCompanyScope(e.target.value as (typeof companyScopeFilterOptions)[number])
                  }
                  className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm font-medium text-surface-900 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 outline-none"
                >
                  {companyScopeFilterOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 min-w-[200px] flex-1">
                <span className="text-xs font-medium text-surface-500">规则</span>
                <select
                  value={logRuleId}
                  onChange={(e) => setLogRuleId(e.target.value)}
                  className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm font-medium text-surface-900 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 outline-none"
                >
                  <option value={ALL_RULES}>{ALL_RULES}</option>
                  {mockRules.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.id} · {r.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 min-w-[140px]">
                <span className="text-xs font-medium text-surface-500">用户动作</span>
                <select
                  value={logAction}
                  onChange={(e) =>
                    setLogAction(e.target.value as typeof ALL_ACTIONS | RuleFeedbackAction)
                  }
                  className="rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm font-medium text-surface-900 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 outline-none"
                >
                  <option value={ALL_ACTIONS}>{ALL_ACTIONS}</option>
                  {(Object.keys(actionMeta) as RuleFeedbackAction[]).map((k) => (
                    <option key={k} value={k}>
                      {actionMeta[k].label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={handleExportLogs}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-surface-900 text-white text-sm font-semibold hover:bg-surface-800 transition-colors xl:ml-auto"
              >
                <Download className="w-4 h-4" />
                导出 CSV（{filteredLogs.length} 条）
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-surface-200 bg-surface-50/80">
                    <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">时间</th>
                    <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">任务 / 合同</th>
                    <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">规则</th>
                    <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">company_scope</th>
                    <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">模式</th>
                    <th className="py-3 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">动作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {filteredLogs.map((row) => {
                    const am = actionMeta[row.action];
                    return (
                      <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3 px-4 text-sm text-surface-600 tabular-nums whitespace-nowrap">{row.at}</td>
                        <td className="py-3 px-4">
                          <div className="text-xs font-mono text-surface-400">{row.taskId}</div>
                          <div className="text-sm font-medium text-surface-900 mt-0.5 max-w-[220px] truncate" title={row.contractTitle}>
                            {row.contractTitle}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-surface-800">{row.ruleName}</div>
                          <div className="text-xs font-mono text-surface-400">{row.ruleId}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-surface-700">{row.companyScope}</td>
                        <td className="py-3 px-4 text-sm text-surface-600">{ruleModeLabel[row.ruleMode]}</td>
                        <td className="py-3 px-4">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border',
                              am.cls
                            )}
                          >
                            {row.action === 'recognition_up' && <ThumbsUp className="w-3 h-3" />}
                            {row.action === 'recognition_down' && <ThumbsDown className="w-3 h-3" />}
                            {am.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredLogs.length === 0 && (
              <div className="py-16 text-center text-sm text-surface-500">当前筛选条件下无记录</div>
            )}
            <div className="px-4 py-3 border-t border-surface-100 text-xs text-surface-500 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 shrink-0" />
              接入后端后由审计表 / 行为埋点 API 提供；导出支持异步大文件。
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
