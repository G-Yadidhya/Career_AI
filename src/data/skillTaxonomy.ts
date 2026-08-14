// Comprehensive Skill Taxonomy, Normalization Dictionary, and Categorization Engine

export interface CategorizedSkillGroup {
  category: string;
  skills: string[];
}

// Canonical display names for known tech and tools
export const CANONICAL_SKILL_NAMES: Record<string, string> = {
  // Programming Languages
  'python': 'Python',
  'python3': 'Python',
  'javascript': 'JavaScript',
  'js': 'JavaScript',
  'typescript': 'TypeScript',
  'ts': 'TypeScript',
  'java': 'Java',
  'core java': 'Java',
  'advanced java': 'Java',
  'c++': 'C++',
  'cpp': 'C++',
  'c': 'C',
  'c#': 'C#',
  'csharp': 'C#',
  'c sharp': 'C#',
  'golang': 'Go',
  'go': 'Go',
  'rust': 'Rust',
  'ruby': 'Ruby',
  'php': 'PHP',
  'swift': 'Swift',
  'kotlin': 'Kotlin',
  'r': 'R',
  'scala': 'Scala',
  'dart': 'Dart',
  'sql': 'SQL',
  'pl/sql': 'PL/SQL',
  'plsql': 'PL/SQL',
  't-sql': 'T-SQL',
  'shell': 'Shell Scripting',
  'bash': 'Bash',
  'powershell': 'PowerShell',
  'html': 'HTML5',
  'html5': 'HTML5',
  'css': 'CSS3',
  'css3': 'CSS3',
  'sass': 'Sass / SCSS',
  'scss': 'Sass / SCSS',
  'solidity': 'Solidity',
  'matlab': 'MATLAB',
  'assembly': 'Assembly',
  'perl': 'Perl',

  // Frontend Frameworks & UI
  'react': 'React',
  'react.js': 'React',
  'reactjs': 'React',
  'react native': 'React Native',
  'next': 'Next.js',
  'next.js': 'Next.js',
  'nextjs': 'Next.js',
  'vue': 'Vue.js',
  'vue.js': 'Vue.js',
  'vuejs': 'Vue.js',
  'nuxt': 'Nuxt.js',
  'nuxt.js': 'Nuxt.js',
  'angular': 'Angular',
  'angularjs': 'Angular',
  'svelte': 'Svelte',
  'sveltekit': 'SvelteKit',
  'tailwind': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'bootstrap': 'Bootstrap',
  'material ui': 'Material UI',
  'material-ui': 'Material UI',
  'mui': 'Material UI',
  'chakra ui': 'Chakra UI',
  'shadcn': 'shadcn/ui',
  'shadcn/ui': 'shadcn/ui',
  'redux': 'Redux',
  'redux toolkit': 'Redux Toolkit',
  'zustand': 'Zustand',
  'mobx': 'MobX',
  'jquery': 'jQuery',
  'framer motion': 'Framer Motion',
  'three.js': 'Three.js',
  'threejs': 'Three.js',
  'd3': 'D3.js',
  'd3.js': 'D3.js',

  // Backend & Fullstack Frameworks
  'node': 'Node.js',
  'node.js': 'Node.js',
  'nodejs': 'Node.js',
  'express': 'Express.js',
  'express.js': 'Express.js',
  'expressjs': 'Express.js',
  'nestjs': 'NestJS',
  'nest.js': 'NestJS',
  'fastapi': 'FastAPI',
  'django': 'Django',
  'flask': 'Flask',
  'spring': 'Spring',
  'spring boot': 'Spring Boot',
  'springboot': 'Spring Boot',
  'ruby on rails': 'Ruby on Rails',
  'rails': 'Ruby on Rails',
  'asp.net': 'ASP.NET',
  'asp.net core': 'ASP.NET Core',
  '.net': '.NET',
  '.net core': '.NET Core',
  'laravel': 'Laravel',
  'graphql': 'GraphQL',
  'apollo': 'Apollo GraphQL',
  'rest': 'REST API',
  'rest api': 'REST API',
  'rest apis': 'REST APIs',
  'restful api': 'RESTful APIs',
  'restful apis': 'RESTful APIs',
  'grpc': 'gRPC',
  'websockets': 'WebSockets',
  'socket.io': 'Socket.io',
  'kafka': 'Apache Kafka',
  'apache kafka': 'Apache Kafka',
  'rabbitmq': 'RabbitMQ',
  'celery': 'Celery',
  'microservices': 'Microservices',

  // Databases & ORMs
  'postgresql': 'PostgreSQL',
  'postgres': 'PostgreSQL',
  'mysql': 'MySQL',
  'mongodb': 'MongoDB',
  'mongo': 'MongoDB',
  'redis': 'Redis',
  'sqlite': 'SQLite',
  'firebase': 'Firebase',
  'firestore': 'Firestore',
  'dynamodb': 'DynamoDB',
  'cassandra': 'Apache Cassandra',
  'elasticsearch': 'Elasticsearch',
  'supabase': 'Supabase',
  'oracle': 'Oracle DB',
  'oracle db': 'Oracle DB',
  'mariadb': 'MariaDB',
  'neo4j': 'Neo4j',
  'snowflake': 'Snowflake',
  'bigquery': 'Google BigQuery',
  'prisma': 'Prisma ORM',
  'drizzle': 'Drizzle ORM',
  'drizzle orm': 'Drizzle ORM',
  'typeorm': 'TypeORM',
  'sequelize': 'Sequelize',
  'hibernate': 'Hibernate',
  'sqlalchemy': 'SQLAlchemy',
  'mongoose': 'Mongoose',

  // Cloud & DevOps
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'aws lambda': 'AWS Lambda',
  'aws ec2': 'AWS EC2',
  'aws s3': 'AWS S3',
  'azure': 'Microsoft Azure',
  'microsoft azure': 'Microsoft Azure',
  'gcp': 'Google Cloud Platform (GCP)',
  'google cloud': 'Google Cloud Platform (GCP)',
  'google cloud platform': 'Google Cloud Platform (GCP)',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'k8s': 'Kubernetes',
  'terraform': 'Terraform',
  'ansible': 'Ansible',
  'jenkins': 'Jenkins',
  'ci/cd': 'CI/CD Pipelines',
  'cicd': 'CI/CD Pipelines',
  'github actions': 'GitHub Actions',
  'gitlab ci': 'GitLab CI',
  'circleci': 'CircleCI',
  'nginx': 'Nginx',
  'apache': 'Apache HTTP Server',
  'linux': 'Linux',
  'unix': 'Unix',
  'ubuntu': 'Ubuntu',
  'cloudflare': 'Cloudflare',
  'vercel': 'Vercel',
  'netlify': 'Netlify',
  'prometheus': 'Prometheus',
  'grafana': 'Grafana',

  // AI, ML & Data Science
  'pytorch': 'PyTorch',
  'tensorflow': 'TensorFlow',
  'keras': 'Keras',
  'scikit-learn': 'Scikit-Learn',
  'scikit learn': 'Scikit-Learn',
  'sklearn': 'Scikit-Learn',
  'pandas': 'Pandas',
  'numpy': 'NumPy',
  'scipy': 'SciPy',
  'matplotlib': 'Matplotlib',
  'seaborn': 'Seaborn',
  'opencv': 'OpenCV',
  'nlp': 'Natural Language Processing (NLP)',
  'natural language processing': 'Natural Language Processing (NLP)',
  'computer vision': 'Computer Vision',
  'cv': 'Computer Vision',
  'machine learning': 'Machine Learning',
  'ml': 'Machine Learning',
  'deep learning': 'Deep Learning',
  'dl': 'Deep Learning',
  'artificial intelligence': 'Artificial Intelligence (AI)',
  'ai': 'Artificial Intelligence (AI)',
  'generative ai': 'Generative AI',
  'genai': 'Generative AI',
  'llms': 'Large Language Models (LLMs)',
  'llm': 'Large Language Models (LLMs)',
  'large language models': 'Large Language Models (LLMs)',
  'langchain': 'LangChain',
  'llamaindex': 'LlamaIndex',
  'rag': 'Retrieval-Augmented Generation (RAG)',
  'huggingface': 'Hugging Face',
  'hugging face': 'Hugging Face',
  'transformers': 'Transformers',
  'spacy': 'spaCy',
  'nltk': 'NLTK',

  // Developer Tools & Testing
  'git': 'Git',
  'github': 'GitHub',
  'gitlab': 'GitLab',
  'bitbucket': 'Bitbucket',
  'postman': 'Postman',
  'swagger': 'Swagger / OpenAPI',
  'insomnia': 'Insomnia',
  'vs code': 'VS Code',
  'vscode': 'VS Code',
  'visual studio code': 'VS Code',
  'intellij': 'IntelliJ IDEA',
  'intellij idea': 'IntelliJ IDEA',
  'pycharm': 'PyCharm',
  'android studio': 'Android Studio',
  'xcode': 'Xcode',
  'jira': 'Jira',
  'trello': 'Trello',
  'confluence': 'Confluence',
  'figma': 'Figma',
  'npm': 'npm',
  'yarn': 'yarn',
  'pnpm': 'pnpm',
  'vite': 'Vite',
  'webpack': 'Webpack',
  'eslint': 'ESLint',
  'prettier': 'Prettier',
  'jest': 'Jest',
  'vitest': 'Vitest',
  'cypress': 'Cypress',
  'playwright': 'Playwright',
  'junit': 'JUnit',
  'pytest': 'PyTest',
  'selenium': 'Selenium',

  // Core CS Concepts & Architecture
  'data structures': 'Data Structures & Algorithms (DSA)',
  'data structures & algorithms': 'Data Structures & Algorithms (DSA)',
  'data structures and algorithms': 'Data Structures & Algorithms (DSA)',
  'dsa': 'Data Structures & Algorithms (DSA)',
  'algorithms': 'Algorithms',
  'oop': 'Object-Oriented Programming (OOP)',
  'oops': 'Object-Oriented Programming (OOP)',
  'object oriented programming': 'Object-Oriented Programming (OOP)',
  'object-oriented programming': 'Object-Oriented Programming (OOP)',
  'system design': 'System Design',
  'dbms': 'Database Management Systems (DBMS)',
  'database management systems': 'Database Management Systems (DBMS)',
  'os': 'Operating Systems',
  'operating systems': 'Operating Systems',
  'computer networks': 'Computer Networks',
  'distributed systems': 'Distributed Systems',
  'concurrency': 'Concurrency & Multithreading',
  'multithreading': 'Concurrency & Multithreading',
  'clean code': 'Clean Architecture & Design Patterns',
  'design patterns': 'Design Patterns',
  'agile': 'Agile Methodologies',
  'scrum': 'Scrum',
  'tdd': 'Test-Driven Development (TDD)',
  'test driven development': 'Test-Driven Development (TDD)',
  'cyber security': 'Cybersecurity',
  'cybersecurity': 'Cybersecurity',
  'cryptography': 'Cryptography',
  'blockchain': 'Blockchain',
};

// Map each canonical skill or keyword to a standard category
export const SKILL_TO_CATEGORY: Record<string, string> = {
  // Programming Languages
  'Python': 'Programming Languages',
  'JavaScript': 'Programming Languages',
  'TypeScript': 'Programming Languages',
  'Java': 'Programming Languages',
  'C++': 'Programming Languages',
  'C': 'Programming Languages',
  'C#': 'Programming Languages',
  'Go': 'Programming Languages',
  'Rust': 'Programming Languages',
  'Ruby': 'Programming Languages',
  'PHP': 'Programming Languages',
  'Swift': 'Programming Languages',
  'Kotlin': 'Programming Languages',
  'R': 'Programming Languages',
  'Scala': 'Programming Languages',
  'Dart': 'Programming Languages',
  'SQL': 'Programming Languages',
  'PL/SQL': 'Programming Languages',
  'T-SQL': 'Programming Languages',
  'Shell Scripting': 'Programming Languages',
  'Bash': 'Programming Languages',
  'PowerShell': 'Programming Languages',
  'HTML5': 'Programming Languages',
  'CSS3': 'Programming Languages',
  'Sass / SCSS': 'Programming Languages',
  'Solidity': 'Programming Languages',
  'MATLAB': 'Programming Languages',
  'Assembly': 'Programming Languages',
  'Perl': 'Programming Languages',

  // Frameworks & Libraries
  'React': 'Frameworks & Libraries',
  'React Native': 'Frameworks & Libraries',
  'Next.js': 'Frameworks & Libraries',
  'Vue.js': 'Frameworks & Libraries',
  'Nuxt.js': 'Frameworks & Libraries',
  'Angular': 'Frameworks & Libraries',
  'Svelte': 'Frameworks & Libraries',
  'SvelteKit': 'Frameworks & Libraries',
  'Tailwind CSS': 'Frameworks & Libraries',
  'Bootstrap': 'Frameworks & Libraries',
  'Material UI': 'Frameworks & Libraries',
  'Chakra UI': 'Frameworks & Libraries',
  'shadcn/ui': 'Frameworks & Libraries',
  'Redux': 'Frameworks & Libraries',
  'Redux Toolkit': 'Frameworks & Libraries',
  'Zustand': 'Frameworks & Libraries',
  'MobX': 'Frameworks & Libraries',
  'jQuery': 'Frameworks & Libraries',
  'Framer Motion': 'Frameworks & Libraries',
  'Three.js': 'Frameworks & Libraries',
  'D3.js': 'Frameworks & Libraries',
  'Node.js': 'Frameworks & Libraries',
  'Express.js': 'Frameworks & Libraries',
  'NestJS': 'Frameworks & Libraries',
  'FastAPI': 'Frameworks & Libraries',
  'Django': 'Frameworks & Libraries',
  'Flask': 'Frameworks & Libraries',
  'Spring': 'Frameworks & Libraries',
  'Spring Boot': 'Frameworks & Libraries',
  'Ruby on Rails': 'Frameworks & Libraries',
  'ASP.NET': 'Frameworks & Libraries',
  'ASP.NET Core': 'Frameworks & Libraries',
  '.NET': 'Frameworks & Libraries',
  '.NET Core': 'Frameworks & Libraries',
  'Laravel': 'Frameworks & Libraries',
  'GraphQL': 'Frameworks & Libraries',
  'Apollo GraphQL': 'Frameworks & Libraries',
  'REST API': 'Frameworks & Libraries',
  'REST APIs': 'Frameworks & Libraries',
  'RESTful APIs': 'Frameworks & Libraries',
  'gRPC': 'Frameworks & Libraries',
  'WebSockets': 'Frameworks & Libraries',
  'Socket.io': 'Frameworks & Libraries',
  'Apache Kafka': 'Frameworks & Libraries',
  'RabbitMQ': 'Frameworks & Libraries',
  'Celery': 'Frameworks & Libraries',
  'Microservices': 'Frameworks & Libraries',

  // Databases & Storage
  'PostgreSQL': 'Databases & Storage',
  'MySQL': 'Databases & Storage',
  'MongoDB': 'Databases & Storage',
  'Redis': 'Databases & Storage',
  'SQLite': 'Databases & Storage',
  'Firebase': 'Databases & Storage',
  'Firestore': 'Databases & Storage',
  'DynamoDB': 'Databases & Storage',
  'Apache Cassandra': 'Databases & Storage',
  'Elasticsearch': 'Databases & Storage',
  'Supabase': 'Databases & Storage',
  'Oracle DB': 'Databases & Storage',
  'MariaDB': 'Databases & Storage',
  'Neo4j': 'Databases & Storage',
  'Snowflake': 'Databases & Storage',
  'Google BigQuery': 'Databases & Storage',
  'Prisma ORM': 'Databases & Storage',
  'Drizzle ORM': 'Databases & Storage',
  'TypeORM': 'Databases & Storage',
  'Sequelize': 'Databases & Storage',
  'Hibernate': 'Databases & Storage',
  'SQLAlchemy': 'Databases & Storage',
  'Mongoose': 'Databases & Storage',

  // Cloud & DevOps
  'AWS': 'Cloud & DevOps',
  'AWS Lambda': 'Cloud & DevOps',
  'AWS EC2': 'Cloud & DevOps',
  'AWS S3': 'Cloud & DevOps',
  'Microsoft Azure': 'Cloud & DevOps',
  'Google Cloud Platform (GCP)': 'Cloud & DevOps',
  'Docker': 'Cloud & DevOps',
  'Kubernetes': 'Cloud & DevOps',
  'Terraform': 'Cloud & DevOps',
  'Ansible': 'Cloud & DevOps',
  'Jenkins': 'Cloud & DevOps',
  'CI/CD Pipelines': 'Cloud & DevOps',
  'GitHub Actions': 'Cloud & DevOps',
  'GitLab CI': 'Cloud & DevOps',
  'CircleCI': 'Cloud & DevOps',
  'Nginx': 'Cloud & DevOps',
  'Apache HTTP Server': 'Cloud & DevOps',
  'Linux': 'Cloud & DevOps',
  'Unix': 'Cloud & DevOps',
  'Ubuntu': 'Cloud & DevOps',
  'Cloudflare': 'Cloud & DevOps',
  'Vercel': 'Cloud & DevOps',
  'Netlify': 'Cloud & DevOps',
  'Prometheus': 'Cloud & DevOps',
  'Grafana': 'Cloud & DevOps',

  // AI & Data Science
  'PyTorch': 'AI & Data Science',
  'TensorFlow': 'AI & Data Science',
  'Keras': 'AI & Data Science',
  'Scikit-Learn': 'AI & Data Science',
  'Pandas': 'AI & Data Science',
  'NumPy': 'AI & Data Science',
  'SciPy': 'AI & Data Science',
  'Matplotlib': 'AI & Data Science',
  'Seaborn': 'AI & Data Science',
  'OpenCV': 'AI & Data Science',
  'Natural Language Processing (NLP)': 'AI & Data Science',
  'Computer Vision': 'AI & Data Science',
  'Machine Learning': 'AI & Data Science',
  'Deep Learning': 'AI & Data Science',
  'Artificial Intelligence (AI)': 'AI & Data Science',
  'Generative AI': 'AI & Data Science',
  'Large Language Models (LLMs)': 'AI & Data Science',
  'LangChain': 'AI & Data Science',
  'LlamaIndex': 'AI & Data Science',
  'Retrieval-Augmented Generation (RAG)': 'AI & Data Science',
  'Hugging Face': 'AI & Data Science',
  'Transformers': 'AI & Data Science',
  'spaCy': 'AI & Data Science',
  'NLTK': 'AI & Data Science',

  // Developer Tools & Testing
  'Git': 'Developer Tools & Testing',
  'GitHub': 'Developer Tools & Testing',
  'GitLab': 'Developer Tools & Testing',
  'Bitbucket': 'Developer Tools & Testing',
  'Postman': 'Developer Tools & Testing',
  'Swagger / OpenAPI': 'Developer Tools & Testing',
  'Insomnia': 'Developer Tools & Testing',
  'VS Code': 'Developer Tools & Testing',
  'IntelliJ IDEA': 'Developer Tools & Testing',
  'PyCharm': 'Developer Tools & Testing',
  'Android Studio': 'Developer Tools & Testing',
  'Xcode': 'Developer Tools & Testing',
  'Jira': 'Developer Tools & Testing',
  'Trello': 'Developer Tools & Testing',
  'Confluence': 'Developer Tools & Testing',
  'Figma': 'Developer Tools & Testing',
  'npm': 'Developer Tools & Testing',
  'yarn': 'Developer Tools & Testing',
  'pnpm': 'Developer Tools & Testing',
  'Vite': 'Developer Tools & Testing',
  'Webpack': 'Developer Tools & Testing',
  'ESLint': 'Developer Tools & Testing',
  'Prettier': 'Developer Tools & Testing',
  'Jest': 'Developer Tools & Testing',
  'Vitest': 'Developer Tools & Testing',
  'Cypress': 'Developer Tools & Testing',
  'Playwright': 'Developer Tools & Testing',
  'JUnit': 'Developer Tools & Testing',
  'PyTest': 'Developer Tools & Testing',
  'Selenium': 'Developer Tools & Testing',

  // Core Concepts & Architecture
  'Data Structures & Algorithms (DSA)': 'Core Concepts & Architecture',
  'Algorithms': 'Core Concepts & Architecture',
  'Object-Oriented Programming (OOP)': 'Core Concepts & Architecture',
  'System Design': 'Core Concepts & Architecture',
  'Database Management Systems (DBMS)': 'Core Concepts & Architecture',
  'Operating Systems': 'Core Concepts & Architecture',
  'Computer Networks': 'Core Concepts & Architecture',
  'Distributed Systems': 'Core Concepts & Architecture',
  'Concurrency & Multithreading': 'Core Concepts & Architecture',
  'Clean Architecture & Design Patterns': 'Core Concepts & Architecture',
  'Design Patterns': 'Core Concepts & Architecture',
  'Agile Methodologies': 'Core Concepts & Architecture',
  'Scrum': 'Core Concepts & Architecture',
  'Test-Driven Development (TDD)': 'Core Concepts & Architecture',
  'Cybersecurity': 'Core Concepts & Architecture',
  'Cryptography': 'Core Concepts & Architecture',
  'Blockchain': 'Core Concepts & Architecture',
};

// Strict list of soft skills, phrases, degrees, fluff, and invalid non-skills that must be rejected
const INVALID_SKILL_PATTERNS = [
  // Soft skills and buzzwords
  /^(communication|verbal\s+communication|written\s+communication|good\s+communication|excellent\s+communication)$/i,
  /^(team\s+player|team\s+work|teamwork|team\s+management|team\s+leadership|collaboration|collaborative)$/i,
  /^(problem\s+solving|problem\s+solver|critical\s+thinking|analytical\s+thinking|analytical\s+skills)$/i,
  /^(hard\s+working|hard\s+worker|fast\s+learner|quick\s+learner|eager\s+to\s+learn|self\s+motivated|self\s+starter)$/i,
  /^(time\s+management|adaptability|flexibility|work\s+ethic|attention\s+to\s+detail|creativity)$/i,
  /^(leadership|decision\s+making|interpersonal\s+skills|presentation\s+skills|public\s+speaking|active\s+listening)$/i,
  /^(multitasking|positive\s+attitude|enthusiastic|passionate|dedicated|punctual|reliable)$/i,

  // Fluff, qualifiers, section headers
  /^(skills|technical\s+skills|hard\s+skills|soft\s+skills|core\s+skills|key\s+skills|core\s+competencies)$/i,
  /^(languages|programming\s+languages|frameworks|libraries|databases|tools|technologies|platforms|operating\s+systems)$/i,
  /^(proficient|experienced|intermediate|advanced|beginner|basic|familiar|good|strong|excellent|expert)$/i,
  /^(various|multiple|other|others|etc|and|or|including|such\s+as|with|using|built\s+with)$/i,
  /^(knowledge\s+of|hands\s+on\s+experience|experience\s+in|familiar\s+with|worked\s+on|proficient\s+in)$/i,

  // Academic / Degree terms
  /^(b\.?tech|m\.?tech|b\.?s\.?|m\.?s\.?|b\.?e\.?|m\.?e\.?|bca|mca|mba|bba|b\.?sc|m\.?sc|ph\.?d|diploma|degree|bachelor|master|doctorate)$/i,
  /^(university|college|institute|school|high\s+school|cgpa|gpa|percentage|marks|grade|grades)$/i,
  /^(graduated|pursuing|passed|semester|final\s+year|year|present|current)$/i,

  // Project, experience, and action words
  /^(project|projects|key\s+projects|academic\s+projects|mini\s+project|major\s+project|final\s+year\s+project)$/i,
  /^(work\s+experience|experience|employment|intern|internship|role|responsibilities|achievements|certifications)$/i,
  /^(developed|created|built|designed|implemented|maintained|managed|engineered|executed|performed)$/i,
];

/**
 * Validates, cleans, and normalizes a candidate skill string.
 * Returns normalized canonical name, or null if the candidate string is not a valid skill.
 */
export function cleanAndNormalizeSkill(raw: string): string | null {
  if (!raw || typeof raw !== 'string') return null;

  // Strip bullets, quotes, leading/trailing symbols, colons, dashes
  let clean = raw
    .replace(/^[-•*#_:\s\d.)]+|[-•*#_:\s]+$/g, '')
    .replace(/["'`]/g, '')
    .trim();

  // Strip common noisy prefixes like "Proficient in...", "Hands-on with...", "Basic knowledge of..."
  clean = clean.replace(/^(?:proficient in|hands-on with|familiar with|knowledge of|experience in|worked with|basics of|basic|advanced|intermediate)\s+/i, '').trim();

  // Strip trailing notes in parentheses like "Python (Pandas, NumPy)" -> "Python"
  if (clean.includes('(') && clean.endsWith(')')) {
    const withoutParens = clean.replace(/\(.*?\)/g, '').trim();
    if (withoutParens.length >= 2) {
      clean = withoutParens;
    }
  }

  // Strip trailing version numbers like "Python 3.10" -> "Python", "React 18" -> "React"
  clean = clean.replace(/\s+v?\d+(?:\.\d+)*$/i, '').trim();

  if (clean.length < 2 || clean.length > 45) return null;

  const lower = clean.toLowerCase();

  // Check against blacklisted soft skills and noisy phrases
  for (const pattern of INVALID_SKILL_PATTERNS) {
    if (pattern.test(clean) || pattern.test(lower)) {
      return null;
    }
  }

  // Reject full sentences or phrases with more than 4 words unless known in canonical map
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length > 4 && !CANONICAL_SKILL_NAMES[lower]) {
    return null;
  }

  // Reject if looks like a sentence (contains period followed by space, or starts with common sentence starters)
  if (/^[A-Z][a-z]+\s+(is|was|are|were|has|have|had|will|should|can|could|to|for|in|on|at|by|with)\b/.test(clean)) {
    return null;
  }

  // Check canonical map for clean display name
  if (CANONICAL_SKILL_NAMES[lower]) {
    return CANONICAL_SKILL_NAMES[lower];
  }

  // If already properly capitalized or matches common technical naming pattern
  return clean;
}

/**
 * Groups and sorts extracted skills into clean, standardized categories
 */
export function categorizeSkillsList(skills: string[]): CategorizedSkillGroup[] {
  const seen = new Set<string>();
  const normalizedList: string[] = [];

  for (const s of skills) {
    const cleaned = cleanAndNormalizeSkill(s);
    if (cleaned) {
      const lower = cleaned.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        normalizedList.push(cleaned);
      }
    }
  }

  const categoryBuckets: Record<string, string[]> = {
    'Programming Languages': [],
    'Frameworks & Libraries': [],
    'Databases & Storage': [],
    'Cloud & DevOps': [],
    'AI & Data Science': [],
    'Developer Tools & Testing': [],
    'Core Concepts & Architecture': [],
    'Other Technical Skills': [],
  };

  for (const skill of normalizedList) {
    const cat = SKILL_TO_CATEGORY[skill];
    if (cat && categoryBuckets[cat]) {
      categoryBuckets[cat].push(skill);
    } else {
      // Heuristic categorization for unlisted technical skills
      const lower = skill.toLowerCase();
      if (/(?:language|script|sql|c\+\+|java|python|rust|golang|ruby|php|swift|kotlin)/i.test(lower)) {
        categoryBuckets['Programming Languages'].push(skill);
      } else if (/(?:react|vue|angular|svelte|next|nuxt|spring|django|flask|express|nest|tailwind|bootstrap|redux)/i.test(lower)) {
        categoryBuckets['Frameworks & Libraries'].push(skill);
      } else if (/(?:db|sql|database|mongo|redis|postgres|oracle|firebase|dynamo|cassandra)/i.test(lower)) {
        categoryBuckets['Databases & Storage'].push(skill);
      } else if (/(?:aws|cloud|azure|gcp|docker|kubernetes|k8s|ci\/cd|devops|jenkins|terraform|linux)/i.test(lower)) {
        categoryBuckets['Cloud & DevOps'].push(skill);
      } else if (/(?:ai|ml|learning|vision|nlp|pytorch|tensorflow|pandas|numpy|cv|rag|llm)/i.test(lower)) {
        categoryBuckets['AI & Data Science'].push(skill);
      } else if (/(?:git|postman|jira|figma|studio|vscode|webpack|vite|jest|cypress|test)/i.test(lower)) {
        categoryBuckets['Developer Tools & Testing'].push(skill);
      } else if (/(?:structures|algorithms|dsa|oop|system design|networks|architecture|concurrency)/i.test(lower)) {
        categoryBuckets['Core Concepts & Architecture'].push(skill);
      } else {
        categoryBuckets['Other Technical Skills'].push(skill);
      }
    }
  }

  // Convert to clean array of non-empty categories
  const result: CategorizedSkillGroup[] = [];
  const standardOrder = [
    'Programming Languages',
    'Frameworks & Libraries',
    'Databases & Storage',
    'Cloud & DevOps',
    'AI & Data Science',
    'Developer Tools & Testing',
    'Core Concepts & Architecture',
    'Other Technical Skills',
  ];

  for (const catName of standardOrder) {
    if (categoryBuckets[catName] && categoryBuckets[catName].length > 0) {
      result.push({
        category: catName,
        skills: categoryBuckets[catName],
      });
    }
  }

  return result;
}
