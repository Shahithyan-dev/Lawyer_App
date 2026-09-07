'use client';

import React from 'react';
import { Scale, Briefcase, Calendar as CalendarIcon, FileText, Bell } from 'lucide-react';

export default function ClientPortalPage() {
  return (
    <div style={{
      maxWidth: '100%',
      backgroundColor: '#f5f7f6',
      minHeight: '80vh',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '2px solid var(--border-color)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    }}>
      {/* Mock Client Portal Header */}
      <div style={{ backgroundColor: '#17211F', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Scale color="#C6A15B" size={28} />
          <span style={{ fontSize: '1.2rem', fontWeight: 600, letterSpacing: '1px' }}>Media Wave Legal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Bell size={20} color="#C6A15B" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#C6A15B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#17211F' }}>
              RK
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Raj Kumar</span>
          </div>
        </div>
      </div>

      {/* Mock Client Portal Body */}
      <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
        
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#17211F', marginBottom: '8px' }}>Welcome back, Raj.</h2>
        <p style={{ color: '#555', marginBottom: '32px' }}>Here is the latest update on your legal matters.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          {/* Active Case Card */}
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#eef6f4', padding: '10px', borderRadius: '8px' }}>
                <Briefcase size={20} color="#156f5a" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#17211F' }}>Active Cases</h3>
            </div>
            <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600 }}>Raj Kumar vs State</span>
                <span style={{ backgroundColor: '#eef6f4', color: '#156f5a', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>In Progress</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Case ID: CR-1023</div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px' }}>Assigned to: Adv. Ramesh Patel</div>
            </div>
          </div>

          {/* Next Hearing Card */}
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#fcf3e3', padding: '10px', borderRadius: '8px' }}>
                <CalendarIcon size={20} color="#c28c2e" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#17211F' }}>Upcoming Hearing</h3>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
              <div style={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '8px 16px', textAlign: 'center', minWidth: '70px' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#17211F' }}>12</div>
                <div style={{ fontSize: '0.8rem', color: '#c28c2e', fontWeight: 600, textTransform: 'uppercase' }}>Sep</div>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#17211F' }}>District Court, Court No. 4</div>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>10:30 AM</div>
              </div>
            </div>
          </div>

          {/* Recent Invoices Card */}
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#fbeeee', padding: '10px', borderRadius: '8px' }}>
                <FileText size={20} color="#d93838" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#17211F' }}>Recent Invoices</h3>
            </div>

            <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600 }}>INV-45920</span>
                <span style={{ backgroundColor: '#fbeeee', color: '#d93838', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>Unpaid</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>Due: Sep 15, 2026</div>
                <div style={{ fontWeight: 'bold', color: '#17211F' }}>$1,500.00</div>
              </div>
              <button style={{ width: '100%', marginTop: '16px', padding: '8px', backgroundColor: '#17211F', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 500, cursor: 'pointer' }}>
                Pay Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
