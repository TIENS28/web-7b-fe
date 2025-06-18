import { Route } from 'react-router-dom';
import { AboutPage } from './pages';

/**
 * About Feature Routes
 * Định nghĩa các routes cho feature About
 */
export const aboutRoutes = (
  <Route path="/about" element={<AboutPage />} />
); 
