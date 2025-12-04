
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

import ProductList from './pages/ProductList';

import ProductDetail from './pages/ProductDetail';
import ProductEditor from './pages/ProductEditor';
import BOMList from './pages/BOMList';
import BOMEditor from './pages/BOMEditor';
import SupplierList from './pages/SupplierList';
import SupplierEditor from './pages/SupplierEditor';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AuditLog from './pages/AuditLog';

import ECOList from './pages/ECOList';
import ECOEditor from './pages/ECOEditor';
import QualityDashboard from './pages/QualityDashboard';
import NCREditor from './pages/NCREditor';
import Analytics from './pages/Analytics';

import { ToastProvider } from './context/ToastContext';

import { useEffect } from 'react';
import { useStore } from './store/useStore';

function App() {
  const { fetchData } = useStore();

  useEffect(() => {
    fetchData();
  }, []);

  console.log('App.tsx is rendering');
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="boms" element={<BOMList />} />
              <Route path="suppliers" element={<SupplierList />} />
              <Route path="ecos" element={<ECOList />} />
              <Route path="ecos/:id" element={<ECOEditor />} />
              <Route path="quality" element={<QualityDashboard />} />
              <Route path="quality/ncr/new" element={<NCREditor />} />
              <Route path="quality/ncr/:id" element={<NCREditor />} />

              {/* Engineer Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ENGINEER', 'ADMIN']} />}>
                <Route path="products/new" element={<ProductEditor />} />
                <Route path="products/:id/edit" element={<ProductEditor />} />
                <Route path="boms/new" element={<BOMEditor />} />
                <Route path="boms/:id/edit" element={<BOMEditor />} />
                <Route path="ecos/new" element={<ECOEditor />} />
              </Route>

              {/* Manager Routes */}
              <Route element={<ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']} />}>
                <Route path="suppliers/new" element={<SupplierEditor />} />
                <Route path="suppliers/:id/edit" element={<SupplierEditor />} />
              </Route>

              {/* DGM/Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['DGM', 'ADMIN', 'MANAGER']} />}>
                <Route path="audit-logs" element={<AuditLog />} />
                <Route path="analytics" element={<Analytics />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
