import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileCheck2, Settings, Users, LogOut, Search, Bell, ChevronDown, ArrowUpRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminLayout() {
  const location = useLocation();

  const navigation = [
    { name: '控制台首页', href: '/admin', icon: LayoutDashboard },
    { name: '规则管理', href: '/admin/rules', icon: FileCheck2 },
    { name: '任务进度', href: '/admin/tasks', icon: Search },
    { name: '用户管理', href: '/admin/users', icon: Users },
    { name: '系统设置', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden font-sans">
      {/* 侧边栏 */}
      <aside className="w-64 bg-surface-900 text-white flex flex-col shrink-0 shadow-xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-surface-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
              <FileCheck2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-wide">智能评审管理台</span>
          </div>
        </div>
        
        <div className="p-4 flex-1">
          <div className="text-xs font-semibold text-surface-500 tracking-wider mb-4 px-2 uppercase">主导航</div>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                    isActive 
                      ? "bg-primary-500/10 text-primary-400" 
                      : "text-surface-300 hover:bg-surface-800 hover:text-white"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-primary-400" : "text-surface-400 group-hover:text-surface-200"
                  )} />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-surface-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-surface-700 border border-surface-600 flex items-center justify-center text-sm font-bold">
              ADMIN
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">系统超级管理员</p>
              <p className="text-xs text-surface-400 truncate">admin@chint.com</p>
            </div>
            <button className="p-1.5 text-surface-400 hover:text-white hover:bg-surface-700 rounded-md transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* 顶部导航 */}
        <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-surface-900">
              {navigation.find(n => n.href === location.pathname)?.name || '概览'}
            </h1>
            
            {/* 业务方切换 Pill (演示超管视角) */}
            <div className="ml-4 px-3 py-1.5 bg-surface-100 rounded-md border border-surface-200 text-sm font-medium text-surface-600 flex items-center gap-2 cursor-pointer hover:bg-surface-200 transition-colors">
              <span>全局视角 (全部业务方)</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-risk-high rounded-full border-2 border-white"></span>
            </button>
            <div className="h-5 w-[1px] bg-surface-200"></div>
            <Link to="/reviewer" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1.5">
              前往审核复核页预览 <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* 路由页面内容 */}
        <div className="flex-1 overflow-auto p-8 bg-surface-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
