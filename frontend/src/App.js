import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import LandlordDashboard from './pages/LandlordDashboard';
import TenantDashboard from './pages/TenantDashboard';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import UserDetails from './pages/UserDetails';
import UserDetailsRecord from './pages/UserDetailsRecord';
import UserManagement from './pages/UserManagement';
import AddProperty from './pages/AddProperty';
import PropertyList from './pages/PropertyList';
import AdminApproval from './pages/AdminApproval';
import LandlordWallet from './pages/LandlordWallet';
import TenantWallet from './pages/TenantWallet';
import About from './pages/About';
import TenantRental from './pages/TenantRental';
import LandlordRental from './pages/LandlordRental';
import TenantApprovedRequests from './pages/TenantApprovedRequests';
import PaymentHistory from './pages/PaymentHistory';
import AdminAbout from './pages/AdminAbout';
import Support from './pages/Support';
import AdminSupport from './pages/AdminSupport';
import WalletHistory from './pages/WalletHistory';
import SubmitReview from './pages/SubmitReview';
import ViewReviews from './pages/ViewReviews';
import AdminReview from './pages/AdminReview';
import AllUsers from './pages/AllUsers';
import MyProfile from './pages/MyProfile';

// Protected Route Component for Admin
const ProtectedRoute = ({ children }) => {
  const admin = JSON.parse(localStorage.getItem('admin'));
  const adminToken = localStorage.getItem('adminToken');
  
  if (!admin || !adminToken) {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

// Protected Route Component for Users
const UserProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Protected Route Component for Wallet History
const WalletHistoryRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is either landlord or tenant
  if (user.role !== 'landlord' && user.role !== 'tenant') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<About/>}/>
        <Route path="/support" element={<Support />} />
        <Route path="/submit-review" element={<SubmitReview />} />
        <Route path="/view-reviews" element={<ViewReviews />} />
        
        {/* Protected User Routes */}
        <Route path="/landlord-dashboard/*" element={
          <UserProtectedRoute>
            <LandlordDashboard />
          </UserProtectedRoute>
        }>
          <Route index element={<LandlordDashboard />} />
        </Route>

        <Route path="/landlord-wallet" element={
          <UserProtectedRoute>
            <LandlordWallet />
          </UserProtectedRoute>
        } />

        <Route path="/tenant-dashboard/*" element={
          <UserProtectedRoute>
            <TenantDashboard />
          </UserProtectedRoute>
        }>
          <Route index element={<TenantDashboard />} />
        </Route>

        <Route path="/tenant-wallet" element={
          <UserProtectedRoute>
            <TenantWallet />
          </UserProtectedRoute>
        } />

        <Route path="/add-property" element={
          <UserProtectedRoute>
            <AddProperty />
          </UserProtectedRoute>
        }/>

        <Route path="/property-list" element={
          <UserProtectedRoute>
            <PropertyList />
          </UserProtectedRoute>
        }/>

        <Route path="/tenant-rental-request" element={
          <UserProtectedRoute>
            <TenantRental />
          </UserProtectedRoute>
        }/>

        <Route path="/landlord-approval-rental" element={
          <UserProtectedRoute>
            <LandlordRental />
          </UserProtectedRoute>
        }/>

        <Route path="/tenant-approved-requests" element={
          <UserProtectedRoute>
            <TenantApprovedRequests />
          </UserProtectedRoute>
        }/>

        <Route path="/payment-history" element={
          <UserProtectedRoute>
            <PaymentHistory />
          </UserProtectedRoute>
        }/>

        <Route path="/my-profile" element={
          <UserProtectedRoute>
            <MyProfile />
          </UserProtectedRoute>
        }/>

        <Route path="/wallet-history" element={
          <WalletHistoryRoute>
            <WalletHistory />
          </WalletHistoryRoute>
        } />

        {/* Protected Admin Routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/user-management" element={
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        }/>
        <Route path="/user-details" element={
          <ProtectedRoute>
            <UserDetails />
          </ProtectedRoute>
        }/>
        <Route path="/user-details/:id" element={
          <ProtectedRoute>
            <UserDetailsRecord />
          </ProtectedRoute>
        }/>
        <Route path="/admin-approval" element={
          <ProtectedRoute>
            <AdminApproval />
          </ProtectedRoute>
        }/>
        <Route path="/admin-about" element={
          <ProtectedRoute>
            <AdminAbout />
          </ProtectedRoute>
        }/>
        <Route path="/admin-support" element={
          <ProtectedRoute>
            <AdminSupport />
          </ProtectedRoute>
        }/>
        <Route path="/admin/reviews" element={<ProtectedRoute><AdminReview /></ProtectedRoute>} />
        <Route path="/all-users" element={<AllUsers />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen flex flex-col pt-20">
          <Navbar />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </ToastProvider>
  );
};

export default App;
