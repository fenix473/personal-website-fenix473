import Resume from "./Resume";
import About from "./About";
import Contact from "./Contact";
import Writings from "./Writings";
import ProjectsGrid from "./ProjectsGrid";

function Home() {
    return (
        <div className="home-section">
            {/* Hero Section - Full Page */}
            <section className="hero-section">
                <div className="hero-section__container">
                    <div className="hero-section__content">
                        <h1 className="hero-section__title">Libero Favi</h1>
                        <h2 className="hero-section__subtitle">
                            Full-Stack Developer | AI Automation & Data Processing
                        </h2>
                        <p className="hero-section__description">
                            Developer with a journalism background. I build web apps,
                            automate workflows, and work with AI—but I actually care
                            about whether something is useful, not just technically
                            impressive. In an age where ChatGPT can write anything,
                            imagination (knowing what to ask for) beats raw knowledge.
                            That&apos;s where humanities meet tech.
                        </p>
                        <div className="hero-section__actions">
                            <a href="#projects" className="hero-button hero-button--primary">
                                View Projects
                            </a>
                            <a href="#contact" className="hero-button hero-button--secondary">
                                Get in Touch
                            </a>
                        </div>
                    </div>
                    <div className="hero-section__visual">
                        <div className="hero-section__visual-glow" />
                    </div>
                </div>
            </section>

            <section id="projects" className="projects-section">
                <h1 className="projects-section__title">Projects</h1>
                <div className="projects-section">
                    <ProjectsGrid />
                </div>
            </section>
            <div id="about">
                <h2 className="projects-section__title">About Me</h2>
                <About />
            </div>
            <div id="writings">
                <h2 className="projects-section__title">Writings</h2>
                <Writings />
            </div>
            <div id="resume">
                <h2 className="projects-section__title">Resume</h2>
                <Resume />
            </div>
            <div id="contact">
                <h2 className="projects-section__title">Contact Me</h2>
                <Contact />
            </div>
        </div>
    );
}

export default Home;
