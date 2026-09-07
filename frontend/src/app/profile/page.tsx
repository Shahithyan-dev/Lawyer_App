'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Bell, Settings, HelpCircle, LogOut, ChevronRight, Edit2, Camera, Image as ImageIcon, X, Check, Save } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';

export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState<string>("https://ui-avatars.com/api/?name=Advocate+Kumar&background=C6A15B&color=fff&size=200");
  
  // UI States
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Router
  const router = useRouter();
  
  // Cropper States
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedImage = localStorage.getItem('userAvatar');
    if (savedImage) {
      setProfileImage(savedImage);
    }
    
    const handleOpenProfile = () => setActiveModal('profile');
    window.addEventListener('openProfileModal', handleOpenProfile);
    
    return () => {
      window.removeEventListener('openProfileModal', handleOpenProfile);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setShowActionSheet(false);
        setShowCropper(true);
        e.target.value = ''; // Reset
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSaveCrop = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        setProfileImage(croppedImage);
        localStorage.setItem('userAvatar', croppedImage);
        window.dispatchEvent(new Event('avatarUpdated'));
        setShowCropper(false);
        setImageSrc(null);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lexoraUser');
    localStorage.removeItem('lexoraToken');
    // We do not remove 'userAvatar' so it persists across logouts as requested
    router.push('/login');
  };

  return (
    <div style={{ padding: '24px 16px', maxWidth: '600px', margin: '0 auto', paddingBottom: '100px', backgroundColor: '#fff', minHeight: '100vh', position: 'relative' }}>
      
      {/* Avatar and Info */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '48px' }}>
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <div style={{ 
            width: '110px', 
            height: '110px', 
            borderRadius: '50%', 
            backgroundColor: '#e0e0e0', 
            overflow: 'hidden', 
            border: '4px solid #fff', 
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)' 
          }}>
             <img src={profileImage} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          
          <button 
            onClick={() => setShowActionSheet(true)}
            style={{ 
              position: 'absolute', bottom: '0', right: '0', 
              width: '32px', height: '32px', borderRadius: '50%', 
              backgroundColor: '#111', color: '#fff', 
              border: '2px solid #fff', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', 
              cursor: 'pointer' 
            }}
          >
            <Camera size={16} />
          </button>
          
          <input 
            type="file" 
            accept="image/*"
            ref={galleryInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }} 
          />
          <input 
            type="file" 
            accept="image/*"
            capture="environment"
            ref={cameraInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }} 
          />
        </div>
        
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111', marginBottom: '4px' }}>Advocate Kumar</h2>
        <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '12px', fontWeight: 500 }}>Senior Advocate</p>
        
        <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '6px' }}>kumarlawchambers@gmail.com</p>
        <p style={{ fontSize: '0.95rem', color: '#666' }}>+91 98765 43210</p>
      </div>

      {/* Menu Options */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        
        <div onClick={() => setActiveModal('profile')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 8px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#111' }}>
            <User size={22} color="#666" />
            <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>My Profile</span>
          </div>
          <ChevronRight size={22} color="#ccc" />
        </div>

        <div onClick={() => setActiveModal('password')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 8px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#111' }}>
            <Lock size={22} color="#666" />
            <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>Change Password</span>
          </div>
          <ChevronRight size={22} color="#ccc" />
        </div>

        <div onClick={() => setActiveModal('notifications')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 8px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#111' }}>
            <Bell size={22} color="#666" />
            <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>Notification Settings</span>
          </div>
          <ChevronRight size={22} color="#ccc" />
        </div>

        <div onClick={() => setActiveModal('app')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 8px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#111' }}>
            <Settings size={22} color="#666" />
            <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>App Settings</span>
          </div>
          <ChevronRight size={22} color="#ccc" />
        </div>

        <div onClick={() => setActiveModal('help')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 8px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#111' }}>
            <HelpCircle size={22} color="#666" />
            <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>Help & Support</span>
          </div>
          <ChevronRight size={22} color="#ccc" />
        </div>

        <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 8px', cursor: 'pointer', marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#d93838' }}>
            <LogOut size={22} />
            <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>Logout</span>
          </div>
        </div>
      </div>

      {/* Action Sheet (Take Photo / Choose from Gallery) */}
      {showActionSheet && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
        }} onClick={() => setShowActionSheet(false)}>
          
          <div style={{ 
            backgroundColor: '#fff', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', 
            padding: '24px 16px 40px 16px', animation: 'slideUp 0.3s ease-out'
          }} onClick={e => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>Change Profile Photo</h3>
              <button onClick={() => setShowActionSheet(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} color="#666" />
              </button>
            </div>

            <button 
              onClick={() => cameraInputRef.current?.click()}
              style={{ 
                width: '100%', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', 
                backgroundColor: '#f9f9f9', border: 'none', borderRadius: '12px', marginBottom: '12px',
                fontSize: '1.05rem', fontWeight: 500, cursor: 'pointer', color: '#111'
              }}
            >
              <div style={{ padding: '10px', backgroundColor: '#eef6f4', color: '#156f5a', borderRadius: '50%' }}>
                <Camera size={20} />
              </div>
              Take Photo
            </button>

            <button 
              onClick={() => galleryInputRef.current?.click()}
              style={{ 
                width: '100%', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', 
                backgroundColor: '#f9f9f9', border: 'none', borderRadius: '12px',
                fontSize: '1.05rem', fontWeight: 500, cursor: 'pointer', color: '#111'
              }}
            >
              <div style={{ padding: '10px', backgroundColor: '#f3e8ff', color: '#8b5cf6', borderRadius: '50%' }}>
                <ImageIcon size={20} />
              </div>
              Choose from Gallery
            </button>

          </div>
        </div>
      )}

      {/* Fullscreen Cropper Modal */}
      {showCropper && imageSrc && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: '#000', zIndex: 200, display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ 
            padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff', zIndex: 201 
          }}>
            <button onClick={() => setShowCropper(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <X size={24} /> Cancel
            </button>
            <button onClick={handleSaveCrop} style={{ background: 'none', border: 'none', color: '#C6A15B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '1rem' }}>
              <Check size={24} /> Save
            </button>
          </div>

          <div style={{ position: 'relative', flex: 1 }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          <div style={{ padding: '24px', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 201 }}>
            <div style={{ color: '#fff', textAlign: 'center', marginBottom: '8px', fontSize: '0.9rem' }}>Zoom</div>
            <input 
              type="range" 
              value={zoom} 
              min={1} 
              max={3} 
              step={0.1} 
              aria-labelledby="Zoom" 
              onChange={(e) => {
                setZoom(Number(e.target.value))
              }} 
              style={{ width: '100%', accentColor: '#C6A15B' }}
            />
          </div>
        </div>
      )}

      {/* Settings Modals */}
      {activeModal && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: '#f9f9f9', zIndex: 100, overflowY: 'auto'
        }}>
          <div style={{ padding: '24px 16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #eaeaea', backgroundColor: '#fff' }}>
            <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '16px' }}>
              <ChevronRight size={24} color="#111" style={{ transform: 'rotate(180deg)' }} />
            </button>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>
              {activeModal === 'profile' && 'My Profile'}
              {activeModal === 'password' && 'Change Password'}
              {activeModal === 'notifications' && 'Notification Settings'}
              {activeModal === 'app' && 'App Settings'}
              {activeModal === 'help' && 'Help & Support'}
            </h2>
          </div>

          <div style={{ padding: '24px 16px' }}>
            {activeModal === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="text" defaultValue="Advocate Kumar" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #ccc', width: '100%' }} />
                <input type="email" defaultValue="kumarlawchambers@gmail.com" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #ccc', width: '100%' }} />
                <input type="tel" defaultValue="+91 98765 43210" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #ccc', width: '100%' }} />
                <input type="text" defaultValue="Senior Advocate" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #ccc', width: '100%' }} />
                <button style={{ padding: '16px', backgroundColor: '#C6A15B', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Save size={20} /> Save Changes
                </button>
              </div>
            )}

            {activeModal === 'password' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="password" placeholder="Current Password" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #ccc', width: '100%' }} />
                <input type="password" placeholder="New Password" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #ccc', width: '100%' }} />
                <input type="password" placeholder="Confirm New Password" style={{ padding: '14px', borderRadius: '8px', border: '1px solid #ccc', width: '100%' }} />
                <button style={{ padding: '16px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', marginTop: '16px' }}>
                  Update Password
                </button>
              </div>
            )}

            {activeModal === 'notifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>Push Notifications</h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Receive alerts on your device</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>Email Notifications</h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Receive daily case summaries</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                </div>
              </div>
            )}

            {activeModal === 'app' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>Dark Mode</h4>
                  <input type="checkbox" style={{ width: '20px', height: '20px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>Language</h4>
                  <select style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                    <option>English</option>
                    <option>Hindi</option>
                  </select>
                </div>
              </div>
            )}

            {activeModal === 'help' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#111' }}>Contact Support</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>support@lexora.com</p>
                  <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '0.9rem' }}>1800-123-4567</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eaeaea' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#111' }}>FAQs</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>How to add a new case?</p>
                  <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '0.9rem' }}>How to generate invoices?</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
