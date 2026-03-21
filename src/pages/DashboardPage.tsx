import React from 'react';
import { FileText, AlertTriangle, ShieldCheck, Activity, TrendingUp, ArrowRight, ArrowUpRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const StatCard = ({ title, value, trend, trendLabel, icon: Icon, colorClass }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-soft hover:shadow-float transition-shadow duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colorClass)}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex items-center gap-1 text-sm font-medium text-risk-low bg-risk-low/10 px-2 py-1 rounded-md">
        <TrendingUp className="w-4 h-4" /> {trend}
      </div>
    </div>
    <div>
      <h3 className="text-surface-500 font-medium text-sm mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-surface-900 font-display tracking-tight">{value}</span>
        <span className="text-xs text-surface-400">{trendLabel}</span>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 顶部欢迎区 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-900 tracking-tight">下午好，系统超级管理员</h2>
          <p className="text-surface-500 mt-1">这里是今日的智能审核大盘数据，系统运行平稳。</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-surface-600 bg-white px-4 py-2 rounded-lg border border-surface-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-risk-low animate-pulse"></span>
            AI 模型服务状态：在线
          </div>
        </div>
      </div>

      {/* 核心指标统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="今日完成评审 (份)" 
          value="156" 
          trend="+12%" 
          trendLabel="较昨日"
          icon={FileText}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="发现高风险 (项)" 
          value="24" 
          trend="-5%" 
          trendLabel="较昨日"
          icon={AlertTriangle}
          colorClass="bg-risk-high/10 text-risk-high"
        />
        <StatCard 
          title="自动过审率" 
          value="82%" 
          trend="+3%" 
          trendLabel="较上周"
          icon={ShieldCheck}
          colorClass="bg-risk-low/10 text-risk-low"
        />
        <StatCard 
          title="API 调用次数" 
          value="1.2k" 
          trend="+18%" 
          trendLabel="较上周"
          icon={Activity}
          colorClass="bg-purple-50 text-purple-600"
        />
      </div>

      {/* 两列布局：业务方统计 & 待办任务 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 左侧宽列：各业务方审核量对比 */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-200 shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-surface-900">各业务方审核量趋势 (近7日)</h3>
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
              查看完整报告 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="h-72 flex items-end justify-between gap-4 px-2">
            {/* 模拟柱状图 - 使用 Tailwind 实现的简单 UI 图表 */}
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
                {/* 柱子容器 */}
                <div className="w-full max-w-[40px] h-full flex flex-col justify-end gap-1 pb-1">
                  <div className="w-full bg-blue-400 rounded-t-sm transition-all duration-300 group-hover:opacity-80" style={{ height: `${d.val3}%` }}></div>
                  <div className="w-full bg-indigo-400 rounded-sm transition-all duration-300 group-hover:opacity-80" style={{ height: `${d.val2}%` }}></div>
                  <div className="w-full bg-primary-500 rounded-sm transition-all duration-300 group-hover:opacity-80" style={{ height: `${d.val1}%` }}></div>
                </div>
                {/* X轴标签 */}
                <span className="text-xs font-medium text-surface-500">{d.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-surface-100">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-primary-500"></span><span className="text-sm font-medium text-surface-600">低压</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-indigo-400"></span><span className="text-sm font-medium text-surface-600">电气</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-blue-400"></span><span className="text-sm font-medium text-surface-600">诺亚克</span></div>
          </div>
        </div>

        {/* 右侧窄列：近期高风险任务 */}
        <div className="bg-white rounded-2xl border border-surface-200 shadow-soft p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-surface-900">需关注的高风险任务</h3>
            <span className="px-2.5 py-0.5 bg-risk-high/10 text-risk-high text-xs font-bold rounded-full">3 项</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-surface-200 hover:border-risk-high/30 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-surface-500 tracking-wider">CON-20250321-00{i}</span>
                  <span className="text-xs px-2 py-0.5 bg-surface-100 text-surface-600 rounded">低压</span>
                </div>
                <h4 className="font-semibold text-surface-900 text-sm mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                  XX配电房改造项目设备采购合同
                </h4>
                <div className="flex items-center gap-2 text-xs font-medium text-risk-high">
                  <AlertTriangle className="w-3 h-3" /> 包含 2 项高风险
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2.5 bg-surface-50 hover:bg-surface-100 text-surface-700 text-sm font-semibold rounded-xl transition-colors border border-surface-200">
            查看全部任务
          </button>
        </div>

      </div>
    </div>
  );
}
