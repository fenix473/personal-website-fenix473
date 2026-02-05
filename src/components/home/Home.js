import Resume from "./Resume";
import About from "./About";
import Contact from "./Contact";
import Writings from "./Writings";
import ProjectsGrid from "./ProjectsGrid";

function Home() {
    return (
        <div className="home-section">
            <div className="home-section__card">
                <h1 className="home-section__title">Libero Favi</h1>
                <h2>Full-Stack Developer | AI Automation & Data Processing</h2>
                <p>Developer with a journalism background. I build web apps, automate workflows, and work with AI—but I actually care about whether something is useful, not just technically impressive. In an age where ChatGPT can write anything, imagination (knowing what to ask for) beats raw knowledge. That's where humanities meet tech.</p>
            </div>
            <section className="projects-section">
                <h1 className="projects-section__title">Projects</h1>
                <div className="projects-section">
                    <ProjectsGrid />
                </div>
            </section>
            <About />
            <h1 className="projects-section__title">Writings</h1>
            <Writings />
            <Resume />
            <Contact />
        </div>
    );
}

export default Home;
