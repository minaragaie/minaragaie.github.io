import React from 'react';
// This component will receive resumeData as a prop

// Define the types for your resume data to enable proper type-checking
interface Skills {
  languages: string[];
  frameworks: string[];
  databases: string[];
  standards: string[];
  technologies: string[];
  methodologies: string[];
  versionControl: string[];
}

interface Experience {
  id: number;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Certification {
  name: string;
  issuer: string;
  icon: string;
  status: string;
  description: string;
  color: string;
  skills: string[];
  verify?: string;
  pathway?: Certification[];
}

interface ResumeData {
  personalInfo: {
    name: string;
    linkedin: string;
    location: string;
    phone: string;
    email: string;
    profileImage: string;
  };
  highlights: string;
  experience: Experience[];
  skills: Skills;
  education: Education[];
  certifications: Certification[];
  additionalInfo: string;
}


// Function to highlight words in a string
const highlightWords = (text: string, wordsToHighlight: any[]) => {
  if (!text || !wordsToHighlight || wordsToHighlight.length === 0) {
    return text;
  }

  const regex = new RegExp(`\\b(${wordsToHighlight.join('|')})\\b`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    // Check if this part is a word to highlight
    if (wordsToHighlight.some(word => part && word.toLowerCase() === part.toLowerCase())) {
      return <span key={index} className="text-orange-500 font-bold">{part}</span>;
    }
    return part;
  });
};

interface ResumeDocTemplateProps {
  resumeData: any; // You can define a proper type here
}

const ResumeDocTemplate = ({ resumeData }: ResumeDocTemplateProps) => {
  const { personalInfo, highlights, experience, skills, education, certifications, additionalInfo } = resumeData;

  return (
    <div className="min-h-screen bg-white p-4 font-sans antialiased text-black flex justify-center items-start">
      <div className="w-full max-w-4xl bg-white shadow-lg flex flex-col rounded-xl overflow-hidden" role="main">
        {/* Main Content Column */}
        <div className="p-4 md:p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-black mb-1">{personalInfo.name}</h1>
            <p className="text-base text-black mb-2">Full-Stack Web Developer</p>
            <div className="space-y-1 text-sm text-gray-700">
              <p>{personalInfo.location}</p>
              <p>{personalInfo.phone}</p>
              <p>{personalInfo.email}</p>
              <p><a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">LinkedIn</a></p>
              <p><a href="https://minaragaie.github.io/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">Portfolio</a></p>
            </div>
          </header>

          <section className="mb-6" aria-labelledby="highlights-heading">
            <h2 id="highlights-heading" className="text-xl font-semibold text-black pb-1 mb-2 border-b-2 border-gray-300">Highlights of Qualifications</h2>
            <p className="text-sm text-gray-800 leading-relaxed">
              {highlightWords(highlights, ["Full-Stack front-end web development technologist", "security mindset"])}
            </p>
          </section>

          <section className="mb-6" aria-labelledby="experience-heading">
            <h2 id="experience-heading" className="text-xl font-semibold text-black pb-1 mb-2 border-b-2 border-gray-300">Professional Experience</h2>
            {experience.map((job: Experience) => (
              <div key={job.id} className="mb-4">
                <div className="flex justify-between items-start mb-0">
                  <div>
                    <h3 className="text-lg font-bold text-black">{job.title}</h3>
                    <p className="text-sm text-gray-700">{job.company}</p>
                  </div>
                  <p className="text-xs text-gray-600 text-right flex-shrink-0">{job.startDate} - {job.endDate}</p>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                  {job.achievements.map((achievement: string, achievementIndex: number) => (
                    <li key={achievementIndex}>{highlightWords(achievement, job.technologies)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="mb-6" aria-labelledby="skills-heading">
            <h2 id="skills-heading" className="text-xl font-semibold text-black pb-1 mb-2 border-b-2 border-gray-300">Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {/* Type assertion to tell TypeScript that the keys are valid */}
              {(Object.keys(skills) as (keyof Skills)[]).map((category, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-black mb-1">{category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}</h3>
                  <ul className="text-gray-800 space-y-1 list-none pl-0">
                    {/* Explicitly typing the skill and index parameters */}
                    {skills[category].map((skill: string, i: number) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-6" aria-labelledby="education-heading">
            <h2 id="education-heading" className="text-xl font-semibold text-black pb-1 mb-2 border-b-2 border-gray-300">Education</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {education.map((edu: Education, index: number) => (
                <div key={index}>
                  <h3 className="font-semibold text-black">{edu.degree}</h3>
                  <p className="text-gray-800">{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-6" aria-labelledby="certifications-heading">
            <h2 id="certifications-heading" className="text-xl font-semibold text-black pb-1 mb-2 border-b-2 border-gray-300">Certifications</h2>
            {certifications.map((cert: Certification, index: number) => (
              <div key={index} className="mb-4">
                <h3 className="text-lg font-bold text-black">{cert.name}</h3>
                <p className="text-sm text-gray-700 mb-1">{cert.issuer}</p>
                <p className="text-sm text-gray-800 leading-relaxed">{cert.description}</p>
                {cert.pathway && cert.pathway.length > 0 && (
                  <ul className="list-disc list-inside mt-2 text-sm text-gray-700">
                    {cert.pathway.map((course: Certification, courseIndex: number) => (
                      <li key={courseIndex} className="text-gray-800">
                        {course.name} ({course.issuer})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>

          {additionalInfo && (
            <section aria-labelledby="additional-info-heading">
              <h2 id="additional-info-heading" className="text-xl font-semibold text-black pb-1 mb-2 border-b-2 border-gray-300">Additional Information</h2>
              <p className="text-sm text-gray-800 leading-relaxed">{additionalInfo}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeDocTemplate;
