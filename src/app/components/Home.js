import Resume from "./Resume";
import About from "./About";
import Contact from "./Contact";

function Home() {
    return (
        <div className="home-section">
            <h1>Home</h1>
            <h2>Welcome to my website. Here you can find everything you need to know about me.</h2>
            <p>I am a journalist and a software engineer. I have many tools and skills under my belt, ranging from data analysis to video editing. I firmly believe in the blend of technology and humanities, bringing best from the both worlds.</p>
            <About />
            <Resume />
            <Contact />
        </div>
    );
}

export default Home;
