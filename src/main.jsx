import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const LoginComponent = lazy(() => import('./Components/Login.jsx'));
const HomeComponent = lazy(() => import('./Components/Home.jsx'));
const RegisterComponent = lazy(() => import('./Components/Register.jsx'));

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Suspense fallback={<div>Loading...</div>}><HomeComponent /></Suspense>
  },
  {
    path: '/login',
    element: <Suspense fallback={<div>Loading...</div>}><LoginComponent /></Suspense>
  },
  {
    path: '/register',
    element: <Suspense fallback={<div>Loading...</div>}><RegisterComponent /></Suspense>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <RouterProvider router={routes} />
      <Toaster />
    </>
  </StrictMode>
);
