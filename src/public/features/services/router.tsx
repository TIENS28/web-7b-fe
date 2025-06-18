/**
 * Services Feature Router
 * Định nghĩa routes cho Services feature
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'shared/components';

// Lazy load pages
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const MedicalPricingDetailPage = React.lazy(() => import('./pages/MedicalPricingDetailPage'));
const VaccinePricingDetailPage = React.lazy(() => import('./pages/VaccinePricingDetailPage'));
const DrugPricingDetailPage = React.lazy(() => import('./pages/DrugPricingDetailPage'));

/**
 * Services Router với ErrorBoundary
 */
export default function ServicesRouter() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<ServicesPage />} />
        <Route path="/pricing/medical" element={<MedicalPricingDetailPage />} />
        <Route path="/pricing/vaccine" element={<VaccinePricingDetailPage />} />
        <Route path="/pricing/drug" element={<DrugPricingDetailPage />} />
      </Routes>
    </ErrorBoundary>
  );
} 
