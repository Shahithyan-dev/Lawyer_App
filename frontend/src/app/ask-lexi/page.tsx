import React from 'react';
import styles from '@/app/Dashboard.module.css';
import { Bot, Send, Sparkles, FileText, Calendar, Search } from 'lucide-react';

export default function AskLexiPage() {
  return (
    <div className={styles.dashboard} style={{ height: 'calc(100vh - 120px)' }}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bot size={28} color="var(--accent-color)" /> Ask Lexi
          </h1>
          <p className={styles.subtitle}>Your AI Legal Assistant. Summarize documents, extract dates, and search cases.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', height: '100%' }}>
        
        {/* Chat Interface */}
        <div className={styles.card} style={{ flex: 2, display: 'flex', flexDirection: 'column', padding: 0 }}>
           
           {/* Chat History */}
           <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* User Message */}
              <div style={{ alignSelf: 'flex-end', backgroundColor: 'var(--primary-color)', color: 'white', padding: '16px', borderRadius: '16px 16px 0 16px', maxWidth: '80%' }}>
                Summarize case CR-1023
              </div>

              {/* Lexi Response */}
              <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '24px', borderRadius: '16px 16px 16px 0', maxWidth: '90%' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                   <Sparkles size={16} /> Lexi AI
                 </div>
                 <h4 style={{ marginBottom: '12px' }}>Case Summary: CR-1023 (Raj Kumar vs State)</h4>
                 <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px', fontSize: '0.9rem' }}>
                   This criminal case was filed on 15 Jan 2026. The initial petition outlines the primary charges. 
                   Evidence was submitted successfully on 15 April, leading to cross-examination on 10 May. 
                   <br/><br/>
                   <strong>Key Entities:</strong> Raj Kumar (Client), State (Opposite Party), Advocate Kumar (Assigned).<br/>
                   <strong>Next Step:</strong> The next hearing is scheduled for 28 August 2026 at the District Court, Court No. 4.
                 </p>
                 <div style={{ display: 'flex', gap: '8px' }}>
                   <button className={styles.btnSecondary} style={{ fontSize: '0.75rem', padding: '4px 8px' }}>View Case Details</button>
                   <button className={styles.btnSecondary} style={{ fontSize: '0.75rem', padding: '4px 8px' }}>View Timeline</button>
                 </div>
              </div>
           </div>

           {/* Input Area */}
           <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
             <div style={{ display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', padding: '12px 16px', borderRadius: 'var(--radius-full)' }}>
               <input 
                 type="text" 
                 placeholder="Ask Lexi to summarize a document, find a hearing date, or analyze a case..." 
                 style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem' }}
               />
               <button style={{ backgroundColor: 'var(--accent-color)', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Send size={16} />
               </button>
             </div>
             <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '12px' }}>
               AI output should always be treated as assistive. Please review before relying on it.
             </div>
           </div>
        </div>

        {/* Suggested Prompts Sidebar */}
        <div className={styles.card} style={{ flex: 1 }}>
           <h3 style={{ marginBottom: '24px' }}>Suggested Prompts</h3>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             
             <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-btn)', cursor: 'pointer', transition: 'var(--transition)' }} className={styles.suggestedPrompt}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '8px', color: 'var(--primary-color)' }}>
                 <FileText size={16} color="var(--accent-color)" /> Summarize Document
               </div>
               <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>"Summarize the latest court order for CIV-2041"</div>
             </div>

             <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-btn)', cursor: 'pointer', transition: 'var(--transition)' }} className={styles.suggestedPrompt}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '8px', color: 'var(--primary-color)' }}>
                 <Calendar size={16} color="var(--accent-color)" /> Extract Dates
               </div>
               <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>"What are all the upcoming hearing dates this month?"</div>
             </div>

             <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-btn)', cursor: 'pointer', transition: 'var(--transition)' }} className={styles.suggestedPrompt}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '8px', color: 'var(--primary-color)' }}>
                 <Search size={16} color="var(--accent-color)" /> Legal Research
               </div>
               <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>"Find past judgments related to property dispute mediation"</div>
             </div>

           </div>
        </div>

      </div>
    </div>
  );
}
