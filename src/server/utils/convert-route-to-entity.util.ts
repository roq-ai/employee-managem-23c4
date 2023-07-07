const mapping: Record<string, string> = {
  'employee-profiles': 'employee_profile',
  organizations: 'organization',
  'performance-evaluations': 'performance_evaluation',
  'time-trackings': 'time_tracking',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
