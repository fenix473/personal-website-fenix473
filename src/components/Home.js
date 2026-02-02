import Resume from "@/components/Resume";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Projects from "./Projects";
import Writings from "./Writings";

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
                <div className="projects-carousel">
                    <Projects />
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
