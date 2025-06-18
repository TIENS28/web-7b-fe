/**
 * Roles Feature Entry Point
 * Export tất cả components, pages, services và router của roles feature
 */

// ✅ Pages
export { RoleListPage, RoleDetailPage, RoleFormPage } from './pages';

// ✅ Components (when added)
// export { RoleTable, RoleForm, RoleCard } from './components';

// ✅ Hooks (when added)
// export { useRoles, useRole, useCreateRole } from './hooks';

// ✅ Services (when added)
// export { rolesApi } from './services';

// ✅ Types
export type { Role, RoleFormData, CreateRoleRequest, UpdateRoleRequest } from './types/Role.types';

// ✅ Router  
export { default as RolesRouter } from './router'; 
