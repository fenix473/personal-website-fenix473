import Resume from "./Resume";
import About from "./About";
import Contact from "./Contact";
import Writings from "./Writings";
import ProjectsGrid from "./ProjectsGrid";
import { siteMeta } from "@/data/site-metadata";

function Home() {
    return (
        <div className="home-section">
            {/* Hero Section - Full Page */}
            <section className="hero-section">
                <div className="hero-section__container">
                    <div className="hero-section__content">
                        <h1 className="hero-section__title">{siteMeta.name}</h1>
                        <h2 className="hero-section__subtitle">{siteMeta.tagline}</h2>
                        <p className="hero-section__description">{siteMeta.heroDescription}</p>
                        <div className="hero-section__actions">
                            <a href="#projects" className="hero-button hero-button--primary">
                                {siteMeta.cta.viewProjects}
                            </a>
                            <a href="#contact" className="hero-button hero-button--secondary">
                                {siteMeta.cta.getInTouch}
                            </a>
                        </div>
                    </div>
                    <div className="hero-section__visual">
                        <img
                            src="/images/Profile.jpg"
                            alt="Profile"
                            className="hero-section__avatar"
                        />
                        <div className="hero-section__visual-glow" />
                    </div>
                </div>
            </section>

            <section id="projects" className="projects-section">
                <h1 className="projects-section__title">{siteMeta.sections.projects}</h1>
                <div className="projects-section">
                    <ProjectsGrid />
                </div>
            </section>
            <div id="about">
                <h2 className="projects-section__title">{siteMeta.sections.about}</h2>
                <About />
            </div>
            <div id="writings">
                <h2 className="projects-section__title">{siteMeta.sections.writings}</h2>
                <Writings />
            </div>
            <div id="resume">
                <h2 className="projects-section__title">{siteMeta.sections.resume}</h2>
                <Resume />
            </div>
            <div id="contact">
                <h2 className="projects-section__title">{siteMeta.sections.contact}</h2>
                <Contact />
            </div>
        </div>
    );
}

export default Home;
