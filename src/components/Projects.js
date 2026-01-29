import Link from 'next/link';
import '@/styles/Projects.css';

/**
 * Projects Section
 * Displays project cards with links to individual project pages
 */
function Projects() {
  return (
    <div className="projects">
      <h1>Projects</h1>

      <div className="projects__grid">
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
      </div>
    </div>
  );
}

export default Projects;