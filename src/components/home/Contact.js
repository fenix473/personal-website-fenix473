'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

function Contact() {
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, description }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMessage(data.error || 'Something went wrong');
        setStatus('error');
        return;
      }
      setStatus('success');
      setEmail('');
      setDescription('');
    } catch {
      setErrorMessage('Network error');
      setStatus('error');
    }
  }

  return (
    <div className="contact-section">
      <Box sx={{ width: '100%', marginTop: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <div className="contact-form-box contact-links-box">
              <div className="contact-links">
                <a href="https://www.linkedin.com/in/liberofavi/" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a href="https://github.com/fenix473" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
                <a href="mailto:favi.libero@gmail.com" target="_blank" rel="noopener noreferrer">
                  Email
                </a>
                <a href="tel:+17373256215">(737) 325-6215</a>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <div className="contact-form-box">
              <form onSubmit={handleSubmit} className="contact-form">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={status === 'sending'}
                />
                <label htmlFor="contact-description">Description of enquiry</label>
                <textarea
                  id="contact-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Your message..."
                  rows={4}
                  required
                  disabled={status === 'sending'}
                />
                <button type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Submit'}
                </button>
                {status === 'success' && <p className="contact-form-message contact-form-success">Message sent. I’ll get back to you soon.</p>}
                {status === 'error' && <p className="contact-form-message contact-form-error">{errorMessage}</p>}
              </form>
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Contact;
