import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router.jsx'
import AuthProvider from './provider/AuthProvider'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
<StrictMode>
<AuthProvider>
<QueryClientProvider client={queryClient}>
<HelmetProvider>
  <RouterProvider router={router}/>  
  </HelmetProvider> 
  <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
    />
    </QueryClientProvider>
    </AuthProvider>
</StrictMode>,
)
