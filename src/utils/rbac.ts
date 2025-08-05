import { RootState } from "../store/store";

export function hasAccess(state: RootState, requiredRoles: string[]): boolean {
  if (!state.user.isAuthenticated || !state.user.userInfo) return false;
  const userRoles = state.user.userInfo.roles;
  return requiredRoles.some((role) => userRoles.includes(role));
}
