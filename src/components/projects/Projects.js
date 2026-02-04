import Link from 'next/link';
import '@/styles/Projects.css';
import React from 'react';
import { Carousel, ConfigProvider } from 'antd';


const carouselTheme = {
  components: {
    Carousel: {
      dotWidth: 128,
      dotHeight: 34,
      dotActiveWidth: 188,
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
        <Carousel autoplay dotPlacement="left" draggable={true} speed={1500} autoplaySpeed={8000}>
      {/* Dashboard Project Card */}
      <Link href="/projects/dashboard" className="project-card project-card--dashboard" prefetch={false}>
          <div className="project-card__bg" />
          <div className="project-card__content">
            <div className="project-card__accent" />
            <h2 className="project-card__title">Dashboard</h2>
            <p className="project-card__description">
              Interactive dashboard for tracking and analyzing data.
            </p>
            <span className="project-card__cta">View project →</span>
          </div>
        </Link>
        {/* Piano Project Card */}
        <Link href="/projects/piano" className="project-card project-card--piano" prefetch={false}>
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
        </Link>
        <Link href="/projects/assistant" className="project-card project-card--assistant" prefetch={false}>
          <div className="project-card__bg" />
          <div className="project-card__content">
            <div className="project-card__accent" />
            <h2 className="project-card__title">Assistant</h2>
            <p className="project-card__description">
              Human in the loop assistant using Claude. They will help you navigating this website and answer your general quiriousities.
            </p>
            <span className="project-card__cta">View project →</span>
          </div>
        </Link>
      </Carousel>
      </ConfigProvider>
  );
}

export default Projects;
