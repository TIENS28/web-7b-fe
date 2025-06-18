/**
 * Banner Slider Component
 * Slider banner tự động với navigation dots và controls
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from 'shared/components/shadcn/button';
import type { BannerSlide } from 'shared/types/Pricing.types';
interface BannerSliderProps {
  slides: BannerSlide[];
  autoSlideInterval?: number; // milliseconds
  showControls?: boolean;
  showDots?: boolean;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({
  slides,
  autoSlideInterval = 5000,
  showControls = true,
  showDots = true
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto slide effect
  useEffect(() => {
    if (isHovered || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [currentSlide, isHovered, slides.length, autoSlideInterval]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (slides.length === 0) {
    return (
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-green-500 via-blue-500 to-teal-500 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="relative z-10 text-white text-center px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Dịch vụ y tế chất lượng cao</h2>
          <p className="text-xl md:text-2xl text-blue-100">Bệnh viện Quân y 7B - Luôn đồng hành cùng sức khỏe của bạn</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-96 md:h-[500px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="min-w-full h-full relative flex items-center justify-center"
          >
            {/* Background Image with Fallback */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-green-500 via-blue-500 to-teal-500 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: slide.image ? `url(${slide.image})` : 'none',
              }}
            >
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 max-w-4xl">
              <h3 className="text-lg md:text-xl font-medium text-blue-200 mb-2">
                {slide.subtitle}
              </h3>
              <h1 className="text-3xl md:text-6xl font-bold mb-6">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                {slide.description}
              </p>
              
              {slide.cta && (
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => {
                    // Handle CTA click - could use React Router Link
                    console.log('Navigate to:', slide.cta?.link);
                  }}
                >
                  {slide.cta.text}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {showControls && slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide
                  ? 'bg-white'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 