import { about } from "@/data/about";

function About() {
    return (
        <div className="about-section">
            <h3>Education</h3>
            {about.education.map((line, i) => (
                <p key={i}>{line}</p>
            ))}

            <h3>Experience</h3>
            {about.experience.map((line, i) => (
                <p key={i}>{line}</p>
            ))}

            <h3>Skills</h3>
            <ul>
                {about.skills.map((skill, i) => (
                    <li key={i}><strong>{skill.label}</strong> {skill.items}</li>
                ))}
            </ul>

            <h3>Languages</h3>
            <p>{about.languages}</p>
        </div>
    );
}

export default About;
