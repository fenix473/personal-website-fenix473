'use client';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import '@/styles/Projects.css';
import React from 'react';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export default function Grid2() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Item><Link href="/projects/dashboard" className="project-card project-card--dashboard" prefetch={false}>
          <div className="project-card__bg" />
          <div className="project-card__content">
            <div className="project-card__accent" />
            <h2 className="project-card__title">Dashboard</h2>
            <p className="project-card__description">
              Interactive dashboard for tracking and analyzing data.
            </p>
            <span className="project-card__cta">View project →</span>
          </div>
        </Link></Item>
        </Grid>
        <Grid size={6}>
          <Item><Link href="/projects/piano" className="project-card project-card--piano" prefetch={false}>
          <div className="project-card__bg" />
          <div className="project-card__content">
            <div className="project-card__accent" />
            <h2 className="project-card__title">Piano</h2>
            <p className="project-card__description">
              Interactive one-octave piano with keyboard and touch support. 
              Built with Web Audio API.
            </p>
            <span className="project-card__cta">View project →</span>
          </div>
        </Link></Item>
        </Grid>
        <Grid size={12}>
          <Item><Link href="/projects/assistant" className="project-card project-card--assistant" prefetch={false}>
          <div className="project-card__bg" />
          <div className="project-card__content">
            <div className="project-card__accent" />
            <h2 className="project-card__title">Assistant</h2>
            <p className="project-card__description">
              Human in the loop assistant using Claude. They will help you navigating this website and answer your general quiriousities.
            </p>
            <span className="project-card__cta">View project →</span>
          </div>
        </Link></Item>
        </Grid>
      </Grid>
    </Box>
  );
}