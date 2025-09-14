"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { FaGithub, FaLinkedin } from "react-icons/fa"

type Person = {
  name: string
  img: string
  desc: string
  github: string
  linkedin: string
}

export function AboutUs() {
  const contributors: Person[] = [
    {
      name: "Neeraj Pola",
      img: "/images/neeraj.jpg", // put the file in /public/images/
      desc: "I am Neeraj Kumara Pola, an AI engineer with experience in multilingual speech recognition, retrieval-augmented generation pipelines,\
      and real-time pose estimation systems. Skilled in fine-tuning large models (Wav2Vec2, LLMs) and deploying scalable ML solutions with PyTorch,\
      TensorFlow, LangChain, and cloud platforms. Passionate about building robust, production-ready AI systems that bridge research and real-world applications.",
      github: "https://github.com/neeraj-pola",
      linkedin: "https://www.linkedin.com/in/neeraj-pola-381670247/",
    },
    {
      name: "Somesh Rajendra Bhandarkar",
      img: "/images/somesh.JPG",
      desc: "I am Somesh Rajendra Bhandarkar, a Data Engineer and Machine Learning enthusiast with expertise in designing scalable data pipelines, \
      cloud-based ETL workflows, and big data processing. Skilled in Python, SQL, PySpark, and cloud platforms like AWS, GCP, and Databricks, \
      I specialize in building efficient, production-ready data systems. With additional experience in machine learning, deep learning, and \
      Retrieval-Augmented Generation (RAG), I am passionate about leveraging data engineering foundations to enable intelligent analytics and real-world \
      AI applications.",
      github: "https://github.com/SomeshBhandarkar",
      linkedin: "https://www.linkedin.com/in/someshrb7/",
    },
  ]

  return (
    <section className="relative min-h-screen px-6 py-20 bg-background">
      {/* subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/5 to-transparent opacity-10 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-14 bg-gradient-to-r from-primary via-accent to-foreground bg-clip-text text-transparent animate-fade-in-up">
          Meet the Team
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {contributors.map((p, i) => (
            <Card
              key={p.name}
              className={`relative group border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:bg-card/80 
              transition-all duration-500 rounded-2xl overflow-hidden animate-fade-in-up`}
              style={{ animationDelay: `${i * 200}ms` }} // staggered effect
            >
              <CardContent className="flex flex-col items-center text-center p-8">
                <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg ring-2 ring-primary/40 group-hover:ring-accent/60 
                transition-all duration-500 transform group-hover:scale-105">
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>

                <h3 className="mt-6 text-2xl font-semibold">{p.name}</h3>
                <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {p.desc}
                </p>

                <div className="flex gap-6 mt-6">
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.name} GitHub`}
                    className="text-muted-foreground hover:text-primary transition-transform transform hover:scale-110"
                  >
                    <FaGithub className="w-7 h-7" />
                  </a>
                  <a
                    href={p.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.name} LinkedIn`}
                    className="text-muted-foreground hover:text-accent transition-transform transform hover:scale-110"
                  >
                    <FaLinkedin className="w-7 h-7" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
