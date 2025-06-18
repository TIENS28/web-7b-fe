import React from 'react';
import { AboutHero, MissionVision } from '../components';

/**
 * About Page
 * Trang giới thiệu về bệnh viện 7B
 */
const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <MissionVision />
    </div>
  );
};

export default AboutPage; 
