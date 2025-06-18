/**
 * Permissions Feature Entry Point
 * Export tất cả components, pages, services và router của permissions feature
 */

// ✅ Pages
export { PermissionListPage, PermissionDetailPage, PermissionFormPage } from './pages';

// ✅ Components (when added)
// export { PermissionTable, PermissionForm, PermissionCard } from './components';

// ✅ Hooks
export { usePermissions, usePermission, useCreatePermission } from './hooks/usePermissions';

// ✅ Services
export { permissionApi } from './services/permissionApi';

// ✅ Types
export type { Permission, CreatePermissionRequest, UpdatePermissionRequest } from './types/permissionTypes';

// ✅ Router  
export { default as PermissionsRouter } from './router'; 
