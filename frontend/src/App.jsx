import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportItem from './pages/ReportItem';
import EditItem from './pages/EditItem';
import ItemDetail from './pages/ItemDetail';
import MyReports from './pages/MyReports';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route
              path="/report/:type"
              element={<ProtectedRoute><ReportItem /></ProtectedRoute>}
            />
            <Route
              path="/edit/:id"
              element={<ProtectedRoute><EditItem /></ProtectedRoute>}
            />
            <Route
              path="/my-reports"
              element={<ProtectedRoute><MyReports /></ProtectedRoute>}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
