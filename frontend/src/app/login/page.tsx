'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scale, User, Lock, Eye, EyeOff, ArrowRight, Briefcase } from 'lucide-react';
import styles from './Login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const routeUser = (role: string) => {
    if (role === 'Junior Advocate') {
      router.push('/junior-dashboard');
    } else {
      router.push('/');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://10.252.32.1:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('lexoraUser', JSON.stringify(data));
      localStorage.setItem('lexoraToken', data.token);

      routeUser(data.role);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginFormContent = (
    <div className={styles.loginCard}>
      <div className={styles.loginHeader}>
        <Scale size={32} className={styles.loginHeaderIcon} />
        <h3>Welcome Back</h3>
        <p>Sign in to your Lexora account</p>
      </div>

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '24px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className={styles.inputGroup}>
          <User size={18} className={styles.inputIcon} />
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            placeholder="Email or Username"
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <Lock size={18} className={styles.inputIcon} />
          <input 
            type={showPassword ? "text" : "password"} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="Password"
            required
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.inputAction}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        <div className={styles.loginOptions}>
          <label className={styles.rememberMe}>
            <input type="checkbox" /> Remember Me
          </label>
          <span className={styles.forgotPwd}>Forgot Password?</span>
        </div>

        <button type="submit" className={styles.signInBtn} disabled={loading}>
          {loading ? 'Processing...' : 'Sign In'} <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );

  return (
    <div className={styles.loginPageWrapper}>
      
      {/* Desktop Layout */}
      <div className={styles.desktopContainer}>
        <div className={styles.leftSide}>
          <div className={styles.brandContainer}>
            <Scale size={40} className={styles.brandIcon} />
            <div className={styles.brandText}>
              <h1>LEXORA</h1>
              <p>LAW MANAGEMENT SYSTEM</p>
            </div>
          </div>
          
          <div className={styles.marketingText}>
            <h2>Your Complete<br/><span className={styles.goldText}>Legal Practice</span><br/>Management Partner</h2>
            <p className={styles.tagline}>Organize &bull; Track &bull; Manage &bull; Grow</p>
          </div>

          <div className={styles.desktopFeatures}>
             <div className={styles.desktopFeature}>
               <Briefcase size={24} className={styles.goldText} style={{marginTop: '2px'}} />
               <div className={styles.desktopFeatureText}>
                 <h4>Case Management</h4>
                 <p>Track every case with ease</p>
               </div>
             </div>
             <div className={styles.desktopFeature}>
               <User size={24} className={styles.goldText} style={{marginTop: '2px'}} />
               <div className={styles.desktopFeatureText}>
                 <h4>Client Management</h4>
                 <p>Build stronger client relationships</p>
               </div>
             </div>
          </div>
        </div>

        <div className={styles.rightSide}>
          {loginFormContent}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className={styles.mobileWrapper}>
        <div className={styles.mobileHeader}>
          <Scale size={32} className={styles.mobileHeaderIcon} />
          <h1>LEXORA</h1>
        </div>
        <div className={styles.mobileContent}>
          {loginFormContent}
        </div>
      </div>
    </div>
  );
}
