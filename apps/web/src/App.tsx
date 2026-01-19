import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProjectListPage } from './pages/ProjectListPage';
import { ProjectLayout } from './pages/ProjectLayout';
import { ProjectSettingsPage } from './pages/ProjectSettingsPage';
import { ProjectEpisodesPage } from './pages/ProjectEpisodesPage';
import { AssetStudioPage } from './pages/AssetStudioPage';
import { ProjectStoryboardPage } from './pages/ProjectStoryboardPage';
import { ProjectEditingPage } from './pages/ProjectEditingPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/projects" element={<ProjectListPage />} />
            <Route path="/projects/:projectId" element={<ProjectLayout />}>
              <Route index element={<Navigate to="episodes" replace />} />
              <Route path="settings" element={<ProjectSettingsPage />} />
              <Route path="assets" element={<AssetStudioPage />} />
              <Route path="episodes" element={<ProjectEpisodesPage />} />
              <Route path="storyboard" element={<ProjectStoryboardPage />} />
              <Route path="editing" element={<ProjectEditingPage />} />
            </Route>
            <Route path="/" element={<Navigate to="/projects" replace />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
