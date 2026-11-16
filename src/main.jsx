import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { I18nProvider } from './hooks/useI18n.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'
import { PropertiesProvider } from './hooks/useProperties.jsx'
import { VerifiedProvider } from './hooks/useVerified.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <PropertiesProvider>
            <VerifiedProvider>
              <App />
            </VerifiedProvider>
          </PropertiesProvider>
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  </React.StrictMode>
)
