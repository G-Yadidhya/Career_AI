import { GeneratedResumeData, TargetRoleType } from '../types';

export const ROLE_RESUME_TEMPLATES: Record<TargetRoleType, GeneratedResumeData> = {
  'Software Engineer': {
    contactInfo: {
      fullName: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '+1 (555) 019-2831',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alexjohnson-dev',
      github: 'github.com/alexjohnson',
      portfolio: 'alexjohnson.dev'
    },
    executiveSummary: 'Versatile Software Engineer with 4+ years of experience designing high-throughput web applications, REST/GraphQL microservices, and reactive frontend architecture. Proficient in React, TypeScript, Node.js, and PostgreSQL. Demonstrated success reducing API latency by 42% and leading cross-functional delivery teams.',
    technicalSkills: [
      {
        category: 'Programming Languages',
        skills: ['TypeScript', 'JavaScript (ES6+)', 'Python', 'Go', 'SQL', 'HTML5/CSS3']
      },
      {
        category: 'Frontend Frameworks',
        skills: ['React 19', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'Web Vitals']
      },
      {
        category: 'Backend & Cloud',
        skills: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'AWS (S3, Lambda)', 'REST APIs', 'GraphQL']
      },
      {
        category: 'Tools & DevOps',
        skills: ['Git', 'GitHub Actions', 'Jest', 'Playwright', 'Webpack', 'CI/CD Pipelines']
      }
    ],
    professionalExperience: [
      {
        title: 'Senior Software Engineer',
        company: 'CloudScale Technologies',
        location: 'San Francisco, CA',
        dates: '2023 - Present',
        bulletPoints: [
          'Architected and deployed a multi-tenant React 19 single-page application serving 250,000+ active monthly users with 99.98% uptime.',
          'Optimized PostgreSQL query execution plans and connection pooling in Express middleware, reducing P99 API response times from 340ms to 85ms.',
          'Spearheaded transition from legacy monolithic service to containerized Docker microservices on AWS, accelerating deployment velocity by 3x.',
          'Mentored 4 junior engineers in TypeScript best practices, automated integration testing, and clean code architecture.'
        ]
      },
      {
        title: 'Software Engineer',
        company: 'Nexus Software Solutions',
        location: 'Austin, TX',
        dates: '2021 - 2023',
        bulletPoints: [
          'Engineered real-time collaboration canvas features using WebSockets and optimistic state hydration, increasing daily active session duration by 28%.',
          'Integrated OAuth2 authentication and RBAC permissions across 12 micro-frontends with zero security vulnerabilities.',
          'Authored unit and end-to-end test suites with Jest and Playwright, elevating code coverage from 62% to 88%.'
        ]
      }
    ],
    projects: [
      {
        title: 'AI-Powered Career Coach & ATS Analyzer',
        techStack: ['React 19', 'TypeScript', 'Node.js', 'Express', 'Gemini API', 'Tailwind CSS'],
        link: 'github.com/alexjohnson/ai-career-coach',
        bulletPoints: [
          'Built a full-stack platform providing real-time resume parsing, ATS gap analysis, and STAR interview evaluation.',
          'Implemented RAG vector index retrieval to ground feedback against official O*NET 2026 industry taxonomies.'
        ]
      },
      {
        title: 'High-Concurrency Event Notification Gateway',
        techStack: ['Go', 'Redis', 'WebSockets', 'Docker', 'PostgreSQL'],
        link: 'github.com/alexjohnson/event-gateway',
        bulletPoints: [
          'Designed a distributed WebSocket gateway capable of handling 50,000 concurrent client connections with under 15ms message dispatch latency.'
        ]
      }
    ],
    education: [
      {
        degree: 'B.S. in Computer Science',
        institution: 'University of California, Berkeley',
        year: '2021',
        gpa: '3.8 / 4.0'
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        year: '2024'
      }
    ]
  },

  'ML Engineer': {
    contactInfo: {
      fullName: 'Dr. Elena Rostova',
      email: 'elena.rostova@example.com',
      phone: '+1 (555) 018-9942',
      location: 'Seattle, WA',
      linkedin: 'linkedin.com/in/elena-rostova-ml',
      github: 'github.com/elena-ml',
      portfolio: 'elenarostova.ai'
    },
    executiveSummary: 'Machine Learning Engineer with 5+ years of experience training, fine-tuning, and deploying large language models (LLMs), RAG pipelines, and computer vision systems at scale. Expertise in PyTorch, CUDA, HuggingFace, Vector DBs (Milvus, Pinecone), and MLOps. Proven record of deploying low-latency LLM inference services processing 10M+ daily tokens.',
    technicalSkills: [
      {
        category: 'Machine Learning & Deep Learning',
        skills: ['PyTorch', 'TensorFlow', 'HuggingFace Transformers', 'CUDA', 'Scikit-learn', 'LLM Fine-tuning (LoRA, QLoRA)']
      },
      {
        category: 'Vector Search & GenAI Architecture',
        skills: ['RAG Systems', 'Pinecone', 'Milvus', 'ChromaDB', 'LangChain', 'LlamaIndex', 'Quantization (GGUF, AWQ)']
      },
      {
        category: 'MLOps & Infrastructure',
        skills: ['FastAPI', 'Ray Serve', 'Triton Inference Server', 'MLflow', 'Kubeflow', 'Docker', 'Kubernetes', 'AWS SageMaker']
      },
      {
        category: 'Languages & Big Data',
        skills: ['Python', 'C++', 'SQL', 'Apache Spark', 'NumPy', 'Pandas']
      }
    ],
    professionalExperience: [
      {
        title: 'Senior Machine Learning Engineer',
        company: 'Neural AI Research Labs',
        location: 'Seattle, WA',
        dates: '2023 - Present',
        bulletPoints: [
          'Engineered enterprise RAG inference pipeline using PyTorch, Milvus vector database, and AWQ 4-bit model quantization, reducing P95 inference latency by 64% while maintaining 96.2% retrieval precision.',
          'Fine-tuned open-weights LLMs (Llama-3, Qwen-2.5) on domain-specific corpora using QLoRA and DeepSpeed, outperforming generic baseline models by 31% on technical benchmarks.',
          'Built automated MLOps monitoring with MLflow and Prometheus to detect feature drift and model output hallucinations in real time.'
        ]
      },
      {
        title: 'Machine Learning Engineer',
        company: 'Visionary Data Corp',
        location: 'San Jose, CA',
        dates: '2020 - 2023',
        bulletPoints: [
          'Developed real-time object detection models for industrial quality control using YOLOv8 and TensorRT, achieving 45 FPS on edge device deployment.',
          'Reduced training pipeline iteration time by 50% by building parallelized distributed GPU dataloaders in PyTorch.'
        ]
      }
    ],
    projects: [
      {
        title: 'Autonomous Vector Retrieval RAG Engine',
        techStack: ['Python', 'PyTorch', 'FastAPI', 'Milvus', 'Docker', 'HuggingFace'],
        link: 'github.com/elena-ml/vector-rag-core',
        bulletPoints: [
          'Implemented hybrid dense-sparse vector search combining BGE-M3 embeddings with BM25 keyword matching for 98.4% top-5 retrieval accuracy.'
        ]
      }
    ],
    education: [
      {
        degree: 'M.S. in Computer Science (Artificial Intelligence Specialization)',
        institution: 'Stanford University',
        year: '2020',
        gpa: '3.9 / 4.0'
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Machine Learning – Specialty',
        issuer: 'Amazon Web Services',
        year: '2024'
      }
    ]
  },

  'Data Scientist': {
    contactInfo: {
      fullName: 'Marcus Vance',
      email: 'marcus.vance@example.com',
      phone: '+1 (555) 014-7731',
      location: 'New York, NY',
      linkedin: 'linkedin.com/in/marcusvance-ds',
      github: 'github.com/marcusvance-data',
      portfolio: 'marcusvance.io'
    },
    executiveSummary: 'Data Scientist with 4+ years of experience delivering predictive models, causal inference, A/B experiment design, and executive analytics dashboards. Expert in Python, R, SQL, XGBoost, and Snowflake. Successfully drove a $4.2M revenue increase by designing personalized customer retention algorithms for enterprise e-commerce platforms.',
    technicalSkills: [
      {
        category: 'Data Modeling & Analytics',
        skills: ['Predictive Modeling', 'Time Series Forecasting', 'A/B Testing', 'Hypothesis Testing', 'Causal Inference', 'Regression/Classification']
      },
      {
        category: 'Languages & Libraries',
        skills: ['Python', 'R', 'SQL (PostgreSQL, Snowflake)', 'Pandas', 'NumPy', 'SciPy', 'Statsmodels', 'Scikit-learn', 'XGBoost']
      },
      {
        category: 'Data Engineering & Cloud',
        skills: ['Apache Spark', 'Snowflake', 'BigQuery', 'dbt', 'Airflow', 'AWS S3']
      },
      {
        category: 'Visualization & Reporting',
        skills: ['Tableau', 'Power BI', 'Plotly/Dash', 'Matplotlib', 'Seaborn']
      }
    ],
    professionalExperience: [
      {
        title: 'Lead Data Scientist',
        company: 'FinTech Analytics Group',
        location: 'New York, NY',
        dates: '2022 - Present',
        bulletPoints: [
          'Built gradient-boosted credit risk and churn prediction models in Python/XGBoost, boosting AUC-ROC from 0.74 to 0.89 across 2M+ customer profiles.',
          'Designed and analyzed over 45 statistical A/B experiments using Bayesian inference, driving an 18.5% increase in checkout conversion rates.',
          'Automated daily ETL data transformation pipelines using dbt and Apache Airflow on Snowflake, reducing dashboard refresh latency from 6 hours to 12 minutes.'
        ]
      },
      {
        title: 'Data Scientist',
        company: 'E-Commerce Global',
        location: 'Boston, MA',
        dates: '2020 - 2022',
        bulletPoints: [
          'Developed dynamic demand forecasting models using Prophet and SARIMA, cutting inventory overstock holding costs by $1.8M annually.',
          'Created interactive Tableau executive dashboards tracking lifetime value (LTV), customer acquisition cost (CAC), and cohort retention.'
        ]
      }
    ],
    projects: [
      {
        title: 'Real-Time Fraud Detection Engine',
        techStack: ['Python', 'PySpark', 'Scikit-learn', 'Snowflake', 'Streamlit'],
        link: 'github.com/marcusvance-data/fraud-detection-engine',
        bulletPoints: [
          'Trained anomaly detection pipeline flagging fraudulent credit card transactions with 99.1% recall and under 50ms evaluation time.'
        ]
      }
    ],
    education: [
      {
        degree: 'B.S. in Statistics & Data Science',
        institution: 'Columbia University',
        year: '2020',
        gpa: '3.85 / 4.0'
      }
    ],
    certifications: [
      {
        name: 'Google Cloud Certified Professional Data Engineer',
        issuer: 'Google Cloud',
        year: '2023'
      }
    ]
  },

  'Backend': {
    contactInfo: {
      fullName: 'David K. Chen',
      email: 'david.chen@example.com',
      phone: '+1 (555) 012-3390',
      location: 'Chicago, IL',
      linkedin: 'linkedin.com/in/davidchen-backend',
      github: 'github.com/dchen-backend'
    },
    executiveSummary: 'Senior Backend Engineer with 5+ years specializing in distributed systems, high-concurrency microservices, gRPC/REST API gateways, and cloud database optimization. Proficient in Go, Node.js, PostgreSQL, Redis, and Kafka. Experienced in scaling backend infrastructure to support 100,000+ requests per second with zero downtime.',
    technicalSkills: [
      {
        category: 'Backend Languages',
        skills: ['Go (Golang)', 'Node.js', 'TypeScript', 'Python', 'SQL', 'C++']
      },
      {
        category: 'Architecture & Protocols',
        skills: ['Microservices', 'RESTful APIs', 'gRPC', 'GraphQL', 'WebSockets', 'Event-Driven Systems', 'Rate Limiting']
      },
      {
        category: 'Databases & Message Queues',
        skills: ['PostgreSQL', 'Redis', 'Apache Kafka', 'MongoDB', 'Cassandra', 'Database Sharding', 'Connection Pooling']
      },
      {
        category: 'Cloud & Infrastructure',
        skills: ['Docker', 'Kubernetes', 'AWS (EC2, RDS, ElastiCache)', 'Terraform', 'CI/CD Pipelines']
      }
    ],
    professionalExperience: [
      {
        title: 'Senior Backend Engineer',
        company: 'PayStream Systems',
        location: 'Chicago, IL',
        dates: '2022 - Present',
        bulletPoints: [
          'Engineered event-driven payment processing microservices in Go and Kafka, handling $40M+ daily transaction volume with 99.999% system reliability.',
          'Implemented multi-region Redis caching cluster with write-through policy, reducing PostgreSQL database read load by 74% during peak traffic spikes.',
          'Designed rate-limiting and token-bucket throttling middleware in Express/Node.js, mitigating malicious DDoS attacks with zero impact to legitimate traffic.'
        ]
      },
      {
        title: 'Backend Software Engineer',
        company: 'DataScale Systems',
        location: 'Chicago, IL',
        dates: '2019 - 2022',
        bulletPoints: [
          'Refactored legacy Monolith into 8 gRPC microservices in Go, cutting server infrastructure operational costs by 35%.',
          'Automated database migrations and schema checks in CI/CD pipeline using Golang-migrate and GitHub Actions.'
        ]
      }
    ],
    projects: [
      {
        title: 'Distributed Log Aggregator & Alerting Engine',
        techStack: ['Go', 'Kafka', 'Elasticsearch', 'Prometheus', 'Docker'],
        link: 'github.com/dchen-backend/dist-log-aggregator',
        bulletPoints: [
          'Built high-speed log ingestion engine capable of parsing 200MB/sec stdout streams with sub-second alert trigger latency.'
        ]
      }
    ],
    education: [
      {
        degree: 'B.S. in Computer Engineering',
        institution: 'University of Illinois Urbana-Champaign',
        year: '2019',
        gpa: '3.78 / 4.0'
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Developer – Associate',
        issuer: 'Amazon Web Services',
        year: '2023'
      }
    ]
  },

  'Frontend': {
    contactInfo: {
      fullName: 'Maya Lin',
      email: 'maya.lin@example.com',
      phone: '+1 (555) 016-5521',
      location: 'Austin, TX',
      linkedin: 'linkedin.com/in/mayalin-frontend',
      github: 'github.com/mayalin-ui',
      portfolio: 'mayalin.design'
    },
    executiveSummary: 'Senior Frontend Engineer with 5+ years of experience engineering pixel-perfect, accessible (WCAG 2.1 AA), and performant web interfaces using React 19, Next.js, TypeScript, and Tailwind CSS. Recognized for boosting Core Web Vitals (LCP < 1.2s, CLS < 0.02) and building enterprise component design systems used across 20+ product teams.',
    technicalSkills: [
      {
        category: 'Frontend Core',
        skills: ['React 19', 'Next.js', 'TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Tailwind CSS', 'CSS Modules']
      },
      {
        category: 'State & Data Fetching',
        skills: ['Zustand', 'Redux Toolkit', 'React Query (TanStack Query)', 'GraphQL (Apollo)', 'WebSockets', 'RxJS']
      },
      {
        category: 'Design Systems & Motion',
        skills: ['Framer Motion', 'Radix UI', 'Shadcn/UI', 'Storybook', 'Figma to Code', 'Responsive Web Design']
      },
      {
        category: 'Testing & Web Performance',
        skills: ['Jest', 'React Testing Library', 'Playwright', 'Lighthouse', 'Core Web Vitals Optimization', 'WCAG 2.1 Accessibility']
      }
    ],
    professionalExperience: [
      {
        title: 'Senior Frontend Engineer',
        company: 'Veloce Web Studio',
        location: 'Austin, TX',
        dates: '2022 - Present',
        bulletPoints: [
          'Led frontend architecture overhaul for enterprise SaaS dashboard using React 19, Next.js App Router, and Tailwind CSS, improving Lighthouse Performance score from 58 to 98.',
          'Created comprehensive accessible UI component library documented in Storybook, cutting frontend bug ticket count by 40% across 5 development squads.',
          'Implemented client-side virtualized rendering (TanStack Virtual) for 50,000-row data tables, eliminating UI scroll lag and achieving 60 FPS interactions.'
        ]
      },
      {
        title: 'Frontend Developer',
        company: 'Interactive Media Tech',
        location: 'Denver, CO',
        dates: '2020 - 2022',
        bulletPoints: [
          'Built responsive e-commerce storefront with server-side rendering (SSR), accelerating first contentful paint (FCP) by 1.4 seconds.',
          'Ensured 100% WCAG 2.1 AA screen reader compliance across all customer-facing checkout modals and forms.'
        ]
      }
    ],
    projects: [
      {
        title: 'Collaborative Real-Time Design Canvas',
        techStack: ['React 19', 'TypeScript', 'HTML5 Canvas', 'WebSockets', 'Tailwind CSS'],
        link: 'github.com/mayalin-ui/collaborative-canvas',
        bulletPoints: [
          'Engineered vector drawing tool with multi-user real-time cursor sync and undo/redo state stack.'
        ]
      }
    ],
    education: [
      {
        degree: 'B.S. in Software Engineering',
        institution: 'University of Texas at Austin',
        year: '2020',
        gpa: '3.82 / 4.0'
      }
    ],
    certifications: [
      {
        name: 'Meta Front-End Developer Professional Certificate',
        issuer: 'Meta',
        year: '2023'
      }
    ]
  },

  'DevOps': {
    contactInfo: {
      fullName: 'Siddharth Patel',
      email: 'siddharth.patel@example.com',
      phone: '+1 (555) 013-8812',
      location: 'Denver, CO',
      linkedin: 'linkedin.com/in/siddharth-devops',
      github: 'github.com/spatel-infra'
    },
    executiveSummary: 'DevOps & Site Reliability Engineer with 5+ years of experience automating cloud infrastructure, managing production Kubernetes (EKS/GKE) clusters, and building robust CI/CD pipelines with Terraform, Docker, GitHub Actions, and Prometheus. Proven success achieving 99.99% multi-region uptime and reducing deployment build times by 70%.',
    technicalSkills: [
      {
        category: 'Containerization & Orchestration',
        skills: ['Kubernetes (EKS, GKE, K3s)', 'Docker', 'Helm', 'ArgoCD', 'Service Mesh (Istio)']
      },
      {
        category: 'Infrastructure as Code (IaC)',
        skills: ['Terraform', 'Ansible', 'AWS CloudFormation', 'Pulumi', 'Bash Shell Scripting']
      },
      {
        category: 'CI/CD & Automation',
        skills: ['GitHub Actions', 'Jenkins', 'GitLab CI', 'CircleCI', 'Semantic Versioning', 'Zero-Downtime Deployments']
      },
      {
        category: 'Cloud, Monitoring & Security',
        skills: ['AWS (VPC, EC2, IAM, S3, EKS)', 'Google Cloud (GCP)', 'Prometheus', 'Grafana', 'Datadog', 'HashiCorp Vault', 'SOC2 Compliance']
      }
    ],
    professionalExperience: [
      {
        title: 'Senior DevOps / SRE Engineer',
        company: 'CloudScale Infrastructure Solutions',
        location: 'Denver, CO',
        dates: '2022 - Present',
        bulletPoints: [
          'Managed 3 multi-region AWS EKS Kubernetes clusters running 400+ microservice pods with zero unplanned downtime over 18 consecutive months.',
          'Architected GitOps continuous delivery workflows using ArgoCD and GitHub Actions, cutting release deployment cycle time from 45 minutes to 6 minutes.',
          'Standardized all cloud infrastructure into modular reusable Terraform scripts, automating environment provisioning for dev, staging, and production.'
        ]
      },
      {
        title: 'DevOps Engineer',
        company: 'DataNode Networks',
        location: 'Salt Lake City, UT',
        dates: '2019 - 2022',
        bulletPoints: [
          'Configured centralized logging and observability stack using Prometheus, Grafana, and Loki, reducing mean time to detection (MTTD) by 55%.',
          'Hardened IAM role policies, secret rotation via HashiCorp Vault, and container vulnerability scanning (Trivy), achieving SOC2 Type II compliance.'
        ]
      }
    ],
    projects: [
      {
        title: 'Automated Multi-Region Disaster Recovery Controller',
        techStack: ['Terraform', 'Kubernetes', 'AWS Route53', 'Python', 'Prometheus'],
        link: 'github.com/spatel-infra/k8s-dr-failover',
        bulletPoints: [
          'Developed automated DNS failover controller triggering cross-region traffic rerouting within 12 seconds of primary region outage.'
        ]
      }
    ],
    education: [
      {
        degree: 'B.S. in Computer Science & Cloud Networking',
        institution: 'University of Colorado Boulder',
        year: '2019',
        gpa: '3.75 / 4.0'
      }
    ],
    certifications: [
      {
        name: 'Certified Kubernetes Administrator (CKA)',
        issuer: 'Linux Foundation / CNCF',
        year: '2024'
      },
      {
        name: 'AWS Certified DevOps Engineer – Professional',
        issuer: 'Amazon Web Services',
        year: '2023'
      }
    ]
  },

  'Product Manager': {
    contactInfo: {
      fullName: 'Samantha Sterling',
      email: 'samantha.sterling@example.com',
      phone: '+1 (555) 017-4402',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/samanthasterling-pm',
      github: 'github.com/samanthasterling',
      portfolio: 'samanthasterling.com'
    },
    executiveSummary: 'Data-driven Product Manager with 5+ years of experience steering B2B SaaS products from 0-to-1 launch and scaling growth loops. Track record of growing ARR by $6.5M, crafting crisp PRDs, leading Agile/Scrum engineering squads, and conducting quantitative user research using Mixpanel, Amplitude, and SQL.',
    technicalSkills: [
      {
        category: 'Product Strategy & Lifecycle',
        skills: ['PRD Writing', '0-to-1 Product Launch', 'Roadmap Prioritization (RICE/MoSCoW)', 'User Story Mapping', 'GTM Strategy']
      },
      {
        category: 'Agile & Execution',
        skills: ['Scrum/Kanban', 'Jira', 'Confluence', 'Cross-Functional Team Leadership', 'Sprint Planning']
      },
      {
        category: 'Product Analytics & Research',
        skills: ['Mixpanel', 'Amplitude', 'Google Analytics 4', 'SQL', 'A/B Experimentation', 'Customer Interviews', 'Usability Testing']
      },
      {
        category: 'Technical & Design Literacy',
        skills: ['Figma', 'B2B SaaS', 'REST API Concepts', 'Wireframing', 'Unit Economics (LTV/CAC)']
      }
    ],
    professionalExperience: [
      {
        title: 'Senior Product Manager',
        company: 'Workflow AI Systems',
        location: 'San Francisco, CA',
        dates: '2022 - Present',
        bulletPoints: [
          'Spearheaded product strategy and roadmap for enterprise AI workflow builder, scaling monthly active organizations from 120 to 1,850+ ($4.8M net ARR).',
          'Defined product requirements (PRDs), wireframes, and acceptance criteria for 3 cross-functional engineering teams (18 developers, 2 designers).',
          'Conducted 60+ customer interviews and analyzed funnel dropoff in Mixpanel, designing a self-serve onboarding flow that increased trial-to-paid conversion by 34%.'
        ]
      },
      {
        title: 'Product Manager',
        company: 'SaaS Growth Platform',
        location: 'San Mateo, CA',
        dates: '2019 - 2022',
        bulletPoints: [
          'Launched automated customer notification product feature, driving $1.7M incremental revenue in first 6 months post-launch.',
          'Led weekly sprint grooming, backlog prioritization, and executive stakeholder syncs, achieving 94% on-time feature delivery rate.'
        ]
      }
    ],
    projects: [
      {
        title: 'Self-Serve Product Product-Led Growth (PLG) Overhaul',
        techStack: ['Mixpanel', 'Figma', 'A/B Testing', 'Jira', 'SQL'],
        bulletPoints: [
          'Redesigned freemium activation journey based on cohort data, boosting 30-day user retention rate by 22%.'
        ]
      }
    ],
    education: [
      {
        degree: 'B.S. in Business Administration & Information Systems',
        institution: 'University of California, Berkeley (Haas)',
        year: '2019',
        gpa: '3.86 / 4.0'
      }
    ],
    certifications: [
      {
        name: 'Certified Scrum Product Owner (CSPO)',
        issuer: 'Scrum Alliance',
        year: '2023'
      },
      {
        name: 'Pragmatic Institute Certified (PMC-III)',
        issuer: 'Pragmatic Institute',
        year: '2022'
      }
    ]
  }
};
