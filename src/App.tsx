import { useEffect, useState } from 'react';
import { SIPCalculator } from './components/SIPCalculator';
import { AboutPage } from './components/AboutPage';

function App() {
  const normalizePath = (hash: string) => {
    const clean = hash.replace(/^#/, '');
    if (clean === '' || clean === '/') return '/home';
    return clean.startsWith('/') ? clean : `/${clean}`;
  };

  const getCurrentPath = () => {
    if (window.location.hash) return normalizePath(window.location.hash);

    const pathname = window.location.pathname;
    if (pathname === '/home' || pathname === '/about') return pathname;
    return '/home';
  };
  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    const pathname = window.location.pathname;
    const hash = window.location.hash;

    // Migrate legacy path routes to hash routes so refresh works on static hosting.
    if (!hash && (pathname === '/home' || pathname === '/about')) {
      window.history.replaceState({}, '', `/#${pathname}`);
    } else if (!hash || hash === '#' || hash === '#/') {
      window.history.replaceState({}, '', '/#/home');
    }

    const onHashChange = () => setPath(getCurrentPath());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (to: string) => {
    const target = normalizePath(`#${to}`);
    if (target === path) return;
    window.location.hash = target;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (path === '/about') {
    return <AboutPage onNavigate={navigate} />;
  }

  return <SIPCalculator onNavigate={navigate} />;
}

export default App;
