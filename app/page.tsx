import React from 'react';

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      minHeight: '100vh',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Welcome to SmartRisk</h1>
      <p style={{ fontSize: '1.25rem' }}>Your risk management solution</p>
    </main>
  );
} 