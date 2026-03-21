import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, Edit2, PlayCircle, History, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 模拟规则数据
const mockRules = [
  { id: 'R001', name: '交货方式要求', module: '履约交付', risk: 'high', status: 'active', updated: '2025-03-21', desc: '检查是否约定车板交货或主变基础交货' },
  { id: 'R002', name: '付款方式要求', module: '财务规则', risk: 'low', status: 'active', updated: '2025-03-20', desc: '检查是否为转账/电汇/6月内汇票' },
  { id: 'R003', name: '质保期要求', module: '质量规则', risk: 'medium', status: 'active', updated: '2025-03-15', desc: '检查质保期是否满足至少12个月要求' },
  { id: 'R004', name: '违约金上限', module: '法务合规', risk: 'high', status: 'inactive', updated: '2025-03-10', desc: '检查违约金总额是否超过合同金额的30%' },
  { id: 'R005', name: '发票开具要求', module: '财务规则', risk: 'low', status: 'active', updated: '2025-03-01', desc: '检查是否明确开具增值税专用发票' },
];

export default function RulesPage() {
  const [activeModule, setActiveModule] = useState('全部模块');
  
  const modules = ['全部模块', '履约交付', '财务规则', '法务合规', '质量规则'];

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-20">
      {/* 页面标题与主要操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-900 tracking-tight">规则管理</h2>
          <p className="text-surface-500 mt-1 text-sm">配置和管理 AI 智能评审的底层规则引擎。</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm flex items-center gap-2 active:scale-95">
          <Plus className="w-4 h-4" /> 新建规则
        </button>
      </div>

      {/* 过滤器与搜索条 - 匹配新风格 */}
      <div className="bg-white p-3 rounded-2xl border border-surface-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2 pr-2 overflow-x-auto hide-scrollbar w-full sm:w-auto">
          {modules.map(mod => (
            <button
              key={mod}
              onClick={() => setActiveModule(mod)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                activeModule === mod 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-surface-600 hover:bg-surface-50"
              )}
            >
              {mod}
            </button>
          ))}
        </div>
        <div className="hidden sm:block h-6 w-[1px] bg-surface-200"></div>
        <div className="flex-1 relative w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
          <input 
            type="text" 
            placeholder="搜索规则名称、ID 或描述..." 
            className="w-full pl-10 pr-4 py-2 bg-surface-50 border border-transparent rounded-lg focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all text-sm font-medium text-surface-900 outline-none"
          />
        </div>
      </div>

      {/* 规则列表表格 - 匹配新风格 */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-200">
                <th className="py-4 px-6 font-semibold text-xs text-surface-500 uppercase tracking-wider bg-white">规则名称 / ID</th>
                <th className="py-4 px-6 font-semibold text-xs text-surface-500 uppercase tracking-wider bg-white">所属模块</th>
                <th className="py-4 px-6 font-semibold text-xs text-surface-500 uppercase tracking-wider bg-white">风险等级</th>
                <th className="py-4 px-6 font-semibold text-xs text-surface-500 uppercase tracking-wider bg-white">状态</th>
                <th className="py-4 px-6 font-semibold text-xs text-surface-500 uppercase tracking-wider bg-white">最后更新</th>
                <th className="py-4 px-6 font-semibold text-xs text-surface-500 uppercase tracking-wider text-right bg-white">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {mockRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-surface-900 text-sm mb-1">{rule.name}</div>
                    <div className="text-xs text-surface-400 font-mono">{rule.id}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-surface-100 text-surface-700">
                      {rule.module}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      {rule.risk === 'high' && <><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-red-600">高风险</span></>}
                      {rule.risk === 'medium' && <><span className="w-2 h-2 rounded-full bg-amber-500"></span><span className="text-amber-600">中风险</span></>}
                      {rule.risk === 'low' && <><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-green-600">低风险</span></>}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {rule.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">
                        <CheckCircle2 className="w-3 h-3" /> 已启用
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-surface-500 bg-surface-100 px-2 py-0.5 rounded-md border border-surface-200">
                        <XCircle className="w-3 h-3" /> 已停用
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-surface-500 tabular-nums">
                    {rule.updated}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-surface-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip-trigger" title="编辑配置">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-surface-400 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors tooltip-trigger" title="版本历史">
                        <History className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip-trigger" title="删除">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 分页 */}
        <div className="bg-white p-4 border-t border-surface-200 flex items-center justify-between text-sm">
          <span className="text-surface-500 font-medium">共 51 条规则</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 text-surface-500 hover:text-surface-900 font-medium rounded-lg hover:bg-surface-100 transition-colors">上一页</button>
            <button className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-lg">1</button>
            <button className="px-3 py-1.5 text-surface-600 hover:text-surface-900 font-medium rounded-lg hover:bg-surface-100 transition-colors">2</button>
            <button className="px-3 py-1.5 text-surface-600 hover:text-surface-900 font-medium rounded-lg hover:bg-surface-100 transition-colors">3</button>
            <button className="px-3 py-1.5 text-surface-500 hover:text-surface-900 font-medium rounded-lg hover:bg-surface-100 transition-colors">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}
