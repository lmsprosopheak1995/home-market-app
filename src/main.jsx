import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'
import { PropertiesProvider } from './hooks/useProperties.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PropertiesProvider>
          <App />
        </PropertiesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
