'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import '@/styles/Projects.css';
import React from 'react';
import { projects } from '@/data/projects';

type ProjectVariant = 'dashboard' | 'trader' | 'assistant';
const projectsTyped = projects as Array<{
  href: string;
  variant: ProjectVariant;
  title: string;
  description: string;
  imagePosition?: 'left' | 'right';
  external?: boolean;
}>;

const itemSx = {
  backgroundColor: 'transparent',
  padding: 0,
  textAlign: 'center',
  boxShadow: 'none',
};

function ProjectCard({
  href,
  variant,
  title,
  description,
  imagePosition = 'left',
  external = false,
}: {
  href: string;
  variant: ProjectVariant;
  title: string;
  description: string;
  imagePosition?: 'left' | 'right';
  external?: boolean;
}) {
  const className = `project-card project-card--${variant}${imagePosition === 'right' ? ' project-card--image-right' : ''}`;
  const content = (
    <>
      <div className="project-card__image" />
      <div className="project-card__content">
        <div className="project-card__accent" />
        <h2 className="project-card__title">{title}</h2>
        <p className="project-card__description">{description}</p>
        <span className="project-card__cta">View project →</span>
      </div>
    </>
  );
  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={className} prefetch={false}>
      {content}
    </Link>
  );
}

export default function ProjectsGrid() {
  return (
    <Box sx={{ flexGrow: 1, width: '100%' }}>
      <Grid container spacing={2}>
        {projectsTyped.map((project) => (
          <Grid size={12} key={project.href}>
            <Paper sx={itemSx} component="div">
              <ProjectCard
                href={project.href}
                variant={project.variant}
                title={project.title}
                description={project.description}
                imagePosition={project.imagePosition ?? 'left'}
                external={project.external}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
