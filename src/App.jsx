/**
 * App.jsx
 * Root entry point for FutureCity.
 * Manages: Auth state, Auth modal overlay, routing between pages.
 *
 * Flow:
 *  - App wraps everything in <AuthProvider>
 *  - Auth modal is a floating overlay (not a separate page)
 *  - FutureCity main page is always visible underneath
 *  - Admin panel replaces main page when user clicks Admin
 */

import { useState } from "react";
import { AuthProvider, useAuth } from "./components/AuthModule";
import AuthPage from "./components/AuthModule";
import FutureCity from "./components/MainDashboard";
import "./index.css";

// Inner component can use useAuth hook (must be inside AuthProvider)
function AppInner() {
  const { user, logout } = useAuth();

  // Controls the auth modal visibility and which form to show
  const [authModal, setAuthModal] = useState(null); // null | "login" | "register"

  function openSignIn()    { setAuthModal("login");    }
  function openRegister()  { setAuthModal("register"); }
  function closeModal()    { setAuthModal(null);       }

  function handleLogout() {
    logout();
    setAuthModal(null);
  }

  return (
    <>
      {/* Main platform — always rendered */}
      <FutureCity
        user={user}
        onLogout={handleLogout}
        onSignIn={openSignIn}
        onGetStarted={openRegister}
      />

      {/* Auth modal — floats over everything when triggered */}
      {authModal && (
        <AuthPage
          defaultView={authModal}
          onClose={closeModal}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}