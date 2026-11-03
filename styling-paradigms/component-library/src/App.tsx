import React from 'react';
import { Button } from './components/Button/Button';
import { Card } from './components/Card/Card';
import { Badge } from './components/Badge/Badge';

export default function App() {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '2rem' }}>Exercise 2: Vanilla Extract Component Library</h1>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        
        {/* Buttons Showcase */}
        <Card>
          <h2>Button Component</h2>
          
          <p><strong>Variants:</strong></p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
          </div>

          <p><strong>Sizes:</strong></p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
            <Button size="small">Small</Button>
            <Button size="large">Large</Button>
          </div>

          <p><strong>States:</strong></p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </Card>

        {/* Badges Showcase */}
        <Card>
          <h2>Badge Component</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
          </div>
        </Card>

      </div>
    </div>
  );
}