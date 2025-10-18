import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InspirationPage from './pages/InspirationPage/InspirationPage';
import OptimizePage from './pages/OptimizePage/OptimizePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InspirationPage />} />
        <Route path="/optimize" element={<OptimizePage />} />
      </Routes>
    </Router>
  );
};

export default App;






