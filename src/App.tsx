import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, ProfilePage, RoundsListPage, RoundPage } from './pages';
import { ProtectedRoute, Navbar } from './components';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<Navigate to="/profile" replace />} />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <div className="app-layout">
              <Navbar />
              <ProfilePage />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/play" element={
          <ProtectedRoute>
            <div className="app-layout">
              <Navbar />
              <RoundsListPage />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="/round/:id" element={
          <ProtectedRoute>
            <div className="app-layout">
              <Navbar />
              <RoundPage />
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/profile" replace />} />
      </Routes>
    </Router>
  );
}

export default App;