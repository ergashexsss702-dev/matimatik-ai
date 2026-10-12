/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, UserSession } from './types';
import { NightSkyBackground } from './components/NightSkyBackground';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { Dashboard } from './components/Dashboard';
import { BackgroundCustomizer } from './components/BackgroundCustomizer';
import { AdminModal } from './components/AdminModal';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('app_lang') as Language) || 'uz';
  });

  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('app_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Background customization state
  const [customImage, setCustomImage] = useState<string | null>(() => {
    return localStorage.getItem('app_custom_bg');
  });
  const [dimLevel, setDimLevel] = useState<number>(() => {
    const saved = localStorage.getItem('app_dim_level');
    return saved ? parseFloat(saved) : 0.5;
  });
  const [blurLevel, setBlurLevel] = useState<number>(() => {
    const saved = localStorage.getItem('app_blur_level');
    return saved ? parseInt(saved) : 0;
  });
  const [enableStars, setEnableStars] = useState<boolean>(() => {
    const saved = localStorage.getItem('app_enable_stars');
    return saved !== null ? saved === 'true' : true;
  });

  const [isLightMode, setIsLightMode] = useState<boolean>(false);

  // Modals state
  const [showBgSettings, setShowBgSettings] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const handleLoginSuccess = (session: UserSession) => {
    setUser(session);
    localStorage.setItem('app_user_session', JSON.stringify(session));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('app_user_session');
  };

  const handleImageChange = (img: string | null) => {
    setCustomImage(img);
    if (img) {
      try {
        localStorage.setItem('app_custom_bg', img);
      } catch (e) {
        console.warn('Storage quota exceeded for background image:', e);
      }
    } else {
      localStorage.removeItem('app_custom_bg');
    }
  };

  const handleDimChange = (dim: number) => {
    setDimLevel(dim);
    localStorage.setItem('app_dim_level', dim.toString());
  };

  const handleBlurChange = (blur: number) => {
    setBlurLevel(blur);
    localStorage.setItem('app_blur_level', blur.toString());
  };

  const handleToggleStars = (stars: boolean) => {
    setEnableStars(stars);
    localStorage.setItem('app_enable_stars', stars.toString());
  };

  return (
    <div
      className={`min-h-screen relative flex flex-col font-sans selection:bg-indigo-500 selection:text-white ${
        isLightMode ? 'text-slate-900' : 'text-slate-100'
      }`}
    >
      {/* Realistic Night Sky Background with Shooting Stars & Custom Image Support */}
      <NightSkyBackground
        customImage={customImage}
        dimLevel={dimLevel}
        blurLevel={blurLevel}
        enableStarsOverImage={enableStars}
      />

      {/* Main App Layout */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        user={user}
        onLogout={handleLogout}
        onOpenBgSettings={() => setShowBgSettings(true)}
        onOpenAdmin={() => setShowAdminModal(true)}
        isLightMode={isLightMode}
        onToggleLightMode={() => setIsLightMode(!isLightMode)}
      />

      <main className="flex-1 pb-16">
        {user ? (
          <Dashboard language={language} user={user} />
        ) : (
          <LoginModal
            language={language}
            onLoginSuccess={handleLoginSuccess}
            onOpenAdmin={() => setShowAdminModal(true)}
          />
        )}
      </main>

      {/* Background Customizer Modal */}
      <BackgroundCustomizer
        language={language}
        isOpen={showBgSettings}
        onClose={() => setShowBgSettings(false)}
        customImage={customImage}
        onImageChange={handleImageChange}
        dimLevel={dimLevel}
        onDimChange={handleDimChange}
        blurLevel={blurLevel}
        onBlurChange={handleBlurChange}
        enableStars={enableStars}
        onToggleStars={handleToggleStars}
      />

      {/* Admin Management Modal */}
      <AdminModal
        language={language}
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </div>
  );
}
