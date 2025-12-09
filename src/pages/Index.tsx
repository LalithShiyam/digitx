import { useEffect, useState } from 'react';
import NetworkGraph from '@/components/NetworkGraph';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => setIsLoaded(true), []);

  const focusAreas = [
    {
      num: '01',
      title: 'Autonomous Structuring of Clinical Data',
      desc: 'Make PDFs, dictated notes, images, and labs computable. Normalize names, keep provenance, and deliver structured data without endless prep.',
      example: 'Example: Radiology PDF → FHIR bundle with SNOMED/LOINC codes and time stamps preserved.',
    },
    {
      num: '02',
      title: 'Knowledge Graphs as a Common Substrate',
      desc: 'Link that data into a clinical graph that understands people, time, and relationships — not just isolated fields.',
      example: 'Example: patient → has_diagnosis → ICD/SNOMED node → linked to meds, labs, imaging, and time points with causal hints.',
    },
    {
      num: '03',
      title: 'Reasoning Interfaces for Clinicians',
      desc: 'Give clinicians ways to ask grounded questions, see the evidence path, and challenge the logic — safely and quickly.',
      example: 'Example: “Show tumor response over 6 months” → evidence-backed trend with cited sources.',
    },
    {
      num: '04',
      title: 'Scalable Infrastructure for Health Evidence',
      desc: 'Run analyses across thousands of datasets with audit trails, reproducibility, and guardrails built in.',
      example: 'Example: Cohort builder + reproducible pipelines with lineage, so results are portable across sites.',
    },
  ];

  const principles = [
    { title: 'Begin with Clinical Reality', desc: 'Health data is messy. We sit with clinicians and build for the workflows that already exist, not the ones we wish existed.' },
    { title: 'Structure Enables Intelligence', desc: 'Predictions without meaning are brittle. We encode semantics, time, and provenance so reasoning has firm ground.' },
    { title: 'LLMs Are Tools, Not Oracles', desc: 'We use language models where they help, and we always anchor them in verifiable knowledge graphs with clear evidence.' },
    { title: 'Reproducibility and Scale Matter', desc: 'Methods should generalize across institutions and populations. We test for that and build for that.' },
    { title: 'Quiet Ambition', desc: 'We take on foundational work with humility and patience. We measure progress by safer care and stronger science.' },
  ];

  return (
    <div className="relative min-h-screen noise-overlay">
      <NetworkGraph />
      <div className="fixed inset-0 gradient-warmth pointer-events-none" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-20 py-6 transition-all duration-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="w-10 hidden md:block" />
          <div className="hidden md:flex items-center gap-10">
            <a href="#vision" className="link-subtle text-[0.8125rem]">Vision</a>
            <a href="#focus" className="link-subtle text-[0.8125rem]">Focus</a>
            <a href="#approach" className="link-subtle text-[0.8125rem]">Approach</a>
            <a href="#people" className="link-subtle text-[0.8125rem]">People</a>
            <a href="#connect" className="link-subtle text-[0.8125rem]">Connect</a>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Trust rail removed for breathing room */}

      {/* Hero */}
      <section className="relative min-h-screen flex items-center px-6 md:px-12 lg:px-20 pt-28">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-6xl">
            <div className={`mb-8 ${isLoaded ? 'fade-in-up' : 'opacity-0'}`}>
              <span className="text-label">DIGITX · Lab for Digital Transformation in Healthcare</span>
            </div>
            <h1 className={`text-display text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.25rem] text-[hsl(var(--text-primary))] mb-10 ${isLoaded ? 'fade-in-up delay-1' : 'opacity-0'}`}>
              Shaping Health<br /><span className="text-[hsl(var(--accent))] italic">Intelligence</span>
            </h1>
            <p className={`text-lg md:text-xl text-[hsl(var(--text-secondary))] leading-[1.9] max-w-4xl mb-6 ${isLoaded ? 'fade-in-up delay-2' : 'opacity-0'}`}>
              At DIGITX, we envision a future where no clinician faces uncertainty because of fragmented data, and no researcher loses precious time struggling to harmonize information. We’re building a world where medical insights flow freely, letting clinicians and researchers focus on what matters most — transforming lives.
            </p>
            <p className={`text-lg md:text-xl text-[hsl(var(--text-secondary))] leading-[1.9] max-w-4xl mb-8 ${isLoaded ? 'fade-in-up delay-3' : 'opacity-0'}`}>
              DIGITX is an academic lab in Radiology at LMU Klinikum. We build the quiet, rigorous infrastructure that turns raw clinical signals into structured, connected evidence — so decisions can be explained, challenged, and trusted.
            </p>
            <div className={`flex flex-wrap gap-4 ${isLoaded ? 'fade-in-up delay-4' : 'opacity-0'}`}>
              <a href="#focus" className="btn-primary">Explore Our Work <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a>
              <a href="#connect" className="btn-secondary">Get in Touch</a>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
          <div className="scroll-indicator"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7" /></svg></div>
        </div>
      </section>

      {/* Vision */}
      <section id="vision" className="relative py-28 md:py-40 px-6 md:px-12 lg:px-20 bg-[hsl(var(--bg-secondary))] transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
            <div className="lg:col-span-4">
              <span className="text-label text-[hsl(var(--accent))] block mb-4">Our Vision</span>
              <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))]">From Raw Data to<br /><span className="font-serif text-[hsl(var(--accent))] italic">Computable Knowledge</span></h2>
            </div>
            <div className="lg:col-span-8 space-y-8">
              <div className="grid lg:grid-cols-2 gap-6 max-w-6xl w-full mx-auto">
                <div className="hero-side-card w-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-label">Why this matters</span>
                    <span className="pill-soft">Built for accountability</span>
                  </div>
                  <ul className="space-y-2 text-[hsl(var(--text-primary))]">
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Clinicians and patients should see how a conclusion was reached, not just a prediction.</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Data needs meaning, provenance, and context; tools must respect the people behind it.</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Every answer should be explainable and human-safe.</li>
                  </ul>
                </div>

                <div className="hero-side-card w-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-label">How we get there</span>
                    <span className="pill-soft">Reality first</span>
                  </div>
                  <ul className="space-y-2 text-[hsl(var(--text-primary))]">
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Start with clinical reality, not bigger models: what the data actually says and how it connects over time.</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Encode relationships and time in knowledge graphs with strict provenance and naming.</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Deliver explainable interfaces clinicians can challenge.</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm uppercase tracking-[0.12em] text-[hsl(var(--text-secondary))]">Structured, connected, explainable — so every answer is traceable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section id="problem" className="relative py-32 md:py-48 px-6 md:px-12 lg:px-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">
              <div className="grid lg:grid-cols-2 gap-6 max-w-6xl w-full mx-auto">
                <div className="hero-side-card w-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-label">Where it breaks</span>
                    <span className="pill-soft">Clinical reality</span>
                  </div>
                  <ul className="space-y-2 text-[hsl(var(--text-primary))]">
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Dictated reports, incompatible systems, and isolated modalities fragment the patient story.</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Data trapped in PDFs and silos stays non-computable; models inherit the confusion.</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Clinicians face overload while evidence sits scattered and unlinked.</li>
                  </ul>
                </div>

                <div className="hero-side-card w-full">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-label">Why it matters</span>
                    <span className="pill-soft">Human impact</span>
                  </div>
                  <ul className="space-y-2 text-[hsl(var(--text-primary))]">
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Patients wait while answers are buried in unstructured data.</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Researchers burn months cleaning instead of testing hypotheses.</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Decisions risk being made without traceable context.</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm uppercase tracking-[0.12em] text-[hsl(var(--text-secondary))]">Our central tenet: Structure first, insight follows.</p>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2 lg:text-right">
              <span className="text-label text-[hsl(var(--accent))] block mb-4">The Problem We Take Seriously</span>
              <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))]">Healthcare is Data Rich<br /><span className="font-serif text-[hsl(var(--accent))] italic">but Insight Poor</span></h2>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section id="focus" className="relative py-32 md:py-48 px-6 md:px-12 lg:px-20 bg-[hsl(var(--bg-secondary))] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 max-w-6xl mx-auto">
            <span className="text-label text-[hsl(var(--accent))] block mb-4">What We Work On</span>
            <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))] max-w-3xl">Foundations for<br /><span className="font-serif text-[hsl(var(--accent))] italic">Health Intelligence</span></h2>
            <p className="text-[hsl(var(--text-secondary))] mt-6 max-w-6xl leading-[1.9]">We focus on a few foundational challenges that must be solved before healthcare can benefit from trustworthy, scalable intelligence. Together, they form a platform where clinical data structures itself, links to what matters, and can be queried with evidence intact.</p>
          </div>

          <div className="flex flex-col gap-6 max-w-6xl mx-auto">
            {focusAreas.map((area) => (
              <div key={area.num} className="focus-card group">
                <h3 className="text-headline text-xl md:text-2xl text-[hsl(var(--text-primary))] mb-2 group-hover:text-[hsl(var(--accent))] transition-colors duration-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent))]" />
                  <span className="text-[hsl(var(--accent))]">{area.num}</span>
                  <span>{area.title}</span>
                </h3>
                <p className="text-[hsl(var(--text-secondary))] leading-relaxed mb-3">{area.desc}</p>
                {area.example && (
                  <div className="focus-card-example">{area.example}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section id="approach" className="relative py-32 md:py-48 px-6 md:px-12 lg:px-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-4">
              <span className="text-label text-[hsl(var(--accent))] block mb-4">How We Work</span>
              <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))]">
                <span className="font-serif italic text-[hsl(var(--text-primary))]">Honest Methods</span><br />
                <span className="font-serif italic text-[hsl(var(--accent))]">for a Complex Domain</span>
              </h2>
            </div>
            <div className="lg:col-span-8">
              <ul className="space-y-8">
                {principles.map((pr, i) => (
                  <li key={i} className="group flex gap-6 pb-8 border-b border-[hsl(var(--border))] last:border-0 list-hover">
                    <span className="flex-shrink-0 w-2 h-2 mt-3 rounded-full bg-[hsl(var(--accent))] group-hover:scale-150 transition-transform duration-300" />
                    <div>
                      <h3 className="text-headline text-xl text-[hsl(var(--text-primary))] mb-2 group-hover:text-[hsl(var(--accent))] transition-colors duration-300">{pr.title}</h3>
                      <p className="text-[hsl(var(--text-secondary))] leading-relaxed">{pr.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* People */}
      <section id="people" className="relative py-32 md:py-48 px-6 md:px-12 lg:px-20 bg-[hsl(var(--bg-secondary))] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-4">
              <span className="text-label text-[hsl(var(--accent))] block mb-4">People</span>
              <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))]">A Small,<br /><span className="font-serif text-[hsl(var(--accent))] italic">Interdisciplinary</span> Lab</h2>
            </div>
            <div className="lg:col-span-8 space-y-6">
              <p className="text-lg md:text-xl text-[hsl(var(--text-secondary))] leading-[1.8]">DIGITX is based at LMU Klinikum Munich and brings together clinicians, informaticians, engineers, and researchers who care about building upstream foundations that translate to bedside impact. We stay small on purpose so we can stay close to the work.</p>
              <p className="text-lg text-[hsl(var(--text-secondary))] leading-[1.8]">We value clarity over hype, rigor over shortcuts, and an academic culture that keeps patients and colleagues at the center of every decision.</p>
              <div className="pt-6 border-t border-[hsl(var(--border))]">
                <div className="focus-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-headline text-lg text-[hsl(var(--text-primary))]">Opportunities</h3>
                    <span className="pill-soft">Open</span>
                  </div>
                  <p className="text-[hsl(var(--text-secondary))] leading-relaxed mb-3">We welcome:</p>
                  <ul className="text-[hsl(var(--text-secondary))] leading-relaxed space-y-2">
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Students seeking research projects</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Clinicians with ideas or frustrations around data use</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Collaborators from medicine, computer science, and informatics</li>
                    <li className="flex items-start gap-3"><span className="bullet-dot" />Industry partners interested in building trustworthy health intelligence</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connect */}
      <section id="connect" className="relative py-32 md:py-48 px-6 md:px-12 lg:px-20 bg-[hsl(var(--bg-tertiary))] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-label block mb-6">Connect</span>
            <h2 className="text-display text-3xl md:text-4xl lg:text-5xl text-[hsl(var(--text-primary))] mb-6 leading-tight">Let's Build<br /><span className="font-serif text-[hsl(var(--accent))] italic">Computable Healthcare</span></h2>
            <p className="text-lg text-[hsl(var(--text-secondary))] leading-[1.8] mb-10 max-w-lg mx-auto">If our work resonates with you — whether you're caring for patients, stewarding data, or building methods — tell us what keeps you up at night. We'll listen first.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://www.linkedin.com/company/digitx-lmu" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Follow on LinkedIn <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
              <a href="mailto:lalith.shiyam@med.uni-muenchen.de" className="btn-secondary">Get in Touch</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 md:py-16 px-6 md:px-12 lg:px-20 bg-[hsl(var(--footer-bg))] transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-[hsl(var(--footer-text))] font-semibold tracking-tight">DIGITX</div>
            <div className="text-sm text-[hsl(var(--footer-text))]/60">LMU Klinikum Munich · Department of Radiology</div>
            <div className="text-sm text-[hsl(var(--footer-text))]/40">© {new Date().getFullYear()} DIGITX Lab</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
