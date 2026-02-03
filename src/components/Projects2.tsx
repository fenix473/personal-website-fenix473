'use client';

import { styled } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import '@/styles/Projects.css';
import React from 'react';
import { projectsTheme } from '@/theme/projects-theme';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: 'transparent',
  padding: 0,
  textAlign: 'center',
  boxShadow: 'none',
  ...theme.applyStyles('dark', {
    backgroundColor: 'transparent',
  }),
}));

function ProjectCard({
  href,
  variant,
  title,
  description,
  imagePosition = 'left',
}: {
  href: string;
  variant: 'dashboard' | 'piano' | 'assistant';
  title: string;
  description: string;
  imagePosition?: 'left' | 'right';
}) {
  return (
    <Link
      href={href}
      className={`project-card project-card--${variant}${imagePosition === 'right' ? ' project-card--image-right' : ''}`}
      prefetch={false}
    >
      <div className="project-card__image" />
      <div className="project-card__content">
        <div className="project-card__accent" />
        <h2 className="project-card__title">{title}</h2>
        <p className="project-card__description">{description}</p>
        <span className="project-card__cta">View project →</span>
      </div>
    </Link>
  );
}

export default function Grid2() {
  return (
    <ThemeProvider theme={projectsTheme}>
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Item>
              <ProjectCard
                href="/projects/dashboard"
                variant="dashboard"
                title="Dashboard"
                description="Interactive dashboard for tracking and analyzing data."
              />
            </Item>
          </Grid>
          <Grid size={12}>
            <Item>
              <ProjectCard
                href="/projects/piano"
                variant="piano"
                title="Piano"
                description="Interactive one-octave piano with keyboard and touch support. Built with Web Audio API."
                imagePosition="right"
              />
            </Item>
          </Grid>
          <Grid size={12}>
            <Item>
              <ProjectCard
                href="/projects/assistant"
                variant="assistant"
                title="Assistant"
                description="Human in the loop assistant using Claude. They will help you navigating this website and answer your general curiosities."
              />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
