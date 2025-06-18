import { getSuggestedQuestions, getGeneralSuggestedQuestions } from './suggestedQuestions';
import type { Intent, ChatResponse } from '../types';

export class ChatbotEngine {
  private intents: Intent[] = [
    {
      name: 'working_hours',
      patterns: [
        'giờ làm việc', 'giờ hoạt động', 'mấy giờ', 'thời gian làm việc',
        'mở cửa', 'đóng cửa', 'giờ mở cửa', 'giờ đóng cửa',
        'có làm việc', 'có mở cửa', 'thời gian hoạt động', 'hành chính', 'giờ hành chính'
      ],
      responses: [
        '⏰ Giờ làm việc:\n📅 Thứ 2 - Thứ 6: 7h00 - 11h30, 13h30 - 17h00\n📅 Thứ 7: 7h00 - 11h30\n📅 Chủ nhật: Nghỉ (trừ cấp cứu)\n🚨 Cấp cứu: 24 / 7',
        '🕐 Thời gian hoạt động:\n• Thứ 2 - Thứ 6: 7h00 - 11h30, 13h30 - 17h00\n• Thứ 7: 7h00 - 11h30\n• Chủ nhật: Nghỉ\n• Cấp cứu: 24 / 7',
        '🏥 Giờ mở cửa:\n📆 Thứ 2 - Thứ 6: 7h00 - 11h30, 13h30 - 17h00\n📆 Thứ 7: 7h00 - 11h30\n📆 Chủ nhật: Nghỉ\n🚨 Cấp cứu: 24 / 7'
      ],
      confidence: 0.8,
      entities: ['time', 'day']
    },
    {
      name: 'pricing',
      patterns: [
        'giá', 'bao nhiêu tiền', 'chi phí', 'phí dịch vụ', 'giá cả',
        'tốn bao nhiêu', 'phí bao nhiêu', 'giá dịch vụ', 'bảng giá'
      ],
      responses: [
        '💰 Bảng giá dịch vụ của chúng tôi:\n\n📊 Phạm vi giá: 27.000 ₫ - 120.000.000 ₫\n\n📋 Dịch vụ chính:\n• Khám bệnh: từ 150.000 ₫\n• Xét nghiệm: từ 27.000 ₫\n• Nội soi: từ 165.500 ₫\n• Chẩn đoán hình ảnh: từ 200.000 ₫\n\n🔗 Xem chi tiết đầy đủ: /services?tab=pricing',
        
        '💵 Chi phí dịch vụ y tế:\n\n📈 Khoảng giá: 27.000 ₫ - 120.000.000 ₫\n\n🏥 Các loại dịch vụ:\n• Khám tổng quát: 200.000 ₫\n• Xét nghiệm máu: 150.000 ₫\n• Siêu âm: 300.000 ₫\n• Nội soi: 575.300 ₫\n\n📖 Bảng giá chi tiết: /services?tab=pricing',
        
        '💳 Bảng giá dịch vụ:\n\n💰 Giá từ: 27.000 ₫ - 120.000.000 ₫\n\n🩺 Dịch vụ nổi bật:\n• Khám sức khỏe: 200.000 ₫\n• Xét nghiệm: 150.000 ₫\n• Chẩn đoán hình ảnh: 300.000 ₫\n• Tiêm chủng: 200.000 ₫\n\n📋 Xem bảng giá đầy đủ: /services?tab=pricing'
      ],
      confidence: 0.85,
      entities: ['price_range']
    },
    {
      name: 'specific_pricing',
      patterns: [
        'giá thấp nhất', 'giá rẻ nhất', 'giá tối thiểu', 'giá ít nhất',
        'giá cao nhất', 'giá đắt nhất', 'giá tối đa', 'giá nhiều nhất',
        'giá tiêm chủng', 'giá vaccine', 'giá chủng ngừa',
        'giá xét nghiệm', 'giá thử máu', 'giá xét nghiệm máu',
        'giá nội soi', 'giá soi', 'giá soi dạ dày', 'giá soi đại tràng',
        'giá siêu âm', 'giá siêu âm bụng', 'giá siêu âm tim'
      ],
      responses: [
        '💰 Thông tin giá cụ thể:\n\n📉 Giá thấp nhất: 27.000 ₫ (xét nghiệm cơ bản)\n📈 Giá cao nhất: 120.000.000 ₫ (phẫu thuật phức tạp)\n\n💉 Tiêm chủng: từ 200.000 ₫\n🔬 Xét nghiệm: từ 27.000 ₫\n🔍 Nội soi: từ 165.500 ₫\n📷 Siêu âm: từ 200.000 ₫\n\n📋 Xem chi tiết: /services?tab=pricing',
        
        '💵 Chi tiết giá dịch vụ:\n\n💸 Giá tối thiểu: 27.000 ₫\n💸 Giá tối đa: 120.000.000 ₫\n\n🏥 Dịch vụ phổ biến:\n• Tiêm chủng: 200.000 ₫\n• Xét nghiệm máu: 150.000 ₫\n• Nội soi dạ dày: 575.300 ₫\n• Siêu âm bụng: 300.000 ₫\n\n📖 Bảng giá đầy đủ: /services?tab=pricing',
        
        '💳 Khoảng giá dịch vụ:\n\n📊 Thấp nhất: 27.000 ₫\n📊 Cao nhất: 120.000.000 ₫\n\n🩺 Giá dịch vụ chính:\n• Tiêm chủng: từ 200.000 ₫\n• Xét nghiệm: từ 27.000 ₫\n• Nội soi: từ 165.500 ₫\n• Siêu âm: từ 200.000 ₫\n\n🔗 Chi tiết: /services?tab=pricing'
      ],
      confidence: 0.9,
      entities: ['specific_price']
    },
    {
      name: 'contact',
      patterns: [
        'cách liên hệ', 'phương thức liên hệ', 'liên hệ như thế nào',
        'cách thức liên hệ', 'phương pháp liên hệ', 'liên hệ bằng cách nào'
      ],
      responses: [
        'Bạn có thể liên hệ với chúng tôi qua:\n📞 Số điện thoại: 0251 39 99 60 60\n📧 Email: bvquany7b@gmail.com\n📍 Địa chỉ: Đường Nguyễn Ái Quốc, P. Tân Mai, TP. Biên Hoà, Đồng Nai',
        'Để liên hệ, bạn có thể:\n• Gọi điện: 0251 39 99 60 60\n• Gửi email: bvquany7b@gmail.com\n• Đến trực tiếp: Đường Nguyễn Ái Quốc, P. Tân Mai, TP. Biên Hoà, Đồng Nai',
        'Thông tin liên hệ:\n📱 Điện thoại: 0251 39 99 60 60\n✉️ Email: bvquany7b@gmail.com\n📍 Địa chỉ: Đường Nguyễn Ái Quốc, P. Tân Mai, TP. Biên Hoà, Đồng Nai'
      ],
      confidence: 0.9,
      entities: ['contact_methods']
    },
    {
      name: 'phone_email',
      patterns: [
        'số điện thoại', 'số phone', 'hotline', 'gọi điện', 'call',
        'số liên lạc', 'điện thoại', 'phone number', 'sdt', 'số máy'
      ],
      responses: [
        '📞 Số điện thoại liên hệ: 0251 39 99 60 60\n🆘 Cấp cứu: 114 (24/7)\n⏰ Giờ làm việc: 7h00 - 17h00 (Thứ 2 - Thứ 6)',
        'Bạn có thể gọi đến:\n• Số chính: 0251 39 99 60 60\n• Cấp cứu: 114 (24/7)\n• Giờ làm việc: 7h00 - 17h00',
        'Liên hệ qua điện thoại:\n📱 0251 39 99 60 60 (giờ hành chính)\n🚨 114 (cấp cứu 24/7)'
      ],
      confidence: 0.85,
      entities: ['phone_number']
    },
    {
      name: 'email_contact',
      patterns: [
        'email', 'mail', 'thư điện tử', 'gmail', 'outlook',
        'địa chỉ email', 'email liên hệ', 'mail liên hệ', 'email address'
      ],
      responses: [
        '📧 Email liên hệ:\n✉️ bvquany7b@gmail.com\n\n📞 Điện thoại: 0251 39 99 60 60\n📍 Địa chỉ: Đường Nguyễn Ái Quốc, P. Tân Mai, TP. Biên Hoà, Đồng Nai',
        'Bạn có thể gửi email đến:\n✉️ bvquany7b@gmail.com\n\n📱 Điện thoại: 0251 39 99 60 60\n📍 Địa chỉ: Đường Nguyễn Ái Quốc, P. Tân Mai, TP. Biên Hoà, Đồng Nai',
        'Email chính thức:\n📨 bvquany7b@gmail.com\n\n📞 Điện thoại: 0251 39 99 60 60\n📍 Địa chỉ: Đường Nguyễn Ái Quốc, P. Tân Mai, TP. Biên Hoà, Đồng Nai'
      ],
      confidence: 0.85,
      entities: ['email_address']
    },
    {
      name: 'hospital_address',
      patterns: [
        'địa chỉ bệnh viện', 'bệnh viện ở đâu', 'địa điểm bệnh viện',
        'nằm ở đâu', 'ở đâu', 'địa chỉ cụ thể', 'đường nào', 'quận nào',
        'địa chỉ', 'địa điểm', 'vị trí', 'location', 'address'
      ],
      responses: [
        '🏥 Địa chỉ bệnh viện:\n📍 Đường Nguyễn Ái Quốc, P. Tân Mai, TP. Biên Hoà, Đồng Nai\n🗺️ Cách trung tâm TP. Biên Hoà 3km\n🚗 Có bãi đỗ xe miễn phí\n🚌 Xe buýt: Tuyến 01, 02, 03',
        'Bệnh viện tọa lạc tại:\n📍 Đường Nguyễn Ái Quốc, P. Tân Mai, TP. Biên Hoà, Đồng Nai\n🏪 Gần chợ Tân Mai\n🚇 Thuận tiện giao thông\n🅿️ Bãi đỗ xe rộng rãi',
        '📍 Địa chỉ: Đường Nguyễn Ái Quốc, P. Tân Mai, TP. Biên Hoà, Đồng Nai\n🗺️ Cách chợ Tân Mai 500m\n🚗 Có bãi đỗ xe miễn phí\n🚌 Xe buýt: Tuyến 01, 02, 03'
      ],
      confidence: 0.9,
      entities: ['address']
    },
    {
      name: 'emergency_contact',
      patterns: [
        'cấp cứu', 'khẩn cấp', 'tai nạn', 'nguy hiểm', 'gọi cấp cứu',
        'số cấp cứu', 'hotline cấp cứu', 'cấp cứu gọi số nào', 'số khẩn cấp'
      ],
      responses: [
        '🚨 Cấp cứu khẩn cấp:\n📞 Gọi ngay: 114\n🏥 Bệnh viện: 0251 39 99 60 60\n📍 Địa chỉ: Đường Nguyễn Ái Quốc, P. Tân Mai, TP. Biên Hoà, Đồng Nai\n⏰ Cấp cứu: 24/7',
        '🚑 Thông tin cấp cứu:\n• Số cấp cứu: 114 (24/7)\n• Bệnh viện: 0251 39 99 60 60\n• Địa chỉ: Đường Nguyễn Ái Quốc, P. Tân Mai, TP. Biên Hoà, Đồng Nai\n• Hoạt động: 24/7',
        '🆘 Cấp cứu:\n📱 114 (số cấp cứu quốc gia)\n🏥 0251 39 99 60 60 (bệnh viện)\n📍 Đường Nguyễn Ái Quốc, P. Tân Mai, TP. Biên Hoà, Đồng Nai\n⏰ 24/7'
      ],
      confidence: 0.95,
      entities: ['emergency_contact']
    },
    {
      name: 'services',
      patterns: [
        'dịch vụ', 'cung cấp gì', 'làm gì', 'chuyên về', 'có những gì',
        'dịch vụ gì', 'có cung cấp', 'chuyên môn', 'ngành nghề'
      ],
      responses: [
        'Chúng tôi cung cấp các dịch vụ y tế đa dạng:\n🏥 Khám bệnh tổng quát (từ 150.000 ₫)\n🔬 Xét nghiệm chẩn đoán (từ 27.000 ₫)\n📷 Chẩn đoán hình ảnh (từ 200.000 ₫)\n💉 Tiêm chủng vaccine (từ 200.000 ₫)\n💊 Dịch vụ dược phẩm\n\n💰 Phạm vi giá: 27.000 ₫ - 120.000.000 ₫\n\n📋 Xem chi tiết: /services',
        'Các dịch vụ chính của chúng tôi bao gồm:\n• Khám và điều trị (từ 150.000 ₫)\n• Xét nghiệm y khoa (từ 27.000 ₫)\n• Chẩn đoán hình ảnh (từ 200.000 ₫)\n• Tiêm chủng (từ 200.000 ₫)\n• Tư vấn sức khỏe\n\n💵 Khoảng giá: 27.000 ₫ - 120.000.000 ₫\n\n🔗 Chi tiết: /services',
        'Chúng tôi chuyên về:\n🩺 Khám bệnh đa khoa (từ 150.000 ₫)\n🧪 Xét nghiệm chính xác (từ 27.000 ₫)\n📊 Chẩn đoán hình ảnh (từ 200.000 ₫)\n💉 Tiêm chủng an toàn (từ 200.000 ₫)\n💊 Dược phẩm chất lượng\n\n💳 Giá từ: 27.000 ₫ - 120.000.000 ₫\n\n📖 Xem đầy đủ: /services'
      ],
      confidence: 0.75,
      entities: ['service_type']
    },
    {
      name: 'greeting',
      patterns: [
        'xin chào', 'chào', 'hello', 'hi', 'chào bạn', 'xin chào bạn',
        'good morning', 'good afternoon', 'good evening'
      ],
      responses: [
        'Xin chào! Bạn có thể hỏi tôi bất cứ điều gì.',
        'Chào bạn! Tôi có thể giúp gì cho bạn?',
        'Xin chào! Rất vui được gặp bạn. Bạn cần tư vấn gì không?'
      ],
      confidence: 0.95,
      entities: []
    }
  ];

  private preprocessText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  private findBestIntent(userText: string): { intent: Intent; confidence: number } {
    const processedText = this.preprocessText(userText);
    let bestIntent = this.intents[0];
    let bestConfidence = 0;

    for (const intent of this.intents) {
      let maxPatternConfidence = 0;
      
      for (const pattern of intent.patterns) {
        const processedPattern = this.preprocessText(pattern);
        const similarity = this.calculateSimilarity(processedText, processedPattern);
        
        // Boost confidence if exact words match
        const words = processedText.split(' ');
        const patternWords = processedPattern.split(' ');
        const exactMatches = words.filter(word => patternWords.includes(word)).length;
        const wordMatchBonus = exactMatches / Math.max(words.length, patternWords.length) * 0.3;
        
        const totalConfidence = similarity + wordMatchBonus;
        maxPatternConfidence = Math.max(maxPatternConfidence, totalConfidence);
      }
      
      const finalConfidence = maxPatternConfidence * intent.confidence;
      
      if (finalConfidence > bestConfidence) {
        bestConfidence = finalConfidence;
        bestIntent = intent;
      }
    }

    return { intent: bestIntent, confidence: bestConfidence };
  }

  private getRandomResponse(intent: Intent): string {
    const responses = intent.responses;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  public processMessage(userText: string): ChatResponse {
    const { intent, confidence } = this.findBestIntent(userText);
    const response = this.getRandomResponse(intent);
    
    // Get suggested questions based on intent
    const suggestedQuestions = this.getSuggestedQuestionsForIntent(intent.name);
    
    return {
      text: response,
      confidence: confidence,
      intent: intent.name,
      suggestedQuestions: suggestedQuestions
    };
  }

  public getSuggestedQuestions(context?: string): string[] {
    return getGeneralSuggestedQuestions();
  }

  public getSuggestedQuestionsForIntent(intentName: string): string[] {
    return getSuggestedQuestions(intentName);
  }
} 