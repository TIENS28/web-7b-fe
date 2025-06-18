import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from 'shared/components/shadcn/button';

interface ErrorFallbackProps {
  error: Error;
  resetError?: () => void;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  title?: string;
  description?: string;
}

/**
 * Enhanced Error Fallback Component
 * 
 * @description Improved fallback UI for error boundaries with multiple actions
 * @author Architecture Team
 */
export function ErrorFallback({ 
  error, 
  resetError,
  showHomeButton = true,
  showBackButton = true,
  title = "Có lỗi xảy ra",
  description 
}: ErrorFallbackProps) {
  
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const defaultDescription = description || error.message || 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.';

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] bg-white dark:bg-gray-900">
      {/* Error Icon */}
      <div className="mb-6 p-4 rounded-full bg-red-50 dark:bg-red-900/20">
        <AlertTriangle className="h-16 w-16 text-red-500 dark:text-red-400" />
      </div>
      
      {/* Error Message */}
      <div className="max-w-md mx-auto mb-6">
        <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
          {title}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {defaultDescription}
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {resetError && (
          <Button 
            onClick={resetError} 
            className="gap-2"
            size="lg"
          >
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </Button>
        )}
        
        {showBackButton && (
          <Button 
            onClick={handleGoBack} 
            variant="outline" 
            className="gap-2"
            size="lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        )}
        
        {showHomeButton && (
          <Button 
            onClick={handleGoHome} 
            variant="secondary" 
            className="gap-2"
            size="lg"
          >
            <Home className="h-4 w-4" />
            Trang chủ
          </Button>
        )}
      </div>
      
      {/* Development Error Details */}
      {import.meta.env.DEV && (
        <details className="mt-8 text-left w-full max-w-2xl">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2">
            🔧 Chi tiết lỗi (Development Mode)
          </summary>
          <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Error Message:
                </h4>
                <p className="text-sm text-red-600 dark:text-red-400 font-mono">
                  {error.message}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Stack Trace:
                </h4>
                <pre className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-white dark:bg-gray-900 p-3 rounded border overflow-auto max-h-40">
                  {error.stack}
                </pre>
              </div>
            </div>
          </div>
        </details>
      )}
      
      {/* Help Text */}
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 max-w-lg">
        Nếu lỗi vẫn tiếp tục xảy ra, vui lòng liên hệ bộ phận hỗ trợ kỹ thuật.
      </div>
    </div>
  );
}

// Specific error fallbacks for different contexts
export function PageErrorFallback({ error, resetError }: { error: Error; resetError?: () => void }) {
  return (
    <ErrorFallback 
      error={error}
      resetError={resetError}
      title="Không thể tải trang"
      description="Trang bạn yêu cầu gặp sự cố. Vui lòng thử lại hoặc quay lại trang trước."
    />
  );
}

export function FeatureErrorFallback({ error, resetError }: { error: Error; resetError?: () => void }) {
  return (
    <ErrorFallback 
      error={error}
      resetError={resetError}
      title="Tính năng tạm thời không khả dụng"
      description="Tính năng này đang gặp sự cố. Vui lòng thử lại sau ít phút."
      showBackButton={false}
    />
  );
}

export function APIErrorFallback({ error, resetError }: { error: Error; resetError?: () => void }) {
  return (
    <ErrorFallback 
      error={error}
      resetError={resetError}
      title="Lỗi kết nối"
      description="Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại."
      showBackButton={false}
    />
  );
} 