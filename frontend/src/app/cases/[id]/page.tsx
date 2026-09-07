'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Briefcase, FileText, Calendar, Edit, Plus } from 'lucide-react';
import styles from '@/app/Dashboard.module.css';

export default function CaseDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [caseObj, setCaseObj] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://10.252.32.1:5000/api/cases/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Case not found');
        return res.json();
      })
      .then(data => {
        setCaseObj(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ padding: '48px', textAlign: 'center' }}>Loading case details...</div>;
  if (error) return <div style={{ padding: '48px', textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!caseObj) return null;

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <Link href="/cases" style={{ color: 'var(--text-secondary)', marginRight: '12px' }}>
              <ArrowLeft size={24} style={{ verticalAlign: 'middle' }} />
            </Link>
            {caseObj.caseId}
          </h1>
          <p className={styles.subtitle} style={{ marginLeft: '36px' }}>{caseObj.title}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className={styles.btnSecondary}><Edit size={16} style={{marginRight: '8px'}} /> Edit Case</button>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column - Case Info */}
        <div className={styles.card} style={{ gridColumn: 'span 1' }}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <Briefcase size={18} />
              Case Information
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status</div>
                <span className={`${styles.statusBadge} ${
                      caseObj.status === 'Active' ? styles.active : 
                      caseObj.status === 'Pending Docs' ? styles.pending : styles.inactive
                    }`} style={{ marginTop: '4px', display: 'inline-block' }}>
                  {caseObj.status}
                </span>
              </div>
              
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Type</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500, marginTop: '2px' }}>{caseObj.type}</div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Court</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500, marginTop: '2px' }}>{caseObj.court}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Filing Date</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500, marginTop: '2px' }}>
                  {new Date(caseObj.filingDate).toLocaleDateString()}
                </div>
              </div>
              
            </div>
            
            <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Client</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {caseObj.client?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <Link href={`/clients/${caseObj.client?._id}`} className={styles.primaryLink} style={{ fontWeight: 600 }}>
                    {caseObj.client?.name || 'Unknown'}
                  </Link>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{caseObj.client?.mobile || 'No contact'}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column - Tabs & Content */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className={styles.card}>
             <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <Calendar size={18} />
                Next Hearing
              </div>
            </div>
            {caseObj.nextHearing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'var(--accent-light)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                  {new Date(caseObj.nextHearing).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Hearing Scheduled</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{caseObj.court}</div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                No upcoming hearings scheduled.
              </div>
            )}
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <FileText size={18} />
                Documents
              </div>
              <button className={styles.btnSecondary} style={{ padding: '4px 8px', fontSize: '0.75rem' }}><Plus size={14} style={{marginRight: '4px'}}/> Upload</button>
            </div>
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              No documents linked to this case.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
