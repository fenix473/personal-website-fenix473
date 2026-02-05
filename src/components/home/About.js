import { about } from "@/data/about";
import PopInWords from "@/components/ui/PopInWords";

function About() {
    return (
        <div className="about-section">
            <h3 className="about-section__heading"><PopInWords text="Education" staggerMs={60} /></h3>
            {about.education.map((line, i) => (
                <p key={i} className="about-section__paragraph">
                    <PopInWords text={line} staggerMs={35} />
                </p>
            ))}

            <h3 className="about-section__heading"><PopInWords text="Experience" staggerMs={60} /></h3>
            {about.experience.map((line, i) => (
                <p key={i} className="about-section__paragraph">
                    <PopInWords text={line} staggerMs={35} />
                </p>
            ))}

            <h3 className="about-section__heading"><PopInWords text="Skills" staggerMs={60} /></h3>
            <ul className="about-section__list">
                {about.skills.map((skill, i) => (
                    <li key={i} className="about-section__item">
                        <strong><PopInWords text={skill.label} staggerMs={30} /></strong>{" "}
                        <PopInWords text={skill.items} staggerMs={30} />
                    </li>
                ))}
            </ul>

            <h3 className="about-section__heading"><PopInWords text="Languages" staggerMs={60} /></h3>
            <p className="about-section__paragraph">
                <PopInWords text={about.languages} staggerMs={25} />
            </p>
        </div>
    );
}

export default About;
