import { BrowserRouter as Router, Routes, Route, Navigate as RouterNavigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Navigate from './pages/Navigate';
import Food from './pages/Food';
import Ticket from './pages/Ticket';
import Login from './pages/Login';
import SelectStadium from './pages/SelectStadium';
import Emergency from './pages/Emergency';
import Restroom from './pages/Restroom';
import Management from './pages/Management';
import { StadiumProvider } from './context/StadiumContext';
import { LanguageProvider } from './context/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';

const UserGuard = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (currentUser.role === 'admin') return <RouterNavigate to="/management" replace />;
  return children;
};

const AdminGuard = ({ children }) => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (currentUser.role !== 'admin') return <RouterNavigate to="/" replace />;
  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <StadiumProvider>
        <Router>
          <MainLayout>
            <Routes>
              {/* Standalone isolated login page */}
              <Route path="/login" element={<Login />} />

              {/* Legacy select-stadium page */}
              <Route path="/select-stadium" element={<UserGuard><SelectStadium /></UserGuard>} />

              {/* Main app pages - User Only */}
              <Route path="/" element={<UserGuard><Home /></UserGuard>} />
              <Route path="/navigate" element={<UserGuard><Navigate /></UserGuard>} />
              <Route path="/food" element={<UserGuard><Food /></UserGuard>} />
              <Route path="/ticket" element={<UserGuard><Ticket /></UserGuard>} />
              <Route path="/emergency" element={<UserGuard><Emergency /></UserGuard>} />
              <Route path="/restroom" element={<UserGuard><Restroom /></UserGuard>} />

              {/* Management app pages - Admin Only */}
              <Route path="/management" element={<AdminGuard><Management /></AdminGuard>} />

              {/* Default fallback → login */}
              <Route path="*" element={<RouterNavigate to="/login" replace />} />
            </Routes>
          </MainLayout>
        </Router>
      </StadiumProvider>
    </LanguageProvider>
  </ErrorBoundary>
);
}

export default App;
