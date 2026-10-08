import React, { useState, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  Wand2,
  RefreshCw,
  TrendingUp,
  ExternalLink,
  Target,
  Video,
  Book,
  FileText,
  Calendar,
  Filter,
  Search,
  CheckSquare,
  Square,
  Copy,
  Check,
  Zap,
  BarChart2,
  AlertCircle,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { CareerRoadmap, ResumeAnalysis } from '../types';

interface CareerAdvisorViewProps {
  roadmap: CareerRoadmap | null;
  onUpdateRoadmap: (roadmap: CareerRoadmap) => void;
  initialResumeAnalysis?: ResumeAnalysis | null;
}

type TabType = 'weekly' | 'projects' | 'courses' | 'books' | 'videos' | 'certifications';

// High-fidelity default starter roadmap for immediate interactive exploration
const DEFAULT_SAMPLE_ROADMAP: CareerRoadmap = {
  id: 'starter-career-roadmap',
  targetRole: 'AI & Full Stack Engineer',
  currentSkills: ['TypeScript', 'React', 'Node.js', 'Express', 'HTML', 'CSS', 'PostgreSQL'],
  timelineWeeks: 8,
  difficultyLevel: 'Intermediate',
  resumeMatchScore: 84,
  personalizedSummary:
    'Calibrated 8-week strategic trajectory engineered to advance full-stack capabilities into production AI systems engineering, RAG architecture, vector search, and cloud microservice deployment.',
  existingStrengths: [
    'Modern React & Component Hierarchy',
    'TypeScript Static Typing & Generics',
    'RESTful Backend API Design',
    'Relational Database Modeling',
    'Client-Side State Management'
  ],
  skillGapsToBridge: [
    'Vector Databases (pgvector, Pinecone)',
    'RAG Pipeline Grounding & Chunking',
    'LLM Function Calling & Agents',
    'Containerization with Docker & Compose',
    'Distributed Observability & Tracing'
  ],
  weeklyRoadmap: [
    {
      weekNumber: 1,
      title: 'Full Stack Architecture & Advanced TypeScript Patterns',
      phaseName: 'Phase 1: Architecture & Typing Foundations',
      difficulty: 'Intermediate',
      estimatedHours: 12,
      weeklyObjectives: [
        'Master advanced TypeScript utility types (Record, Pick, Omit, Discriminated Unions)',
        'Implement resilient client-side state management with optimistic UI updates',
        'Refactor existing REST controllers with strict Zod runtime schema validation'
      ],
      focusTopics: ['TypeScript 5.x', 'Zod Schema Validation', 'React Query / SWR Caching', 'Tailwind Design Systems'],
      handsOnProject: {
        title: 'Type-Safe Microservice Dashboard',
        description: 'Build an analytics console with end-to-end type safety from database query to UI component rendering.',
        techStack: ['TypeScript', 'React', 'Zod', 'Tailwind CSS']
      }
    },
    {
      weekNumber: 2,
      title: 'Vector Databases, Embeddings & Semantic Indexing',
      phaseName: 'Phase 1: AI Integration & Knowledge Retrieval',
      difficulty: 'Intermediate',
      estimatedHours: 14,
      weeklyObjectives: [
        'Understand text embeddings (text-embedding-004) and cosine similarity mathematics',
        'Set up a vector database instance with pgvector / Qdrant / Pinecone',
        'Implement semantic chunking strategies for long technical documents'
      ],
      focusTopics: ['Text Embeddings', 'Cosine Similarity', 'Vector Indexing (HNSW, IVFFlat)', 'Tokenization'],
      handsOnProject: {
        title: 'Semantic Document Search Engine',
        description: 'Create an indexed search microservice that ingests technical PDFs and retrieves contextually relevant snippets with confidence scoring.',
        techStack: ['Python', 'pgvector', 'FastAPI', 'Gemini Embeddings']
      }
    },
    {
      weekNumber: 3,
      title: 'Retrieval Augmented Generation (RAG) Pipelines',
      phaseName: 'Phase 2: Production GenAI Engineering',
      difficulty: 'Advanced',
      estimatedHours: 16,
      weeklyObjectives: [
        'Build a multi-stage retrieval pipeline with contextual compression and re-ranking',
        'Engineer prompts with strict system instructions and dynamic Few-Shot examples',
        'Prevent hallucinations using grounded citations and confidence thresholds'
      ],
      focusTopics: ['Context Augmentation', 'Re-ranking Models', 'Prompt Defense', 'Faithfulness Evaluation'],
      handsOnProject: {
        title: 'Enterprise Technical Docs Q&A Assistant',
        description: 'Develop a verified Q&A bot that cites documentation URLs and rejects queries without grounding source evidence.',
        techStack: ['Node.js', 'TypeScript', 'LangChain', 'Gemini 2.5 Flash']
      }
    },
    {
      weekNumber: 4,
      title: 'Agentic Workflows, Tool Use & Structured JSON Outputs',
      phaseName: 'Phase 2: Autonomous AI Systems',
      difficulty: 'Advanced',
      estimatedHours: 15,
      weeklyObjectives: [
        'Implement Gemini structured outputs using strict JSON Schema declarations',
        'Build multi-step agent execution loops using tool calling / function calling',
        'Add human-in-the-loop confirmation gates for destructive actions'
      ],
      focusTopics: ['Tool Calling', 'Autonomous Agent Loops', 'Structured JSON Output', 'Human-in-the-Loop Safeguards'],
      handsOnProject: {
        title: 'Autonomous Code Review & Refactoring Agent',
        description: 'Build an automated pull-request reviewer that reads diffs, suggests performance fixes, and formats changelogs.',
        techStack: ['TypeScript', 'GitHub API', 'Docker', 'Gemini API']
      }
    },
    {
      weekNumber: 5,
      title: 'Containerization, Docker & Infrastructure as Code',
      phaseName: 'Phase 3: Production Deployment & Scale',
      difficulty: 'Intermediate',
      estimatedHours: 12,
      weeklyObjectives: [
        'Write multi-stage Dockerfiles optimizing image size under 120MB',
        'Configure docker-compose for multi-container local development with database volumes',
        'Deploy stateless containers to Cloud Run / AWS ECS with automated SSL'
      ],
      focusTopics: ['Multi-Stage Docker Builds', 'Docker Compose', 'Container Security', 'Cloud Run / ECS Deployment'],
      handsOnProject: {
        title: 'Containerized AI Microservice with Health Probes',
        description: 'Package a complete full-stack app into lean container images with readiness and liveness health endpoints.',
        techStack: ['Docker', 'Docker Compose', 'Node.js', 'Google Cloud Run']
      }
    },
    {
      weekNumber: 6,
      title: 'Distributed Caching, Rate Limiting & Performance',
      phaseName: 'Phase 3: High-Load Reliability',
      difficulty: 'Advanced',
      estimatedHours: 14,
      weeklyObjectives: [
        'Implement Redis semantic response caching for costly LLM generation queries',
        'Add token-bucket rate limiting to prevent API abuse and bill surges',
        'Profile database query execution plans and index slow foreign keys'
      ],
      focusTopics: ['Redis Semantic Caching', 'Token Bucket Rate Limiting', 'Database Query Optimization', 'Connection Pooling'],
      handsOnProject: {
        title: 'High-Throughput API Gateway with Redis Caching',
        description: 'Build an API proxy that intercepts queries, checks embedding cache hits in Redis, and enforces tiered rate limits.',
        techStack: ['Redis', 'TypeScript', 'Express', 'Prometheus']
      }
    },
    {
      weekNumber: 7,
      title: 'System Observability, Tracing & Production Hardening',
      phaseName: 'Phase 4: Industry Polish & Standards',
      difficulty: 'Advanced',
      estimatedHours: 15,
      weeklyObjectives: [
        'Instrument distributed tracing using OpenTelemetry or Langfuse',
        'Track token usage, cost-per-user metrics, and latency percentiles (p95, p99)',
        'Configure automated CI/CD GitHub Actions pipelines with lint, build, and test steps'
      ],
      focusTopics: ['Distributed Tracing', 'LLM Cost & Latency Observability', 'CI/CD Pipelines', 'Automated Integration Testing'],
      handsOnProject: {
        title: 'Full-Stack Telemetry & Cost Dashboard',
        description: 'Embed real-time telemetry tracing that reports token expenditure, error spikes, and average response latencies.',
        techStack: ['OpenTelemetry', 'Grafana', 'Next.js', 'TypeScript']
      }
    },
    {
      weekNumber: 8,
      title: 'Portfolio Showcase, Live Capstone & Technical Mock Interviews',
      phaseName: 'Phase 4: Career Launch & Interview Readiness',
      difficulty: 'Intermediate',
      estimatedHours: 16,
      weeklyObjectives: [
        'Deploy live production URL with custom domain, SSL, and open-source GitHub repository',
        'Record a concise 3-minute architectural walkthrough video for recruiters',
        'Practice system design mock interviews focusing on RAG scalability and latency trade-offs'
      ],
      focusTopics: ['System Design Whiteboarding', 'Architectural Storytelling', 'STAR Technique Delivery', 'Live Production Portfolio'],
      handsOnProject: {
        title: 'Production Capstone: AI Career Intelligence Platform',
        description: 'Publish and polish your complete flagship application with comprehensive README documentation and system diagrams.',
        techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS']
      }
    }
  ],
  recommendedProjects: [
    {
      title: 'Multi-Modal RAG Document Intelligence System',
      description: 'An enterprise knowledge engine capable of extracting tables, diagrams, and text from complex PDFs with grounded citations.',
      difficulty: 'Advanced',
      techStack: ['TypeScript', 'Gemini 2.5 Flash', 'pgvector', 'PostgreSQL', 'Tailwind CSS'],
      keyFeatures: [
        'Hybrid semantic and keyword search algorithm',
        'PDF bounding-box source citation highlighting',
        'Zero-latency streaming answer generation',
        'Export reports to PDF and Markdown'
      ],
      portfolioImpact: 'Top Tier (Demonstrates Production RAG Mastery)'
    },
    {
      title: 'Real-Time Voice-Enabled AI Interview Studio',
      description: 'Interactive browser interview cockpit featuring live speech-to-text, low-latency audio response, and STAR methodology scoring.',
      difficulty: 'Advanced',
      techStack: ['React', 'Web Audio API', 'Node.js', 'FastAPI', 'Gemini Live / TTS'],
      keyFeatures: [
        'Sub-second voice synthesis and playback',
        'Real-time filler word and cadence tracking',
        'Comprehensive STAR rubric feedback breakdown',
        'Dynamic behavioral and system design question banks'
      ],
      portfolioImpact: 'Very High (Showcases Audio/Streaming Engineering)'
    },
    {
      title: 'Autonomous Code Review & Refactor Agent',
      description: 'Developer productivity tool that inspects GitHub pull requests, detects security vulnerabilities, and proposes git patch commits.',
      difficulty: 'Intermediate',
      techStack: ['Node.js', 'GitHub Webhooks', 'Gemini API', 'Docker'],
      keyFeatures: [
        'Automated GitHub Webhook integration',
        'AST code parsing and security scanning',
        'Strict JSON diff suggestion generator',
        'One-click patch application directly via API'
      ],
      portfolioImpact: 'High (Proves Tool Integration & DevOps Expertise)'
    },
    {
      title: 'Semantic Cache & API Rate Limiting Gateway',
      description: 'High-performance reverse proxy that clusters queries semantically to reduce LLM compute overhead and prevent DDoS vulnerabilities.',
      difficulty: 'Intermediate',
      techStack: ['TypeScript', 'Express', 'Redis', 'Docker'],
      keyFeatures: [
        'Vector similarity cache hit detection',
        'Sliding-window rate limiting per IP and API key',
        'Prometheus metrics export for Grafana',
        'Detailed cost savings calculator dashboard'
      ],
      portfolioImpact: 'High (Validates Backend & Systems Thinking)'
    }
  ],
  courses: [
    {
      title: 'Deep Learning & LLM Application Engineering',
      provider: 'DeepLearning.AI / Coursera',
      difficulty: 'Intermediate',
      duration: '4 Weeks (Self-paced)'
    },
    {
      title: 'Full Stack TypeScript & Next.js Architecture',
      provider: 'Frontend Masters',
      difficulty: 'Intermediate',
      duration: '6 Weeks (Self-paced)'
    },
    {
      title: 'Vector Databases & Similarity Search at Scale',
      provider: 'Pinecone / Qdrant Academy',
      difficulty: 'Advanced',
      duration: '2 Weeks (Sprint)'
    },
    {
      title: 'Containerization, Docker & Kubernetes for Developers',
      provider: 'Linux Foundation / edX',
      difficulty: 'Intermediate',
      duration: '5 Weeks (Self-paced)'
    }
  ],
  books: [
    {
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      focusArea: 'Distributed Systems, Reliability & Scalability',
      difficulty: 'Advanced'
    },
    {
      title: 'Building Systems with the ChatGPT API and Gemini',
      author: 'Andrew Ng & Isa Fulford',
      focusArea: 'Prompt Engineering, RAG & Evaluation Frameworks',
      difficulty: 'Intermediate'
    },
    {
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      focusArea: 'Software Engineering Best Practices & Architecture',
      difficulty: 'Intermediate'
    },
    {
      title: 'System Design Interview – An Insider\'s Guide (Vols 1 & 2)',
      author: 'Alex Xu',
      focusArea: 'Large-Scale Web Architectures & Whiteboarding',
      difficulty: 'Advanced'
    }
  ],
  videos: [
    {
      title: 'State of GPT: How LLMs Actually Work & How to Build on Them',
      channelOrSpeaker: 'Andrej Karpathy (Microsoft Build)',
      platform: 'YouTube',
      topic: 'LLM Foundations, Fine-Tuning & Prompt Strategies'
    },
    {
      title: 'Building Production RAG Systems: Avoiding Common Pitfalls',
      channelOrSpeaker: 'Logan Kilpatrick & Jerry Liu (LlamaIndex)',
      platform: 'YouTube',
      topic: 'Chunking, Retrieval Evaluation & Production Scaling'
    },
    {
      title: 'System Design: How to Design a Vector Database from Scratch',
      channelOrSpeaker: 'ByteByteGo (Alex Xu)',
      platform: 'YouTube',
      topic: 'HNSW Indexing, Approximate Nearest Neighbors & Sharding'
    },
    {
      title: 'Advanced TypeScript Patterns Every Senior Dev Must Know',
      channelOrSpeaker: 'Matt Pocock (Total TypeScript)',
      platform: 'YouTube',
      topic: 'Generics, Inferred Return Types & Type Safety'
    }
  ],
  certifications: [
    {
      name: 'Google Cloud Professional Cloud Architect',
      issuer: 'Google Cloud',
      difficulty: 'Advanced',
      prepTimeWeeks: 6,
      careerImpact: 'Highly recognized industry credential for cloud architecture, security, and enterprise infrastructure design.'
    },
    {
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      difficulty: 'Intermediate',
      prepTimeWeeks: 4,
      careerImpact: 'Core credential validating scalable multi-tier architectures, caching, and database configuration.'
    },
    {
      name: 'Certified Kubernetes Application Developer (CKAD)',
      issuer: 'Cloud Native Computing Foundation (CNCF)',
      difficulty: 'Advanced',
      prepTimeWeeks: 6,
      careerImpact: 'Performance-based hands-on certification proving mastery in container orchestration and service mesh.'
    },
    {
      name: 'TensorFlow / Generative AI Developer Certificate',
      issuer: 'DeepLearning.AI / Google',
      difficulty: 'Intermediate',
      prepTimeWeeks: 4,
      careerImpact: 'Validates practical capability in neural networks, embeddings, and machine learning pipelines.'
    }
  ],
  careerPaths: [
    {
      title: 'Staff / Lead AI Solutions Architect',
      description: 'Direct high-impact technical initiatives bridging cutting-edge GenAI models with production enterprise systems and robust microservice APIs.',
      matchScore: 92,
      avgSalaryRange: '$165,000 - $225,000',
      growthDemand: '+38% YoY Market Demand'
    },
    {
      title: 'Senior Full Stack & AI Systems Engineer',
      description: 'Engineer responsive web experiences and low-latency backend pipelines connecting vector databases, embeddings, and multi-agent workflows.',
      matchScore: 89,
      avgSalaryRange: '$140,000 - $190,000',
      growthDemand: '+32% YoY Market Demand'
    },
    {
      title: 'Machine Learning Infrastructure & Platform Engineer',
      description: 'Scale distributed container clusters, model inference endpoints, telemetry pipelines, and semantic caching layers.',
      matchScore: 84,
      avgSalaryRange: '$150,000 - $205,000',
      growthDemand: '+41% YoY Market Demand'
    }
  ],
  generatedAt: new Date().toISOString()
};

export const CareerAdvisorView: React.FC<CareerAdvisorViewProps> = ({
  roadmap,
  onUpdateRoadmap,
  initialResumeAnalysis,
}) => {
  const [targetRole, setTargetRole] = useState(roadmap?.targetRole || 'AI & Full Stack Engineer');
  const [timelineWeeks, setTimelineWeeks] = useState<number>(roadmap?.timelineWeeks || 8);
  const [skillsInput, setSkillsInput] = useState(
    roadmap?.currentSkills ? roadmap.currentSkills.join(', ') : 'TypeScript, React, Node.js, Express, HTML, CSS, PostgreSQL'
  );
  const [resumeText, setResumeText] = useState(
    initialResumeAnalysis && initialResumeAnalysis.parsedResume?.skills
      ? `Experience: ${initialResumeAnalysis.parsedResume.skills.slice(0, 10).join(', ')}`
      : ''
  );
  const [showResumeInput, setShowResumeInput] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  // Default to provided roadmap or sample blueprint so interface is richly populated in light mode
  const [activeRoadmap, setActiveRoadmap] = useState<CareerRoadmap>(roadmap || DEFAULT_SAMPLE_ROADMAP);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states
  const [activeTab, setActiveTab] = useState<TabType>('weekly');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [completedWeeks, setCompletedWeeks] = useState<Record<number, boolean>>({ 1: true, 2: true });
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  const handleGenerate = async () => {
    if (!targetRole.trim()) {
      setError('Please specify a target role goal.');
      return;
    }
    setError(null);
    setIsGenerating(true);
    try {
      const skillsArray = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
      const generated = await api.generateCareerRoadmap(
        targetRole,
        skillsArray,
        timelineWeeks,
        resumeText
      );
      setActiveRoadmap(generated);
      onUpdateRoadmap(generated);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate career roadmap');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAutoFillResume = () => {
    if (initialResumeAnalysis) {
      const skills = initialResumeAnalysis.parsedResume?.skills || [];
      const tips = initialResumeAnalysis.resumeOptimizationTips || [];
      const parsedText = `Skills: ${skills.join(', ')}\nExperience Summary: ${tips.join(' ')}`;
      setResumeText(parsedText);
      setSkillsInput(skills.join(', '));
      setShowResumeInput(true);
    }
  };

  const toggleWeekCompletion = (weekNum: number) => {
    setCompletedWeeks((prev) => ({
      ...prev,
      [weekNum]: !prev[weekNum],
    }));
  };

  const completedCount = useMemo(() => {
    return Object.values(completedWeeks).filter(Boolean).length;
  }, [completedWeeks]);

  const totalWeeksCount = activeRoadmap?.weeklyRoadmap?.length || 0;
  const progressPercent = totalWeeksCount > 0 ? Math.round((completedCount / totalWeeksCount) * 100) : 0;

  // Filtered queries for each category
  const filteredWeekly = useMemo(() => {
    if (!activeRoadmap?.weeklyRoadmap) return [];
    return activeRoadmap.weeklyRoadmap.filter((week) => {
      const matchesDiff = difficultyFilter === 'All' || week.difficulty === difficultyFilter;
      const matchesSearch =
        !searchQuery ||
        week.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        week.phaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        week.focusTopics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDiff && matchesSearch;
    });
  }, [activeRoadmap, difficultyFilter, searchQuery]);

  const filteredProjects = useMemo(() => {
    if (!activeRoadmap?.recommendedProjects) return [];
    return activeRoadmap.recommendedProjects.filter((proj) => {
      const matchesDiff = difficultyFilter === 'All' || proj.difficulty === difficultyFilter;
      const matchesSearch =
        !searchQuery ||
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDiff && matchesSearch;
    });
  }, [activeRoadmap, difficultyFilter, searchQuery]);

  const filteredCourses = useMemo(() => {
    if (!activeRoadmap?.courses) return [];
    return activeRoadmap.courses.filter((course) => {
      const matchesDiff = difficultyFilter === 'All' || !course.difficulty || course.difficulty === difficultyFilter;
      const matchesSearch =
        !searchQuery ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.provider.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDiff && matchesSearch;
    });
  }, [activeRoadmap, difficultyFilter, searchQuery]);

  const filteredBooks = useMemo(() => {
    if (!activeRoadmap?.books) return [];
    return activeRoadmap.books.filter((book) => {
      const matchesDiff = difficultyFilter === 'All' || !book.difficulty || book.difficulty === difficultyFilter;
      const matchesSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.focusArea.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDiff && matchesSearch;
    });
  }, [activeRoadmap, difficultyFilter, searchQuery]);

  const filteredVideos = useMemo(() => {
    if (!activeRoadmap?.videos) return [];
    return activeRoadmap.videos.filter((video) => {
      const matchesSearch =
        !searchQuery ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.channelOrSpeaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [activeRoadmap, searchQuery]);

  const filteredCertifications = useMemo(() => {
    if (!activeRoadmap?.certifications) return [];
    return activeRoadmap.certifications.filter((cert) => {
      const matchesDiff = difficultyFilter === 'All' || cert.difficulty === difficultyFilter;
      const matchesSearch =
        !searchQuery ||
        cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDiff && matchesSearch;
    });
  }, [activeRoadmap, difficultyFilter, searchQuery]);

  const handleCopyMarkdown = () => {
    if (!activeRoadmap) return;
    let md = `# Career Roadmap: ${activeRoadmap.targetRole}\n`;
    md += `**Timeline:** ${activeRoadmap.timelineWeeks} Weeks | **Overall Level:** ${activeRoadmap.difficultyLevel}\n\n`;
    md += `## Personal Summary\n${activeRoadmap.personalizedSummary}\n\n`;

    md += `## Existing Strengths\n${(activeRoadmap.existingStrengths || []).map((s) => `- ${s}`).join('\n')}\n\n`;
    md += `## Skill Gaps to Bridge\n${(activeRoadmap.skillGapsToBridge || []).map((g) => `- ${g}`).join('\n')}\n\n`;

    md += `## Weekly Roadmap\n`;
    (activeRoadmap.weeklyRoadmap || []).forEach((w) => {
      md += `### ${w.title} (${w.difficulty} - ${w.estimatedHours} hrs)\n`;
      md += `*Phase:* ${w.phaseName}\n`;
      md += `*Objectives:*\n${w.weeklyObjectives.map((o) => `  - ${o}`).join('\n')}\n`;
      if (w.handsOnProject) {
        md += `*Project:* **${w.handsOnProject.title}** - ${w.handsOnProject.description}\n`;
      }
      md += `\n`;
    });

    md += `## High-Impact Projects\n`;
    (activeRoadmap.recommendedProjects || []).forEach((p) => {
      md += `- **${p.title}** [${p.difficulty}]: ${p.description} (Tech Stack: ${p.techStack.join(', ')})\n`;
    });

    md += `\n## Curated Courses\n`;
    (activeRoadmap.courses || []).forEach((c) => {
      md += `- **${c.title}** (${c.provider}) - ${c.duration || 'Self-paced'}\n`;
    });

    md += `\n## Recommended Books\n`;
    (activeRoadmap.books || []).forEach((b) => {
      md += `- **${b.title}** by ${b.author} (Focus: ${b.focusArea})\n`;
    });

    md += `\n## Videos & Talks\n`;
    (activeRoadmap.videos || []).forEach((v) => {
      md += `- **${v.title}** (${v.channelOrSpeaker} - ${v.platform})\n`;
    });

    md += `\n## Target Certifications\n`;
    (activeRoadmap.certifications || []).forEach((cert) => {
      md += `- **${cert.name}** (${cert.issuer}) [${cert.difficulty}]\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2500);
  };

  const presetRoles = [
    'AI & Full Stack Engineer',
    'Cloud Solutions Architect',
    'Machine Learning Engineer',
    'DevOps & Platform Engineer'
  ];

  return (
    <div className="space-y-6 animate-fade-in text-zinc-900 dark:text-zinc-100">
      
      {/* Module Banner */}
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-7 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs transition-colors">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2.5 border border-indigo-200/80 dark:border-indigo-800/60">
          <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Career Strategist & Personalized Learning Suite
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Personalized Career Roadmap & Growth Plan
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Synthesize your target role goal, timeline duration, and background to formulate weekly milestones, portfolio project challenges, curated courses, books, tech lectures, and certifications.
            </p>
          </div>
          {activeRoadmap && (
            <button
              onClick={handleCopyMarkdown}
              className="px-4 py-2.5 bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-semibold flex items-center gap-2 self-start shrink-0 transition-all shadow-2xs hover:border-zinc-300"
            >
              {copiedMarkdown ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-500" />}
              <span>{copiedMarkdown ? 'Roadmap Copied!' : 'Export Markdown'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Goal & Personalization Setup Form */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Define Target Role & Timeline Settings
          </h3>
          {initialResumeAnalysis && (
            <button
              type="button"
              onClick={handleAutoFillResume}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Auto-Fill Parsed Resume
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Target Role */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Target Role Goal</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. AI & Full Stack Engineer, Cloud Architect"
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-2xs"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {presetRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setTargetRole(role)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                    targetRole === role
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold'
                      : 'bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Weeks Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Timeline Duration
            </label>
            <select
              value={timelineWeeks}
              onChange={(e) => setTimelineWeeks(Number(e.target.value))}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-2xs"
            >
              <option value={4}>4 Weeks (Accelerated Sprint)</option>
              <option value={8}>8 Weeks (2 Months Recommended)</option>
              <option value={12}>12 Weeks (3 Months Intensive)</option>
              <option value={16}>16 Weeks (4 Months Comprehensive)</option>
              <option value={24}>24 Weeks (6 Months Deep Mastery)</option>
            </select>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1.5 block">
              Calculates weekly estimated hours & paced milestones.
            </span>
          </div>

          {/* Known Skills */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Current Known Stack</label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, TypeScript, Node.js, Python, SQL"
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono transition-all shadow-2xs"
            />
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1.5 block">
              Comma-separated skills to identify bridging gaps.
            </span>
          </div>
        </div>

        {/* Resume Optional Toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowResumeInput(!showResumeInput)}
            className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1 font-medium transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span>{showResumeInput ? 'Hide Resume Context' : '+ Add Candidate Resume Details for Custom Calibration'}</span>
          </button>

          {showResumeInput && (
            <div className="mt-2.5">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste candidate resume text, project descriptions, or experience summary..."
                rows={3}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl p-3 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono transition-all shadow-2xs"
              />
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs hover:shadow flex items-center justify-center gap-2 transition-all"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Synthesizing Tailored Roadmap & Curated Resources...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate Customized Roadmap ({timelineWeeks} Weeks)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Active Roadmap View */}
      {activeRoadmap && (
        <div className="space-y-6">

          {/* Resume Personalization & Skill Match Overview Card */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  Target Alignment: {activeRoadmap.resumeMatchScore || 84}% Match Score
                </span>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Strategic Plan: {activeRoadmap.targetRole}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mt-1 max-w-3xl leading-relaxed">
                  {activeRoadmap.personalizedSummary ||
                    `Strategic roadmap calibrated to transition your current capabilities into ${activeRoadmap.targetRole} expertise.`}
                </p>
              </div>

              {/* Completion Progress Gauge */}
              {totalWeeksCount > 0 && (
                <div className="bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-3 shrink-0 shadow-2xs">
                  <div className="relative w-12 h-12 flex items-center justify-center font-bold text-xs text-indigo-600 dark:text-indigo-400">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-zinc-200 dark:text-zinc-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-indigo-600 dark:text-indigo-400 transition-all duration-500"
                        strokeDasharray={`${progressPercent}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span>{progressPercent}%</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">Weekly Progress</span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {completedCount} / {totalWeeksCount} Weeks Completed
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Strengths vs Skill Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Strengths */}
              <div className="p-4 bg-emerald-50/50 dark:bg-zinc-950 rounded-xl border border-emerald-200/80 dark:border-zinc-800 space-y-2.5">
                <span className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Existing Strengths ({activeRoadmap.existingStrengths?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(activeRoadmap.existingStrengths || []).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-white text-emerald-800 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800/60 font-medium text-[11px] shadow-2xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skill Gaps to Bridge */}
              <div className="p-4 bg-amber-50/50 dark:bg-zinc-950 rounded-xl border border-amber-200/80 dark:border-zinc-800 space-y-2.5">
                <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5 text-xs">
                  <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Target Skill Gaps to Bridge ({activeRoadmap.skillGapsToBridge?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(activeRoadmap.skillGapsToBridge || []).map((g, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-white text-amber-800 border border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800/60 font-medium text-[11px] shadow-2xs"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs & Filter Bar */}
          <div className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              {/* Tab Selector */}
              <div className="flex flex-wrap gap-1 bg-zinc-100/80 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                <button
                  onClick={() => setActiveTab('weekly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'weekly'
                      ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-2xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Weekly Plan ({activeRoadmap.weeklyRoadmap?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'projects'
                      ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-2xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Projects ({activeRoadmap.recommendedProjects?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('courses')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'courses'
                      ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-2xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Courses ({activeRoadmap.courses?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('books')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'books'
                      ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-2xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Book className="w-3.5 h-3.5" />
                  <span>Books ({activeRoadmap.books?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('videos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'videos'
                      ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-2xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Lectures ({activeRoadmap.videos?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('certifications')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'certifications'
                      ? 'bg-white dark:bg-indigo-600 text-indigo-700 dark:text-white shadow-2xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Certs ({activeRoadmap.certifications?.length || 0})</span>
                </button>
              </div>

              {/* Difficulty & Search Filter Controls */}
              <div className="flex items-center gap-2">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter keywords..."
                    className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-600 w-36 sm:w-48 shadow-2xs"
                  />
                </div>

                {/* Difficulty Filter */}
                {activeTab !== 'videos' && (
                  <div className="flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 hidden sm:block" />
                    <select
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-600 shadow-2xs"
                    >
                      <option value="All">All Tiers</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* TAB CONTENT 1: WEEKLY ROADMAP */}
            {activeTab === 'weekly' && (
              <div className="space-y-3.5 pt-1">
                {filteredWeekly.length === 0 ? (
                  <div className="p-8 text-center text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                    No weekly milestones found matching the selected filter criteria.
                  </div>
                ) : (
                  filteredWeekly.map((week) => {
                    const isDone = !!completedWeeks[week.weekNumber];
                    return (
                      <div
                        key={week.weekNumber}
                        className={`p-4 sm:p-5 rounded-xl border transition-all ${
                          isDone
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/60'
                            : 'bg-white dark:bg-zinc-950 border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-zinc-700 shadow-2xs'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleWeekCompletion(week.weekNumber)}
                              className="text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shrink-0"
                              title={isDone ? 'Mark as pending' : 'Mark as completed'}
                            >
                              {isDone ? (
                                <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Square className="w-5 h-5 text-zinc-400 dark:text-zinc-600" />
                              )}
                            </button>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-0.5 rounded-full border border-indigo-200/80 dark:border-indigo-800/80">
                                  Week {week.weekNumber}
                                </span>
                                <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                  {week.title}
                                </h3>
                              </div>
                              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 block">
                                {week.phaseName}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950/80 dark:text-violet-300 dark:border-violet-800 font-semibold">
                              {week.difficulty}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-indigo-600 dark:text-indigo-400" /> ~{week.estimatedHours} Hours
                            </span>
                          </div>
                        </div>

                        {/* Objectives & Focus Topics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3.5">
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider block">
                              Weekly Core Objectives:
                            </span>
                            <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                              {week.weeklyObjectives.map((obj, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 bg-zinc-50/80 dark:bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-200/70 dark:border-zinc-800/60 shadow-2xs"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                                  <span className="leading-snug">{obj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider block">
                              Key Topics & Concepts:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {week.focusTopics.map((topic, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2.5 py-1 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-md border border-zinc-200/80 dark:border-zinc-800/80 font-mono shadow-2xs"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>

                            {/* Mini Project Spec */}
                            {week.handsOnProject && (
                              <div className="mt-2.5 p-3 bg-indigo-50/50 dark:bg-zinc-900/80 rounded-xl border border-indigo-200/80 dark:border-indigo-900/50 space-y-1 shadow-2xs">
                                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
                                  Mini-Project Challenge:
                                </span>
                                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                  {week.handsOnProject.title}
                                </h4>
                                <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                  {week.handsOnProject.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB CONTENT 2: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {filteredProjects.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                    No project blueprints found matching criteria.
                  </div>
                ) : (
                  filteredProjects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-3.5 flex flex-col justify-between shadow-xs hover:border-zinc-300 transition-all"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <span>{proj.title}</span>
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950/80 dark:text-violet-300 dark:border-violet-800 font-semibold shrink-0">
                            {proj.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          {proj.description}
                        </p>

                        {/* Tech Stack Badges */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.techStack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded font-mono border border-zinc-200/80 dark:border-zinc-800"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Key Features */}
                        {proj.keyFeatures && proj.keyFeatures.length > 0 && (
                          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
                            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                              Key Deliverables:
                            </span>
                            <ul className="space-y-1 text-[11px] text-zinc-700 dark:text-zinc-300">
                              {proj.keyFeatures.map((feat, fIdx) => (
                                <li key={fIdx} className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                        <span className="text-zinc-500 dark:text-zinc-400">Portfolio Value:</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">{proj.portfolioImpact || 'High Tier'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT 3: COURSES */}
            {activeTab === 'courses' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {filteredCourses.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                    No curated courses found matching criteria.
                  </div>
                ) : (
                  filteredCourses.map((course, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-3 flex flex-col justify-between shadow-xs hover:border-zinc-300 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <span>{course.title}</span>
                          </h4>
                          {course.difficulty && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950/80 dark:text-violet-300 dark:border-violet-800 shrink-0 font-semibold">
                              {course.difficulty}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          Provider: <strong className="text-zinc-900 dark:text-zinc-200">{course.provider}</strong>
                        </p>
                        {course.duration && (
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-mono">
                            Duration: {course.duration}
                          </span>
                        )}
                      </div>

                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(course.title + ' ' + course.provider)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 font-semibold transition-colors"
                      >
                        <span>Explore Course Details</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT 4: BOOKS */}
            {activeTab === 'books' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {filteredBooks.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                    No recommended books found matching criteria.
                  </div>
                ) : (
                  filteredBooks.map((book, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-3 flex flex-col justify-between shadow-xs hover:border-zinc-300 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                            <Book className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>{book.title}</span>
                          </h4>
                          {book.difficulty && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950/80 dark:text-violet-300 dark:border-violet-800 shrink-0 font-semibold">
                              {book.difficulty}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          Author: <strong className="text-zinc-900 dark:text-zinc-200">{book.author}</strong>
                        </p>
                        <p className="text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800">
                          Focus Area: {book.focusArea}
                        </p>
                      </div>

                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(book.title + ' ' + book.author + ' book')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 font-semibold transition-colors"
                      >
                        <span>Find Book Preview</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT 5: VIDEOS */}
            {activeTab === 'videos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {filteredVideos.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                    No video lectures found matching criteria.
                  </div>
                ) : (
                  filteredVideos.map((video, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-3 flex flex-col justify-between shadow-xs hover:border-zinc-300 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                            <Video className="w-4 h-4 text-red-500 shrink-0" />
                            <span>{video.title}</span>
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800 shrink-0 font-semibold">
                            {video.platform}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          Speaker / Channel: <strong className="text-zinc-900 dark:text-zinc-200">{video.channelOrSpeaker}</strong>
                        </p>
                        <p className="text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800">
                          Topic: {video.topic}
                        </p>
                      </div>

                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.title + ' ' + video.channelOrSpeaker)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1 font-semibold transition-colors"
                      >
                        <span>Watch on YouTube</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT 6: CERTIFICATIONS */}
            {activeTab === 'certifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {filteredCertifications.length === 0 ? (
                  <div className="col-span-2 p-8 text-center text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
                    No target certifications found matching criteria.
                  </div>
                ) : (
                  filteredCertifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-3 flex flex-col justify-between shadow-xs hover:border-zinc-300 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-violet-800 dark:text-violet-300 flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                            <span>{cert.name}</span>
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950/80 dark:text-violet-300 dark:border-violet-800 font-semibold shrink-0">
                            {cert.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          Issuing Body: <strong className="text-zinc-900 dark:text-zinc-200">{cert.issuer}</strong>
                        </p>
                        {cert.prepTimeWeeks && (
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-mono">
                            Estimated Prep: ~{cert.prepTimeWeeks} Weeks
                          </span>
                        )}
                        <p className="text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800">
                          {cert.careerImpact}
                        </p>
                      </div>

                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(cert.name + ' ' + cert.issuer)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 flex items-center gap-1 font-semibold transition-colors"
                      >
                        <span>Certification Details</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

          {/* High-Growth Alternative Paths */}
          {activeRoadmap.careerPaths && activeRoadmap.careerPaths.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> High-Growth Career Market Trends
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeRoadmap.careerPaths.map((path, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-zinc-50/70 dark:bg-zinc-950 rounded-xl border border-zinc-200/80 dark:border-zinc-800 space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400">{path.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-800 font-semibold shrink-0">
                        {path.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {path.description}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[11px] border-t border-zinc-200/80 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                      <span>Est. Comp: <strong className="text-zinc-900 dark:text-zinc-200">{path.avgSalaryRange}</strong></span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{path.growthDemand}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
