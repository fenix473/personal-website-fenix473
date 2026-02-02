import Link from 'next/link';
import '@/styles/Projects.css';
import React from 'react';
import { Carousel, ConfigProvider } from 'antd';

const carouselTheme = {
  components: {
    Carousel: {
      dotWidth: 20,
      dotHeight: 14,
      dotActiveWidth: 28,
      dotGap: 10,
    },
  },
};

/**
 * Projects Section
 * Displays project cards with links to individual project pages
 */
function Projects() {
  return (
      <ConfigProvider theme={carouselTheme}>
        <Carousel autoplay dotPlacement="left" draggable={true}>
      {/* Dashboard Project Card */}
      <Link href="/projects/dashboard" className="project-card project-card--dashboard" prefetch={false}>
          <div className="project-card__icon">
          📊
          </div>
          <div className="project-card__content">
            <h2 className="project-card__title">Dashboard</h2>
            <p className="project-card__description">
              Interactive dashboard for tracking and analyzing data.
            </p>
          </div>
        </Link>
        {/* Piano Project Card */}
        <Link href="/projects/piano" className="project-card project-card--piano" prefetch={false}>
          <div className="project-card__icon">
            🎹
          </div>
          <div className="project-card__content">
            <h2 className="project-card__title">Piano</h2>
            <p className="project-card__description">
              Interactive one-octave piano with keyboard and touch support. 
              Built with Web Audio API.
            </p>
          </div>
        </Link>
        <Link href="/projects/assistant" className="project-card project-card--assistant" prefetch={false}>
          <div className="project-card__icon">
            🤖
          </div>
          <div className="project-card__content">
            <h2 className="project-card__title">Assistant</h2>
            <p className="project-card__description">
              Human in the loop assistant using Claude. They will help you navigating this website and answer your general quiriousities.
            </p>
          </div>
        </Link>
      </Carousel>
      </ConfigProvider>
  );
}

export default Projects;