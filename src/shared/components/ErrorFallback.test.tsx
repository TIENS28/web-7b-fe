import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../test/test-utils';
import { ErrorFallback, PageErrorFallback, FeatureErrorFallback, APIErrorFallback } from './ErrorFallback';

// ✅ REQUIRED: Test file for ErrorFallback component

describe('ErrorFallback', () => {
  const mockError = new Error('Test error message');
  const mockResetError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders error message correctly', () => {
    render(<ErrorFallback error={mockError} resetError={mockResetError} />);
    
    expect(screen.getByText('Có lỗi xảy ra')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('calls resetError when retry button is clicked', () => {
    render(<ErrorFallback error={mockError} resetError={mockResetError} />);
    
    const retryButton = screen.getByText('Thử lại');
    fireEvent.click(retryButton);
    
    expect(mockResetError).toHaveBeenCalledTimes(1);
  });

  it('shows home button by default', () => {
    render(<ErrorFallback error={mockError} />);
    
    expect(screen.getByText('Trang chủ')).toBeInTheDocument();
  });

  it('hides home button when showHomeButton is false', () => {
    render(<ErrorFallback error={mockError} showHomeButton={false} />);
    
    expect(screen.queryByText('Trang chủ')).not.toBeInTheDocument();
  });

  it('shows custom title and description', () => {
    render(
      <ErrorFallback 
        error={mockError} 
        title="Custom Title"
        description="Custom description"
      />
    );
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom description')).toBeInTheDocument();
  });
});

describe('Specific Error Fallbacks', () => {
  const mockError = new Error('Test error');
  const mockResetError = vi.fn();

  it('PageErrorFallback renders with correct content', () => {
    render(<PageErrorFallback error={mockError} resetError={mockResetError} />);
    
    expect(screen.getByText('Không thể tải trang')).toBeInTheDocument();
  });

  it('FeatureErrorFallback renders with correct content', () => {
    render(<FeatureErrorFallback error={mockError} resetError={mockResetError} />);
    
    expect(screen.getByText('Tính năng tạm thời không khả dụng')).toBeInTheDocument();
  });

  it('APIErrorFallback renders with correct content', () => {
    render(<APIErrorFallback error={mockError} resetError={mockResetError} />);
    
    expect(screen.getByText('Lỗi kết nối')).toBeInTheDocument();
  });
}); 