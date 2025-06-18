/**
 * Articles Feature Entry Point
 * Export tất cả components, pages, và router của articles feature
 */

// ✅ Pages
export { ArticleCreatePage, ArticleEditPage } from './pages';

// ✅ Components
export { default as ArticlesForm } from './components/ArticlesForm';
export { default as ArticlesManagement } from './components/ArticlesManagement';

// ✅ Hooks (when added)
// export { useArticles, useArticle, useCreateArticle } from './hooks';

// ✅ Services (when added) 
// export { articlesApi } from './services';

// ✅ Types (when added)
// export type { Article, ArticleFormData, ArticleFilters } from './types';

// ✅ Router
export { default as ArticlesRouter } from './router'; 
