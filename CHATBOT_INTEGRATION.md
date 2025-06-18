# 🤖 Hướng dẫn tích hợp Chatbot vào Web 7B

## 📋 Tổng quan

Chatbot đã được tích hợp thành công vào dự án web-7b-fe theo kiến trúc feature-based hiện tại. Chatbot có thể được sử dụng ở bất kỳ trang nào trong ứng dụng.

## 🚀 Cách sử dụng nhanh

### 1. Import ChatbotWidget

```tsx
import { ChatbotWidget } from 'shared/features/chatbot';
```

### 2. Thêm vào component

```tsx
function MyPage() {
  return (
    <div>
      {/* Nội dung trang */}
      
      {/* Chatbot Widget */}
      <ChatbotWidget 
        position="bottom-right"
        theme="light"
        hospitalName="Bệnh viện 7B"
        welcomeMessage="Xin chào! Tôi có thể giúp gì cho bạn?"
      />
    </div>
  );
}
```

## ⚙️ Cấu hình Chatbot

### Props có sẵn:

```tsx
interface ChatbotConfig {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'light' | 'dark';
  hospitalName?: string;
  hospitalLogo?: string;
  welcomeMessage?: string;
  autoOpen?: boolean;
}
```

### Ví dụ cấu hình đầy đủ:

```tsx
<ChatbotWidget 
  position="bottom-right"
  theme="light"
  hospitalName="Bệnh viện 7B"
  hospitalLogo="/logo-7b.png"
  welcomeMessage="Xin chào! Tôi là trợ lý ảo của Bệnh viện 7B. Tôi có thể giúp gì cho bạn?"
  autoOpen={false}
/>
```

## 🎯 Tích hợp vào trang chủ

### Thêm vào PublicLayout:

```tsx
// src/public/layouts/PublicLayout.tsx
import { ChatbotWidget } from 'shared/features/chatbot';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
      
      {/* Chatbot cho tất cả trang public */}
      <ChatbotWidget 
        position="bottom-right"
        theme="light"
        hospitalName="Bệnh viện 7B"
      />
    </div>
  );
};
```

### Thêm vào AdminLayout:

```tsx
// src/admin/layouts/AdminLayout.tsx
import { ChatbotWidget } from 'shared/features/chatbot';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <AdminHeader />
      <main>{children}</main>
      
      {/* Chatbot cho admin */}
      <ChatbotWidget 
        position="bottom-right"
        theme="dark"
        hospitalName="Bệnh viện 7B - Admin"
        welcomeMessage="Xin chào! Tôi có thể hỗ trợ quản trị viên."
      />
    </div>
  );
};
```

## 🧪 Test Chatbot

### Trang Demo:

Truy cập `/chatbot-demo` để test chatbot với đầy đủ tính năng.

### Câu hỏi test:

- "Giờ làm việc của bệnh viện?"
- "Bệnh viện ở đâu?"
- "Số điện thoại liên hệ?"
- "Email liên hệ?"
- "Chi phí khám bệnh bao nhiêu?"
- "Bệnh viện có những dịch vụ gì?"

## 🎨 Tùy chỉnh giao diện

### Thay đổi màu sắc:

Các biến CSS có thể được tùy chỉnh trong file CSS:

```css
/* Trong ChatbotWidget.css */
.message-icon {
  background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
}
```

### Dark Mode:

Chatbot tự động hỗ trợ dark mode khi theme="dark":

```tsx
<ChatbotWidget theme="dark" />
```

## 📱 Responsive Design

Chatbot đã được thiết kế responsive và sẽ tự động điều chỉnh trên mobile:

- Icon chat nhỏ hơn trên mobile
- Popup chat full screen trên mobile
- Font size tối ưu cho touch

## 🔧 Tùy chỉnh nội dung

### Thay đổi câu trả lời:

Chỉnh sửa file `src/shared/features/chatbot/utils/chatbotEngine.ts`:

```typescript
{
  name: 'working_hours',
  patterns: ['giờ làm việc', 'mấy giờ'],
  responses: [
    'Chúng tôi hoạt động từ 6h đến 16h30 từ thứ 2 đến thứ 6.',
    // Thêm câu trả lời mới
  ],
  confidence: 0.8
}
```

### Thêm intent mới:

```typescript
{
  name: 'appointment',
  patterns: ['đặt lịch', 'lịch hẹn', 'hẹn khám'],
  responses: [
    'Bạn có thể đặt lịch khám qua hotline: 1900-1234',
    'Để đặt lịch, vui lòng gọi số: 0123-456-7890'
  ],
  confidence: 0.9
}
```

## 🚨 Lưu ý quan trọng

1. **Performance**: Chatbot nhẹ và không ảnh hưởng đến performance
2. **Accessibility**: Đã có aria-label cho các button
3. **SEO**: Chatbot không ảnh hưởng đến SEO
4. **Mobile**: Tối ưu cho mobile và touch
5. **Dark Mode**: Hỗ trợ đầy đủ dark mode

## 🐛 Troubleshooting

### Lỗi import:
```bash
# Kiểm tra đường dẫn
import { ChatbotWidget } from 'shared/features/chatbot';
```

### Chatbot không hiển thị:
- Kiểm tra z-index (mặc định: 1000)
- Kiểm tra position CSS
- Kiểm tra console errors

### Styling conflicts:
- Chatbot sử dụng CSS modules để tránh conflicts
- Có thể override bằng CSS custom properties

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console errors
2. Test trên trang demo `/chatbot-demo`
3. Kiểm tra cấu hình props
4. Xem file logs nếu có 