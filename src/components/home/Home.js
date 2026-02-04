import Resume from "./Resume";
import About from "./About";
import Contact from "./Contact";
import Writings from "./Writings";
import ProjectsGrid from "./ProjectsGrid";

function Home() {
    return (
        <div className="home-section">
            <div className="home-section__card">
                <h1 className="home-section__title">Home</h1>
                <h2>Welcome to my website. Here you can find everything you need to know about me.</h2>
                <p>I am a journalist and a software engineer. I have many tools and skills under my belt, ranging from data analysis to video editing. I firmly believe in the blend of technology and humanities, bringing best from the both worlds.</p>
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
