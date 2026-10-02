/**
 * Karl Evan Tabunda - Personal Developer Portfolio Data
 * Read-only project data adhering to documented specifications.
 */

const PORTFOLIO_DATA = {
  personal: {
    name: "Karl Evan Tabunda",
    role: "IT Student & Developer",
    status: "IT STUDENT",
    rotatingRoles: [
      "IT Student",
      "Software Developer",
      "Backend Developer",
      "Web Developer"
    ],
    education: "BS Information Technology",
    school: "National College of Science and Technology (NCST)",
    graduationYear: "2027",
    location: "Philippines",
    email: "tabunda.karlevan@ncst.edu.ph",
    github: "https://github.com/Lollipop0-0",
    githubUsername: "Lollipop0-0",
    githubAvatar: "https://avatars.githubusercontent.com/Lollipop0-0",
    linkedin: "https://www.linkedin.com/in/tabunda-karl-evan-r-44b4a1381/",
    facebook: "https://www.facebook.com/karl.evan.tabunda.2024",
    resumeUrl: "assets/documents/Karl-Evan-Tabunda-Resume.pdf",
    bio: "Information Technology student exploring software development, web applications, databases, and UI/UX through real projects.",
    extendedBio: "I'm Karl Evan, an IT student passionate about building useful systems and learning new technologies. I enjoy turning ideas into real projects and solving problems through code, design, and collaboration."
  },

  currentlyBuilding: {
    title: "Celestine University of the Pacific",
    subtitle: "Enrollment & Admissions System",
    status: "Active Project",
    label: "Collaborative Project — Yakuzokai Team",
    link: "#featured-project"
  },

  aboutSnapshot: {
    education: {
      degree: "BS Information Technology",
      institution: "National College of Science and Technology (NCST)",
      expectedGraduation: "2027"
    },
    focus: [
      "Web Development",
      "Software Development",
      "UI/UX"
    ],
    currentlyLearning: [
      "Java",
      "PHP / MVC",
      "JavaScript",
      "Database Design",
      "Git / GitHub"
    ],
    interests: [
      "Building practical systems",
      "Backend development",
      "UI/UX",
      "Database-driven applications"
    ]
  },

  featuredProject: {
    id: "01",
    title: "Celestine University of the Pacific",
    badgeNumber: "01",
    category: "collaborative",
    teamLabel: "Collaborative Project — Yakuzokai Team",
    tagline: "Admissions & Enrollment Platform",
    description: "A university admissions and enrollment management platform designed around real academic workflows.",
    longDescription: "Celestine University of the Pacific (CUP) is a collaborative academic management system developed with the Yakuzokai team. It streamlines student admissions, application review, course enrollment, and student records management within an intuitive, responsive interface built with robust PHP MVC architecture.",
    technologies: ["PHP", "MVC", "MySQL", "JavaScript", "Bootstrap"],
    repository: "https://github.com/Yakuzokai/CUP",
    image: "assets/images/projects/cup/preview.webp",
    annotation: "Real systems. Real impact.",
    highlights: [
      "Comprehensive admissions evaluation and applicant tracking pipeline",
      "Structured PHP MVC backend with clean separation of concerns",
      "Relational MySQL database managing applicant profiles and course programs",
      "Responsive, accessible portal interface for students and administrators"
    ]
  },

  projects: [
    {
      id: "02",
      title: "Inventory Management System",
      badgeNumber: "02",
      category: "personal",
      teamLabel: "My Project",
      isCollaborative: false,
      tagline: "Real-time Stock Tracking & Control",
      description: "Real-time stock tracking and inventory management built with PHP, MySQL, and JavaScript.",
      longDescription: "A practical inventory management web application engineered to monitor stock levels, organize product categories, flag low inventories, and provide automated reporting for small-to-medium scale warehouse and retail needs.",
      technologies: ["PHP", "MySQL", "JavaScript"],
      repository: "https://github.com/Lollipop0-0/Inventory-Management-System",
      image: "assets/images/projects/inventory/preview.webp",
      highlights: [
        "Product catalog with SKU search, categorization, and filtering",
        "Automated threshold notifications for low stock replenishment",
        "Transactional stock updates and movement audit logging",
        "Clean, responsive dashboard layout with key inventory metrics"
      ]
    },
    {
      id: "03",
      title: "Library Management System",
      badgeNumber: "03",
      category: "personal",
      teamLabel: "My Project",
      isCollaborative: false,
      tagline: "Catalog, Borrowing & Circulation System",
      description: "Book catalog, borrowing tracking, and patron records built with PHP, MySQL, and Bootstrap.",
      longDescription: "A structured library circulation and cataloging platform designed to manage book records, patron memberships, active loans, and overdue tracking with clean relational database integrity.",
      technologies: ["PHP", "MySQL", "Bootstrap"],
      repository: "https://github.com/Lollipop0-0/Library-Management-System",
      image: "assets/images/projects/library/preview.webp",
      highlights: [
        "Searchable book catalog with genre, author, and availability status",
        "Patron record management and circulation history tracking",
        "Automated borrowing duration and overdue status handling",
        "Responsive Bootstrap-based layout optimized for desk librarians"
      ]
    },
    {
      id: "04",
      title: "UI SneakerHub",
      badgeNumber: "04",
      category: "personal",
      teamLabel: "My Project",
      isCollaborative: false,
      tagline: "Modern E-Commerce Frontend Showcase",
      description: "Modern, responsive footwear e-commerce concept interface with dynamic catalog filtering.",
      longDescription: "A high-fidelity frontend showcase demonstrating modern e-commerce user interface design, dark-mode product presentation, interactive category filters, and an animated cart preview built with semantic HTML, modern CSS, and vanilla JavaScript.",
      technologies: ["HTML", "CSS", "JavaScript"],
      repository: "https://github.com/Lollipop0-0/UI-SneakerHub",
      image: "assets/images/projects/sneakerhub/preview.webp",
      highlights: [
        "Sleek dark theme with vibrant orange accents and visual hierarchy",
        "Client-side interactive filtering by shoe category, brand, and price",
        "Dynamic cart preview modal with quantity adjustments",
        "Fully responsive layout designed for mobile and desktop viewports"
      ]
    },
    {
      id: "05",
      title: "Hotel Reservation Management System",
      badgeNumber: "05",
      category: "personal",
      teamLabel: "My Project",
      isCollaborative: false,
      tagline: "Room Booking & Occupancy Platform",
      description: "Hotel booking and occupancy management system supporting guest check-in/out and room administration.",
      longDescription: "An administrative hotel management system for tracking room availability, handling guest check-in and check-out workflows, managing room tiers, and calculating reservation invoices.",
      technologies: ["PHP", "MySQL", "Bootstrap"],
      repository: "https://github.com/Lollipop0-0/Hotel-Reservation-Management-System",
      image: "assets/images/projects/hotel/preview.webp",
      highlights: [
        "Interactive room occupancy calendar and availability status grid",
        "Seamless guest registration, room assignment, and check-in workflow",
        "Tiered room pricing and billing calculation logic",
        "Administrative dashboard providing daily arrival and departure overviews"
      ]
    },
    {
      id: "06",
      title: "SmartSpace",
      badgeNumber: "06",
      category: "collaborative",
      teamLabel: "Collaborative Project — Yakuzokai Team",
      isCollaborative: true,
      tagline: "3D Room Planning with Three.js & Laravel",
      description: "Three.js 3D room planning with Laravel API.",
      longDescription: "SmartSpace is a collaborative 3D interior design and spatial planning web application. Built with Three.js on the client for interactive 3D scene rendering, object manipulation, and dimensional measurements, supported by a Laravel REST API backend for layout persistence.",
      technologies: ["Three.js", "JavaScript", "Laravel", "MySQL"],
      repository: "https://github.com/Yakuzokai/smartspace",
      image: "assets/images/projects/smartspace/preview.webp",
      highlights: [
        "Interactive Three.js 3D viewport with camera orbit and pan controls",
        "Furniture placement, drag-and-drop manipulation, and collision detection",
        "Room dimension grid and real-time spatial measurement overlays",
        "REST API integration for saving and retrieving customized room layouts"
      ]
    }
  ],

  techStack: {
    categories: [
      {
        id: "frontend",
        idx: "01",
        title: "Frontend",
        tag: "<frontend/>",
        kicker: "<FRONTEND/>",
        tools: [
          { name: "HTML5", key: "html5", note: "Semantic structure, accessible markup, and forms" },
          { name: "CSS3", key: "css3", note: "Modern layout, Flexbox, Grid, custom properties & animations" },
          { name: "JavaScript", key: "javascript", note: "ES6+ logic, DOM manipulation, and asynchronous APIs" },
          { name: "Bootstrap", key: "bootstrap", note: "Responsive grid systems and institutional portal UI" },
          { name: "Tailwind CSS", key: "tailwindcss", note: "Utility-first modern styling tokens & components" },
          { name: "Three.js", key: "threejs", note: "3D scene graphs, lighting, camera controls & spatial canvas" },
          { name: "Vite", key: "vite", note: "Next-gen frontend tooling and high-speed build server" },
          { name: "React", key: "react", note: "Component-driven architectures, hooks, and reactive UI" }
        ]
      },
      {
        id: "backend",
        idx: "02",
        title: "Backend",
        tag: "<backend/>",
        kicker: "<BACKEND/>",
        tools: [
          { name: "PHP", key: "php", note: "Server-side business logic, session security & database integration" },
          { name: "MVC Architecture", key: "mvc", note: "Clean separation of Models, Views, and Controllers" },
          { name: "Laravel", key: "laravel", note: "Modern PHP framework, routing, migrations & REST API backend" },
          { name: "REST APIs", key: "restapi", note: "Stateless JSON endpoints, CRUD handling & integration" },
          { name: "Node.js", key: "nodejs", note: "Asynchronous backend runtimes & local automation tooling" },
          { name: "Python", key: "python", note: "Procedural scripting, algorithmic logic & data manipulation" }
        ]
      },
      {
        id: "database-cloud",
        idx: "03",
        title: "Databases & Cloud",
        tag: "<database-cloud/>",
        kicker: "<DATABASES-CLOUD/>",
        tools: [
          { name: "MySQL", key: "mysql", note: "Relational schema design, primary/foreign keys & ACID transactions" },
          { name: "MariaDB", key: "mariadb", note: "Robust open-source relational database engine" },
          { name: "phpMyAdmin", key: "phpmyadmin", note: "Visual database administration, schema inspection & SQL queries" },
          { name: "Supabase", key: "supabase", note: "Postgres-backed database with realtime subscriptions" },
          { name: "Firebase", key: "firebase", note: "NoSQL document collections and cloud application services" },
          { name: "PostgreSQL", key: "postgresql", note: "Advanced relational database engine with strict integrity" }
        ]
      },
      {
        id: "systems-core",
        idx: "04",
        title: "Languages & Systems",
        tag: "<systems-core/>",
        kicker: "<SYSTEMS-CORE/>",
        tools: [
          { name: "C++", key: "cpp", note: "Procedural problem-solving, memory fundamentals, pointers & arrays" },
          { name: "Java", key: "java", note: "Object-oriented principles, encapsulation, inheritance & Swing GUIs" },
          { name: "TypeScript", key: "typescript", note: "Static type contracts, compile-time safety & interfaces" }
        ]
      },
      {
        id: "devops-tools",
        idx: "05",
        title: "DevOps & Environments",
        tag: "<devops-tools/>",
        kicker: "<DEVOPS-TOOLS/>",
        tools: [
          { name: "Git", key: "git", note: "Distributed version control, atomic commits & branch workflows" },
          { name: "GitHub", key: "github", note: "Repository hosting, team collaboration & code review" },
          { name: "VS Code", key: "vscode", note: "Primary IDE, developer debugging & customization" },
          { name: "NetBeans", key: "netbeans", note: "Java desktop application development environment" },
          { name: "XAMPP", key: "xampp", note: "Local full-stack Apache, PHP, and MariaDB server" },
          { name: "Vercel", key: "vercel", note: "Continuous deployment and preview branch pipelines" },
          { name: "Docker", key: "docker", note: "Containerized environments and reproducible runtimes" }
        ]
      },
      {
        id: "ai-design",
        idx: "06",
        title: "AI & Design",
        tag: "<ai-design/>",
        kicker: "<AI-DESIGN/>",
        tools: [
          { name: "Figma", key: "figma", note: "UI/UX wireframing, component design systems & prototypes" },
          { name: "Gemini", key: "gemini", note: "Google AI reasoning, architecture review & problem-solving" },
          { name: "Codex", key: "codex", note: "AI pair programming, code synthesis & workflow agents" },
          { name: "Claude", key: "claude", note: "Analytical reasoning, technical documentation & refinement" },
          { name: "GitHub Copilot", key: "copilot", note: "Intelligent autocompletion & developer productivity" }
        ]
      }
    ],
    // Backward-compatible fallback mapping
    WEB: [
      { name: "PHP", icon: "code" },
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
      { name: "JavaScript", icon: "js" },
      { name: "Bootstrap", icon: "bootstrap" }
    ],
    SOFTWARE: [
      { name: "Java", icon: "java" },
      { name: "C++", icon: "cpp" }
    ],
    DATABASE: [
      { name: "MySQL", icon: "database" },
      { name: "MariaDB", icon: "database" }
    ],
    TOOLS: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "VS Code", icon: "terminal" },
      { name: "NetBeans", icon: "code" },
      { name: "XAMPP", icon: "server" }
    ],
    "UI / UX": [
      { name: "Figma", icon: "figma" }
    ],
    AI: [
      { name: "Gemini", icon: "sparkles" },
      { name: "Codex", icon: "cpu" }
    ]
  },

  developmentJourney: [
    { step: "01", title: "Programming Fundamentals", desc: "Core algorithms, control structures, and computational logic foundations." },
    { step: "02", title: "C++", desc: "Memory management, pointers, data structures, and procedural problem-solving." },
    { step: "03", title: "Java & OOP", desc: "Object-oriented principles, polymorphism, inheritance, and encapsulation." },
    { step: "04", title: "Java Desktop Applications", desc: "GUI design, event-driven architectures, and Swing/AWT desktop software." },
    { step: "05", title: "PHP & MySQL", desc: "Dynamic server-side scripting, relational database queries, and CRUD operations." },
    { step: "06", title: "MVC Web Applications", desc: "Architectural separation of Models, Views, and Controllers in scalable web apps." },
    { step: "07", title: "Git & GitHub", desc: "Version control branching, team collaboration workflows, and remote repositories." },
    { step: "08", title: "UI/UX & Figma", desc: "Wireframing, interactive prototyping, design systems, and user-centered design." },
    { step: "09", title: "Full Management Systems", desc: "Architecting end-to-end database-driven platforms solving real institutional challenges." }
  ],

  figuringOut: [
    { title: "MVC Architecture", status: "Refining clean routing & controller isolation" },
    { title: "Database Design", status: "Indexing, normalization & query optimization" },
    { title: "Authentication", status: "Session management & secure password hashing" },
    { title: "Role-Based Systems", status: "Granular access control & permission matrices" },
    { title: "Payment Workflows", status: "Exploring mock transaction lifecycles" },
    { title: "UI / UX", status: "Micro-interactions & accessible design systems" },
    { title: "Git Workflows", status: "Merge conflict resolution & release branching" },
    { title: "Web Architecture", status: "RESTful principles & decoupled frontend patterns" },
    { title: "Deployment", status: "Hosting configurations, DNS & environment setups" }
  ],

  certificates: [
    {
      id: "cert-cpp",
      title: "Introduction to C++",
      issuer: "Sololearn",
      issueDate: "18 March, 2025",
      credentialId: "CC-KDC4AZEG",
      image: "assets/images/certificates/cert-cpp.webp",
      skills: ["C++", "Procedural Logic", "Data Structures", "Memory Concepts"],
      description: "Official Sololearn course certification verifying competency in C++ syntax, conditional branching, loops, functions, arrays, memory concepts, and algorithmic foundations."
    },
    {
      id: "cert-html",
      title: "Introduction to HTML",
      issuer: "Sololearn",
      issueDate: "20 February, 2025",
      credentialId: "CC-NHB7RE2H",
      image: "assets/images/certificates/cert-html.webp",
      skills: ["HTML5", "Semantic Markup", "Web Accessibility", "Forms & Tables"],
      description: "Official Sololearn course certification verifying understanding of core HTML structure, semantic tags, tables, forms, media integration, and accessible web standards."
    },
    {
      id: "cert-css",
      title: "Introduction to CSS",
      issuer: "Sololearn",
      issueDate: "17 March, 2025",
      credentialId: "CC-T8NGLTB4",
      image: "assets/images/certificates/cert-css.webp",
      skills: ["CSS3", "Box Model", "Flexbox & Grid", "Responsive Design"],
      description: "Official Sololearn course certification verifying expertise in CSS cascading rules, selectors, box sizing, Flexbox, responsive layouts, and modern visual styling."
    },
    {
      id: "cert-javascript",
      title: "Introduction to JavaScript",
      issuer: "Sololearn",
      issueDate: "17 May, 2025",
      credentialId: "CC-C8KJA5GY",
      image: "assets/images/certificates/cert-javascript.webp",
      skills: ["JavaScript", "DOM Manipulation", "ES6+ Logic", "Event Handling"],
      description: "Official Sololearn course certification verifying theoretical and practical understanding of JavaScript fundamentals, variables, control flow, functions, objects, and DOM manipulation."
    }
  ]
};

if (typeof window !== "undefined") {
  window.PORTFOLIO_DATA = PORTFOLIO_DATA;
}

