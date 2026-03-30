/**
 * 产业公司（租户维度），与库表字段 `company_scope` 一致（如 rule、review_scenario、识别任务）。
 * 用于数据按业务方隔离；「全集团」表示不限制单一产业公司。
 */
export const companyScopes = ['输配电', '诺雅克', '低压', '全集团'] as const;

export type CompanyScope = (typeof companyScopes)[number];

/** 列表筛选：首项为「全部」 */
export const companyScopeFilterOptions = ['全部产业公司', ...companyScopes] as const;

export type CompanyScopeFilterValue = (typeof companyScopeFilterOptions)[number];
