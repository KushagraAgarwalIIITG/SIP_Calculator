import { useEffect, useState } from 'react';
import { SIPCalculator } from './components/SIPCalculator';
import { AboutPage } from './components/AboutPage';

function App() {
  const normalizePath = (pathname: string) => {
    if (pathname === '/' || pathname === '') return '/home';
    return pathname;
  };

  const [path, setPath] = useState(normalizePath(window.location.pathname));

  useEffect(() => {
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.history.replaceState({}, '', '/home');
    }

    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (to: string) => {
    const target = normalizePath(to);
    if (target === path) return;
    window.history.pushState({}, '', target);
    setPath(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (path === '/about') {
    return <AboutPage onNavigate={navigate} />;
  }

  return <SIPCalculator onNavigate={navigate} />;
}

export default App;
