import React from 'react';
import { FileText, AlertTriangle, ShieldCheck, Activity, TrendingUp, ArrowRight, ArrowUpRight, Search, Plus, Filter, MoreVertical, LayoutDashboard, FileCheck2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-20">
      {/* 顶部标题区 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">控制台首页</h2>
          <p className="text-surface-500 mt-1 text-sm">欢迎使用智能审核大盘</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-surface-200 text-surface-700 text-sm font-medium rounded-lg hover:bg-surface-50 transition-colors">
            导出报告
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
            新建审核
          </button>
        </div>
      </div>

      {/* 核心指标统计 - Bento Grid 风格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <FileText className="w-5 h-5" />
             </div>
             <span className="text-sm font-medium text-surface-500">今日完成评审</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-surface-900 tracking-tight">156</span>
            <span className="text-sm text-green-600 font-medium flex items-center bg-green-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 mr-1" /> +12%
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-red-50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
             </div>
             <span className="text-sm font-medium text-surface-500">发现高风险</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-surface-900 tracking-tight">24</span>
            <span className="text-sm text-red-600 font-medium flex items-center bg-red-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 mr-1" /> -5%
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-green-50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
             </div>
             <span className="text-sm font-medium text-surface-500">自动过审率</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-surface-900 tracking-tight">82%</span>
            <span className="text-sm text-green-600 font-medium flex items-center bg-green-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 mr-1" /> +3%
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-purple-50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Activity className="w-5 h-5" />
             </div>
             <span className="text-sm font-medium text-surface-500">API 调用次数</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-surface-900 tracking-tight">1.2k</span>
             <span className="text-sm text-green-600 font-medium flex items-center bg-green-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 mr-1" /> +18%
            </span>
          </div>
        </div>
      </div>

      {/* 两列布局：图表 & 列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 左侧：图表区 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-surface-900">各业务方审核量趋势</h3>
              <p className="text-sm text-surface-500 mt-1">近 7 天数据表现</p>
            </div>
            <button className="p-2 hover:bg-surface-50 rounded-lg text-surface-400 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-4 px-2 min-h-[240px]">
            {/* 模拟简易直方图 */}
            {[
              { day: '03-15', val1: 40, val2: 20, val3: 15 },
              { day: '03-16', val1: 60, val2: 30, val3: 20 },
              { day: '03-17', val1: 45, val2: 25, val3: 18 },
              { day: '03-18', val1: 80, val2: 40, val3: 25 },
              { day: '03-19', val1: 65, val2: 35, val3: 22 },
              { day: '03-20', val1: 90, val2: 45, val3: 30 },
              { day: '03-21', val1: 100, val2: 50, val3: 35 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative cursor-pointer">
                <div className="w-full max-w-[32px] h-[200px] flex flex-col justify-end gap-1 pb-1">
                  <div className="w-full bg-[#E0E7FF] rounded-t-sm transition-all duration-300 group-hover:opacity-80" style={{ height: `${d.val3}%` }}></div>
                  <div className="w-full bg-[#818CF8] rounded-sm transition-all duration-300 group-hover:opacity-80" style={{ height: `${d.val2}%` }}></div>
                  <div className="w-full bg-blue-600 rounded-sm transition-all duration-300 group-hover:opacity-80" style={{ height: `${d.val1}%` }}></div>
                </div>
                <span className="text-xs font-medium text-surface-500">{d.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-surface-100">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-600"></span><span className="text-sm font-medium text-surface-600">低压</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#818CF8]"></span><span className="text-sm font-medium text-surface-600">电气</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#E0E7FF]"></span><span className="text-sm font-medium text-surface-600">诺亚克</span></div>
          </div>
        </div>

        {/* 右侧：列表区 */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm flex flex-col">
          <div className="p-6 border-b border-surface-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-surface-900">需关注高风险任务</h3>
            <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">3 项</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {[
              { id: 'CON-001', name: '检测到来自高风险地区的异常跨境支付请求', time: '10分钟前' },
              { id: 'CON-002', name: '主节点与备份节点数据指纹不一致警告', time: '1小时前' },
              { id: 'CON-003', name: '生产环境第三方物流插件凭证即将于24小时内到期', time: '3小时前' },
            ].map((task, i) => (
              <div key={i} className="p-4 rounded-xl hover:bg-surface-50 transition-colors cursor-pointer group border-b border-surface-50 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-surface-400 font-mono">{task.id}</span>
                  <span className="text-xs text-surface-400">{task.time}</span>
                </div>
                <h4 className="text-sm font-medium text-surface-900 leading-snug group-hover:text-blue-600 transition-colors">
                  {task.name}
                </h4>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-surface-100">
            <button className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1">
              查看全部 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
