/**
 * Suggested Questions for Chatbot
 * 
 * @description Manages suggested questions based on context and intent
 */

export interface SuggestedQuestionsConfig {
  [key: string]: string[];
}

export const suggestedQuestions: SuggestedQuestionsConfig = {
  // Câu hỏi gợi ý chung
  general: [
    'Giờ làm việc?',
    'Dịch vụ gì?',
    'Giá dịch vụ?',
    'Số điện thoại?',
    'Email liên hệ?',
    'Địa chỉ bệnh viện?',
    'Cấp cứu gọi số nào?'
  ],

  // Câu hỏi gợi ý cho giờ làm việc
  working_hours: [
    'Giá dịch vụ?',
    'Số điện thoại?',
    'Email liên hệ?',
    'Địa chỉ bệnh viện?'
  ],

  // Câu hỏi gợi ý cho giá dịch vụ
  pricing: [
    'Dịch vụ khám bệnh?',
    'Giá xét nghiệm?',
    'Giá nội soi?',
    'Giá siêu âm?',
    'Giá tiêm chủng?',
    'Giá thấp nhất?',
    'Giá cao nhất?',
    'Số điện thoại?',
    'Email liên hệ?'
  ],

  // Câu hỏi gợi ý cho giá cụ thể
  specific_pricing: [
    'Giá thấp nhất?',
    'Giá cao nhất?',
    'Giá tiêm chủng?',
    'Giá xét nghiệm?',
    'Giá nội soi?',
    'Giá siêu âm?',
    'Dịch vụ gì?',
    'Số điện thoại?'
  ],

  // Câu hỏi gợi ý cho thông tin liên hệ chung
  contact: [
    'Số điện thoại cụ thể?',
    'Email liên hệ?',
    'Địa chỉ bệnh viện?',
    'Giờ làm việc?',
    'Cấp cứu gọi số nào?'
  ],

  // Câu hỏi gợi ý cho số điện thoại
  phone_email: [
    'Email liên hệ?',
    'Địa chỉ bệnh viện?',
    'Giờ làm việc?',
    'Cấp cứu gọi số nào?',
    'Hotline là gì?'
  ],

  // Câu hỏi gợi ý cho email
  email_contact: [
    'Số điện thoại?',
    'Địa chỉ bệnh viện?',
    'Giờ làm việc?',
    'Cấp cứu gọi số nào?'
  ],

  // Câu hỏi gợi ý cho địa chỉ bệnh viện
  hospital_address: [
    'Số điện thoại?',
    'Email liên hệ?',
    'Giờ làm việc?'
  ],

  // Câu hỏi gợi ý cho cấp cứu
  emergency_contact: [
    'Số điện thoại bệnh viện?',
    'Địa chỉ bệnh viện?',
    'Giờ làm việc?',
    'Có cấp cứu 24/7 không?'
  ],

  // Câu hỏi gợi ý cho dịch vụ
  services: [
    'Giá dịch vụ?',
    'Tư vấn online?',
    'Số điện thoại?',
    'Email liên hệ?',
    'Địa chỉ bệnh viện?'
  ],

  // Câu hỏi gợi ý cho lời chào
  greeting: [
    'Giờ làm việc?',
    'Dịch vụ gì?',
    'Giá dịch vụ?',
    'Số điện thoại?',
    'Email liên hệ?',
    'Địa chỉ bệnh viện?'
  ]
};

// Hàm helper để lấy câu hỏi gợi ý theo intent
export function getSuggestedQuestions(intentName: string): string[] {
  return suggestedQuestions[intentName] || suggestedQuestions.general;
}

// Hàm helper để lấy câu hỏi gợi ý chung
export function getGeneralSuggestedQuestions(): string[] {
  return suggestedQuestions.general;
} 