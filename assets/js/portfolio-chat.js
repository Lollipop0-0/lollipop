/**
 * Karl Evan Tabunda - Portfolio Chatbot Module
 * Intelligent, client-side conversational assistant representing Karl Evan and his portfolio.
 * Powered by structured PORTFOLIO_DATA with zero external heavy dependencies.
 * Architecture supports optional future backend AI integration while answering instantly from local data.
 */

const PortfolioChat = (() => {
  // DOM references
  let chatEl = null;
  let bodyEl = null;
  let inputEl = null;
  let sendBtn = null;
  let typingIndicatorEl = null;
  let isOpen = false;
  let isTyping = false;

  // Sound feedback helper
  const playSound = (type) => {
    if (!window.SoundManager) return;
    try {
      if (type === "pop" && typeof window.SoundManager.playPop === "function") {
        window.SoundManager.playPop();
      } else if (type === "tick" && typeof window.SoundManager.playTick === "function") {
        window.SoundManager.playTick();
      } else if (type === "close" && typeof window.SoundManager.playClose === "function") {
        window.SoundManager.playClose();
      }
    } catch (e) {}
  };

  /**
   * Structured Knowledge Base derived from PORTFOLIO_DATA and portfolio assets
   */
  const Knowledge = {
    getData() {
      return window.PORTFOLIO_DATA || {};
    },

    getPersonal() {
      const d = this.getData();
      return d.personal || {
        name: "Karl Evan Tabunda",
        role: "IT Student & Developer",
        education: "BS Information Technology",
        school: "National College of Science and Technology (NCST)",
        graduationYear: "2027",
        location: "Philippines",
        email: "tabunda.karlevan@ncst.edu.ph",
        github: "https://github.com/Lollipop0-0",
        linkedin: "https://www.linkedin.com/in/tabunda-karl-evan-r-44b4a1381/",
        resumeUrl: "assets/documents/Karl-Evan-Tabunda-Resume.pdf",
        bio: "Information Technology student exploring software development, web applications, databases, and UI/UX through real projects."
      };
    },

    getProjects() {
      const d = this.getData();
      const list = [];
      if (d.featuredProject) list.push(d.featuredProject);
      if (Array.isArray(d.projects)) list.push(...d.projects);
      return list;
    },

    getCertificates() {
      const d = this.getData();
      return Array.isArray(d.certificates) ? d.certificates : [];
    },

    getTechStack() {
      const d = this.getData();
      return d.techStack || {};
    }
  };

  /**
   * Question Answering Engine
   * Matches visitor intent based on keywords, synonyms, and entities in PORTFOLIO_DATA.
   * If a topic is not in the portfolio, answers strictly with the truthful fallback.
   */
  const Engine = {
    normalize(text) {
      return (text || "")
        .toLowerCase()
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9+#\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    },

    hasWord(normText, word) {
      const tokens = normText.split(/\s+/);
      return tokens.includes(word.toLowerCase());
    },

    hasPhrase(normText, phrase) {
      const p = phrase.toLowerCase().trim();
      return normText === p ||
             normText.startsWith(p + " ") ||
             normText.endsWith(" " + p) ||
             normText.includes(" " + p + " ");
    },

    hasAny(normText, list) {
      return list.some(item => {
        if (item.includes(" ")) {
          return this.hasPhrase(normText, item);
        } else {
          return this.hasWord(normText, item);
        }
      });
    },

    async generateResponse(query) {
      const norm = this.normalize(query);
      const personal = Knowledge.getPersonal();
      const projects = Knowledge.getProjects();
      const certs = Knowledge.getCertificates();

      if (!norm) {
        return "Feel free to ask me anything about Karl's projects, technical skills, education, or background!";
      }

      // 1. Tour guide trigger from inside chat
      if (
        this.hasAny(norm, ["tour", "walkthrough", "guide me", "take a tour", "show me around"])
      ) {
        setTimeout(() => {
          if (window.GuideManager && typeof window.GuideManager.start === "function") {
            close();
            window.GuideManager.start();
          }
        }, 1200);
        return "I'd love to show you around! 🧭 Launching the interactive tour guide now. Sit back and enjoy the walkthrough!";
      }

      // 2. Specific Project: CUP / Celestine University of the Pacific / Enrollment System / Admissions
      if (
        this.hasAny(norm, [
          "cup",
          "celestine",
          "celestine university",
          "enrollment",
          "enrollment system",
          "admissions",
          "college enrollment",
          "college enrollment system",
          "university system",
          "yakuzokai"
        ])
      ) {
        const cup = projects.find(p => p.id === "01" || (p.title && p.title.toLowerCase().includes("celestine")));
        const repo = cup?.repository || "https://github.com/Yakuzokai/CUP";
        return `**Celestine University of the Pacific (CUP)** is an **Admissions & Enrollment Management Platform** developed collaboratively with the **Yakuzokai team**.\n\n` +
          `• **Core Purpose:** Streamlines student admissions, application reviews, course enrollment pipelines, and academic record tracking.\n` +
          `• **Technologies Used:** PHP (structured MVC pattern), MySQL relational database, JavaScript, and Bootstrap.\n` +
          `• **Key Highlights:**\n` +
          `  - Comprehensive evaluation and applicant tracking pipeline.\n` +
          `  - Clean separation of concerns with structured PHP MVC architecture.\n` +
          `  - Normalized MySQL schema managing student profiles and courses.\n` +
          `  - Responsive administrative dashboard.\n\n` +
          `🔗 **Repository:** [View on GitHub](${repo})`;
      }

      // 3. Specific Project: Inventory Management System / Stock tracking
      if (
        this.hasAny(norm, [
          "inventory",
          "inventory management",
          "inventory system",
          "stock tracking",
          "stock level",
          "warehouse"
        ])
      ) {
        return `**Inventory Management System** is a real-time stock tracking and inventory control platform built by Karl Evan.\n\n` +
          `• **Core Purpose:** Monitors live inventory levels, flags low stock for replenishment, organizes product catalogs, and provides transactional audit logs.\n` +
          `• **Technologies Used:** PHP, MySQL, and JavaScript.\n` +
          `• **Key Highlights:**\n` +
          `  - Product catalog with SKU search, category filtering, and status alerts.\n` +
          `  - Automated threshold notifications for restocking.\n` +
          `  - Transactional inventory movement logging.\n\n` +
          `🔗 **Repository:** [GitHub Repository](https://github.com/Lollipop0-0/Inventory-Management-System)`;
      }

      // 4. Specific Project: Library Management System / Book catalog / Borrowing
      if (
        this.hasAny(norm, [
          "library",
          "library system",
          "library management",
          "books",
          "borrowing",
          "circulation",
          "patron"
        ])
      ) {
        return `**Library Management System** is a circulation and cataloging platform engineered for desk librarians and academic patrons.\n\n` +
          `• **Core Purpose:** Manages book catalogs, patron memberships, active borrowing loans, and overdue penalties.\n` +
          `• **Technologies Used:** PHP, MySQL, and Bootstrap.\n` +
          `• **Key Highlights:**\n` +
          `  - Searchable catalog by title, author, genre, and real-time availability.\n` +
          `  - Circulation history tracking and automated return calculations.\n` +
          `  - Clean database design enforcing relational integrity.\n\n` +
          `🔗 **Repository:** [GitHub Repository](https://github.com/Lollipop0-0/Library-Management-System)`;
      }

      // 5. Specific Project: UI SneakerHub / Footwear E-Commerce
      if (
        this.hasAny(norm, [
          "sneaker",
          "sneakers",
          "sneakerhub",
          "ecommerce",
          "e commerce",
          "shoes",
          "cart preview"
        ])
      ) {
        return `**UI SneakerHub** is a modern e-commerce concept interface showcasing responsive design and interactive frontend interactions.\n\n` +
          `• **Core Purpose:** Demonstrates high-fidelity e-commerce UX with dark-mode styling, dynamic catalog filtering, and cart state previews.\n` +
          `• **Technologies Used:** Semantic HTML5, Modern CSS3, and Vanilla JavaScript.\n` +
          `• **Key Highlights:**\n` +
          `  - Sleek dark theme with vibrant accents and visual hierarchy.\n` +
          `  - Instant client-side filtering by shoe category, brand, and price.\n` +
          `  - Interactive slide-out cart modal with quantity adjustment.\n\n` +
          `🔗 **Repository:** [GitHub Repository](https://github.com/Lollipop0-0/UI-SneakerHub)`;
      }

      // 6. Specific Project: Hotel Reservation Management System
      if (
        this.hasAny(norm, [
          "hotel",
          "hotel reservation",
          "hotel management",
          "room reservation",
          "booking system",
          "check in",
          "check out"
        ])
      ) {
        return `**Hotel Reservation Management System** is an administrative booking and room occupancy platform.\n\n` +
          `• **Core Purpose:** Manages guest registrations, check-in/out workflows, room availability schedules, and reservation invoicing.\n` +
          `• **Technologies Used:** PHP, MySQL, and Bootstrap.\n` +
          `• **Key Highlights:**\n` +
          `  - Visual room occupancy grid and status calendar.\n` +
          `  - Automated billing calculation based on room tiers and duration.\n` +
          `  - Daily arrival and departure administrative metrics.\n\n` +
          `🔗 **Repository:** [GitHub Repository](https://github.com/Lollipop0-0/Hotel-Reservation-Management-System)`;
      }

      // 7. Specific Project: SmartSpace / 3D Room Planning / Three.js
      if (
        this.hasAny(norm, [
          "smartspace",
          "3d",
          "three js",
          "threejs",
          "room planning",
          "interior design"
        ])
      ) {
        return `**SmartSpace** is a collaborative 3D interior design and spatial planning web application created with the **Yakuzokai team**.\n\n` +
          `• **Core Purpose:** Allows users to visualize, place, and arrange furniture in an interactive 3D spatial canvas with live dimensional measurements.\n` +
          `• **Technologies Used:** Three.js, Vanilla JavaScript, Laravel, and MySQL.\n` +
          `• **Key Highlights:**\n` +
          `  - Interactive 3D viewport with camera orbit, zoom, and pan controls.\n` +
          `  - Drag-and-drop furniture placement and collision boundaries.\n` +
          `  - Real-time room measurement overlays.\n` +
          `  - Laravel REST API backend for saving and loading room layouts.\n\n` +
          `🔗 **Repository:** [GitHub Repository](https://github.com/Yakuzokai/smartspace)`;
      }

      // 8. All Projects Overview / Show me your projects / What projects have you built?
      if (
        this.hasAny(norm, [
          "what projects",
          "show me your projects",
          "show me projects",
          "projects have you built",
          "projects have you made",
          "list projects",
          "all projects",
          "projects",
          "what have you built",
          "what have you made",
          "systems have you",
          "apps have you"
        ])
      ) {
        return `Karl has developed several web applications, management systems, and frontend prototypes:\n\n` +
          `1. **Celestine University of the Pacific (CUP):** Admissions & Enrollment Platform (PHP MVC, MySQL, Bootstrap) — *Collaborative with Yakuzokai*\n` +
          `2. **Inventory Management System:** Real-time stock tracking, categorization & threshold replenishment (PHP, MySQL, JS)\n` +
          `3. **Library Management System:** Book catalog, patron memberships & circulation tracking (PHP, MySQL, Bootstrap)\n` +
          `4. **SmartSpace:** 3D interior room planning with interactive Three.js canvas & Laravel API — *Collaborative with Yakuzokai*\n` +
          `5. **Hotel Reservation System:** Room booking, occupancy calendar & guest administration (PHP, MySQL, Bootstrap)\n` +
          `6. **UI SneakerHub:** Modern footwear e-commerce showcase with dynamic filters (HTML, CSS, JS)\n\n` +
          `👉 You can explore in-depth project details on the [Projects Page](projects.html) or jump to the featured project on the homepage!`;
      }

      // 9. Programming Languages specifically
      if (
        this.hasAny(norm, [
          "programming languages",
          "coding languages",
          "what languages",
          "which languages",
          "languages do you use",
          "languages do you know"
        ])
      ) {
        return `Karl works with the following programming and query languages:\n\n` +
          `• **PHP:** Primary server-side language for MVC web applications, session management, and CRUD systems.\n` +
          `• **JavaScript (ES6+):** Client-side scripting, asynchronous APIs, Three.js 3D rendering, and interactive DOM.\n` +
          `• **Java:** Object-oriented software principles, Swing GUIs, and desktop software development.\n` +
          `• **C++:** Procedural problem solving, memory fundamentals, pointers, and data structures (Sololearn certified).\n` +
          `• **SQL (MySQL / MariaDB):** Relational database design, table normalization, and transactional queries.\n` +
          `• **Python:** Utility automation, asset optimization scripts (like optimize.py), and scripting.\n` +
          `• **TypeScript:** Static type safety, interfaces, and compile-time contracts.\n` +
          `• **HTML5 & CSS3:** Semantic structure, accessible markup, Flexbox, Grid, and responsive styling.\n\n` +
          `Check out the complete breakdown on the [Tech Stack Page](tech-stack.html).`;
      }

      // 10. Technologies / Skills / Tech Stack Overall
      if (
        this.hasAny(norm, [
          "what technologies",
          "technologies do you know",
          "what tech",
          "tech stack",
          "technologies",
          "skills",
          "tools do you use",
          "what can you do",
          "stack",
          "frameworks"
        ])
      ) {
        return `Karl Evan's technical stack spans across full-stack web development, databases, and tooling:\n\n` +
          `• **Frontend:** HTML5, CSS3, JavaScript (ES6+), Bootstrap, Tailwind CSS, Three.js, React, Vite\n` +
          `• **Backend:** PHP (MVC Architecture), Laravel, REST APIs, Node.js, Python\n` +
          `• **Databases & Cloud:** MySQL, MariaDB, phpMyAdmin, PostgreSQL, Supabase, Firebase\n` +
          `• **Languages & Systems:** PHP, JavaScript, Java, C++, TypeScript, Python\n` +
          `• **DevOps & Environments:** Git, GitHub, VS Code, NetBeans, XAMPP, Vercel, Docker\n` +
          `• **AI & Design:** Figma (UI/UX wireframing), Google Gemini, Codex, Claude, GitHub Copilot\n\n` +
          `Explore interactive category cards on the [Tech Stack Page](tech-stack.html).`;
      }

      // 11. Specific technology questions
      if (this.hasAny(norm, ["php", "mvc"])) {
        return `Karl has deep practical experience with **PHP** and **MVC (Model-View-Controller) architecture**! He has used PHP to build the **CUP Enrollment System**, **Inventory Management System**, **Library System**, and **Hotel Reservation System**, emphasizing clean separation of concerns, secure sessions, and prepared MySQL queries.`;
      }

      if (this.hasAny(norm, ["java", "swing", "oop"])) {
        return `Karl is experienced in **Java** and Object-Oriented Programming (OOP) concepts such as inheritance, polymorphism, and encapsulation. He has built desktop applications using NetBeans, Swing GUIs, and event-driven patterns.`;
      }

      if (this.hasAny(norm, ["c++", "cpp"])) {
        return `Karl has a strong foundation in **C++**, focusing on procedural logic, algorithmic problem-solving, memory concepts, pointers, and data structures. He holds an official **Sololearn Introduction to C++ certification** (Credential ID: CC-KDC4AZEG).`;
      }

      if (this.hasAny(norm, ["mysql", "mariadb", "database", "sql"])) {
        return `Karl specializes in **MySQL** and relational database engineering: schema design, table normalization, primary/foreign keys, ACID transactions, and visual database administration with **phpMyAdmin** and **MariaDB**.`;
      }

      if (this.hasAny(norm, ["threejs", "three js", "3d graphics"])) {
        return `Karl utilizes **Three.js** for interactive 3D web experiences! He used Three.js in **SmartSpace** to implement 3D camera orbit controls, furniture placement, scene graph rendering, and real-time room dimensional measurement overlays.`;
      }

      if (this.hasAny(norm, ["laravel"])) {
        return `Karl uses **Laravel** for modern PHP backend architectures, route handling, database migrations, and RESTful JSON APIs (such as the backend persistence layer for the SmartSpace 3D planner).`;
      }

      if (this.hasAny(norm, ["figma", "ui ux", "design"])) {
        return `Karl leverages **Figma** for UI/UX wireframing, component design systems, and responsive interactive prototypes before translating designs into code.`;
      }

      // 12. Education / School / College / Degree / University
      if (
        this.hasAny(norm, [
          "education",
          "school",
          "college",
          "university",
          "degree",
          "studying",
          "study",
          "ncst",
          "graduation"
        ])
      ) {
        return `Karl Evan is currently studying **BS Information Technology** at the **National College of Science and Technology (NCST)** in the Philippines, with an expected graduation year of **2027**.\n\nHis academic focus combines software engineering fundamentals, database systems, web development, and real-world team projects.`;
      }

      // 13. Contact / How to contact / Email / Socials / Hire
      if (
        this.hasAny(norm, [
          "how can i contact",
          "contact you",
          "contact",
          "email",
          "get in touch",
          "hire",
          "reach out",
          "github",
          "linkedin",
          "facebook",
          "social"
        ])
      ) {
        return `You can connect with Karl through any of these channels:\n\n` +
          `• ✉️ **Email:** [tabunda.karlevan@ncst.edu.ph](mailto:${personal.email})\n` +
          `• 🐙 **GitHub:** [github.com/Lollipop0-0](${personal.github})\n` +
          `• 💼 **LinkedIn:** [Karl Evan Tabunda](${personal.linkedin})\n` +
          `• 📘 **Facebook:** [Karl Evan Tabunda](${personal.facebook})\n` +
          `• 📄 **Resume:** [Download Resume PDF](${personal.resumeUrl})\n\n` +
          `You can also jump directly to the [Contact Section](index.html#contact) to send a message!`;
      }

      // 14. Resume / CV
      if (this.hasAny(norm, ["resume", "cv", "curriculum vitae"])) {
        return `Karl's official resume is available for review and download:\n\n` +
          `📄 **[Download Karl Evan Tabunda Resume (PDF)](${personal.resumeUrl})**\n\n` +
          `It highlights his academic credentials at NCST, core technical proficiencies (PHP, MySQL, Java, C++, JavaScript), featured systems, and development milestones.`;
      }

      // 15. Certifications & Credentials
      if (
        this.hasAny(norm, [
          "certificate",
          "certificates",
          "certification",
          "certifications",
          "sololearn",
          "credential",
          "credentials",
          "licenses"
        ])
      ) {
        let text = `Karl holds 4 verified course certifications from **Sololearn**:\n\n`;
        certs.forEach(c => {
          text += `• **${c.title}** (${c.issuer} · ${c.issueDate})\n  Credential ID: \`${c.credentialId}\`\n`;
        });
        text += `\nExplore high-resolution certificate previews on the [Certificates Page](certificates.html).`;
        return text;
      }

      // 16. Hardware / Workstation / Everyday Gear
      if (
        this.hasAny(norm, [
          "gear",
          "setup",
          "hardware",
          "laptop",
          "monitor",
          "keyboard",
          "mouse",
          "earbuds",
          "specs",
          "workstation"
        ])
      ) {
        return `Karl's everyday developer workstation setup includes:\n\n` +
          `• 💻 **Laptop:** ASUS TUF Gaming A16 (16" · AMD Ryzen 7 · Radeon Graphics · 165Hz)\n` +
          `• 🖥️ **Monitor:** Lenovo Legion 27" Gaming Monitor (Fast IPS · High Refresh Rate)\n` +
          `• ⌨️ **Keyboard:** AULA F75 Mechanical Keyboard (75% · Comic Keycaps · Tri-Mode Wireless)\n` +
          `• 🖱️ **Mouse:** Attack Shark X11 Lightweight Mouse (49g with RGB Magnetic Dock)\n` +
          `• 🎧 **Audio:** Soundcore R50i True Wireless Earbuds\n` +
          `• 📱 **Mobile:** Apple iPhone 13 & iPhone 11\n\n` +
          `See high-res photos and details on the [Gear Page](gear.html).`;
      }

      // 17. Development Journey & Milestones
      if (
        this.hasAny(norm, [
          "journey",
          "milestones",
          "learning path",
          "progression",
          "experience",
          "career"
        ])
      ) {
        return `Karl's journey in software development has progressed through 9 key milestones:\n\n` +
          `1. Programming Fundamentals & Algorithmic Logic\n` +
          `2. C++ & Memory Management\n` +
          `3. Java & Object-Oriented Principles\n` +
          `4. Java Desktop Applications & GUIs\n` +
          `5. Dynamic Server-Side Scripting with PHP & MySQL\n` +
          `6. Scalable MVC Web Applications\n` +
          `7. Version Control with Git & Team GitHub Workflows\n` +
          `8. UI/UX Wireframing in Figma\n` +
          `9. Full-Scale Institutional Management Platforms (e.g. CUP, Inventory, Library)\n\n` +
          `Read more on the [About Page](about.html).`;
      }

      // 18. Who is Karl Evan / Tell me about yourself / Bio / Background / Profile
      if (
        this.hasAny(norm, [
          "who is karlevan",
          "who is karl evan",
          "who is karl",
          "who are you",
          "tell me about yourself",
          "tell me about karl",
          "about yourself",
          "about you",
          "about karl",
          "introduce yourself",
          "who made this",
          "who is the developer",
          "your background",
          "karl evan tabunda",
          "profile",
          "bio"
        ])
      ) {
        return `**${personal.name}** is an **Information Technology student and developer** at the **National College of Science and Technology (NCST)** in the Philippines (Class of 2027).\n\nHe is passionate about building practical software, database-driven systems, and interactive web applications. While he gravitates toward backend engineering (PHP MVC, relational databases, and system architecture), he also enjoys crafting clean UI/UX designs and exploring AI tools.\n\n` +
          `• 📍 **Location:** Philippines\n` +
          `• 🎓 **Degree:** BS Information Technology (NCST)\n` +
          `• 📄 **Resume:** [View / Download PDF](${personal.resumeUrl})\n` +
          `• 🔗 **Learn More:** Explore the [About Page](about.html) or [GitHub Profile](${personal.github})`;
      }

      // 19. Friendly Greetings & Pleasantries
      if (
        this.hasAny(norm, [
          "hello",
          "hi",
          "hey",
          "good morning",
          "good afternoon",
          "good evening",
          "sup",
          "yo",
          "how are you"
        ])
      ) {
        return `Hello! 👋 Thanks for visiting Karl's portfolio. I'm his portfolio assistant. How can I help you today? You can ask about his projects, skills, education, or get in touch!`;
      }

      if (this.hasAny(norm, ["thank you", "thanks", "appreciate", "salamat"])) {
        return `You're very welcome! Let me know if you'd like to know anything else about Karl's work or want to take a tour. 😊`;
      }

      if (this.hasAny(norm, ["bye", "goodbye", "see you", "cya"])) {
        return `Have a great day! Feel free to come back and chat anytime, or connect with Karl directly. ✌️`;
      }

      // 20. Strict Truthful Fallback for unknown / unavailable information
      return `I don't have that information in my portfolio yet, but you can explore the sections above or contact me directly at [tabunda.karlevan@ncst.edu.ph](mailto:${personal.email}).`;
    }
  };

  /**
   * Safe HTML Markdown-like renderer for message bubbles
   */
  function formatMessageText(text) {
    if (!text) return "";
    let safe = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Code blocks `code`
    safe = safe.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Bold **text**
    safe = safe.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

    // Links [label](url)
    safe = safe.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
      const isInternal = url.startsWith("#") || url.endsWith(".html");
      const target = isInternal ? "" : ' target="_blank" rel="noopener noreferrer"';
      return `<a href="${url}"${target}>${label}</a>`;
    });

    // Bullet lists
    const lines = safe.split("\n");
    let inList = false;
    let html = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        html += `<li>${trimmed.substring(2)}</li>`;
      } else {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        if (trimmed.length > 0) {
          html += `<p>${line}</p>`;
        }
      }
    }

    if (inList) html += "</ul>";
    return html;
  }

  function getFormattedTime() {
    const d = new Date();
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minStr} ${ampm}`;
  }

  /**
   * DOM element construction & initialization
   */
  function buildChatDOM() {
    if (chatEl) return;

    chatEl = document.createElement("div");
    chatEl.id = "portfolioChatbot";
    chatEl.className = "portfolio-chatbot";
    chatEl.setAttribute("role", "dialog");
    chatEl.setAttribute("aria-label", "Portfolio Chatbot");
    chatEl.setAttribute("aria-modal", "false");

    chatEl.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-title-group">
          <div class="chat-avatar-badge" aria-hidden="true">
            <span>🤖</span>
            <span class="chat-status-pulse" title="Online"></span>
          </div>
          <div class="chat-title-text">
            <span class="chat-title-main">Chat With Me</span>
            <span class="chat-title-sub">Karl's Portfolio Assistant</span>
          </div>
        </div>
        <div class="chat-header-controls">
          <button type="button" class="chat-control-btn" id="chatResetBtn" title="Reset conversation" aria-label="Reset conversation">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              <path d="M3 21v-5h5"></path>
            </svg>
          </button>
          <button type="button" class="chat-control-btn" id="chatCloseBtn" title="Close chat (Esc)" aria-label="Close chat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="chat-body" id="chatBody" role="log" aria-live="polite">
        <!-- Messages appended here -->
      </div>

      <form class="chat-input-bar" id="chatForm">
        <input
          type="text"
          id="chatInput"
          class="chat-input-field"
          placeholder="Ask me anything..."
          autocomplete="off"
          aria-label="Ask me anything about Karl's portfolio"
        />
        <button type="submit" id="chatSendBtn" class="chat-send-btn" aria-label="Send message">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    `;

    document.body.appendChild(chatEl);

    bodyEl = chatEl.querySelector("#chatBody");
    inputEl = chatEl.querySelector("#chatInput");
    sendBtn = chatEl.querySelector("#chatSendBtn");

    const closeBtn = chatEl.querySelector("#chatCloseBtn");
    closeBtn.addEventListener("click", () => {
      playSound("close");
      close();
    });

    const resetBtn = chatEl.querySelector("#chatResetBtn");
    resetBtn.addEventListener("click", () => {
      playSound("tick");
      resetConversation();
    });

    const form = chatEl.querySelector("#chatForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleUserSubmit();
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) {
        playSound("close");
        close();
      }
    });

    // Initial greeting
    resetConversation();
  }

  function appendMessage(sender, text) {
    if (!bodyEl) return;
    const row = document.createElement("div");
    row.className = `chat-msg-row is-${sender}`;

    const formatted = formatMessageText(text);
    const timeStr = getFormattedTime();

    row.innerHTML = `
      <div class="chat-bubble">${formatted}</div>
      <span class="chat-time">${timeStr}</span>
    `;

    bodyEl.appendChild(row);
    scrollToBottom();
  }

  function appendSuggestions() {
    if (!bodyEl) return;
    const wrap = document.createElement("div");
    wrap.className = "chat-suggestions";
    wrap.innerHTML = `
      <span class="chat-suggestions-label">Suggested Questions:</span>
      <div class="chat-suggestions-grid">
        <button type="button" class="chat-chip" data-question="Tell me about yourself">Tell me about yourself</button>
        <button type="button" class="chat-chip" data-question="Show me your projects">Show me your projects</button>
        <button type="button" class="chat-chip" data-question="What are your skills?">What are your skills?</button>
        <button type="button" class="chat-chip" data-question="How can I contact you?">How can I contact you?</button>
      </div>
    `;

    wrap.querySelectorAll(".chat-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        const q = btn.getAttribute("data-question");
        if (q) {
          sendUserMessage(q);
        }
      });
    });

    bodyEl.appendChild(wrap);
    scrollToBottom();
  }

  function showTypingIndicator() {
    if (!bodyEl || typingIndicatorEl) return;
    typingIndicatorEl = document.createElement("div");
    typingIndicatorEl.className = "chat-typing-indicator";
    typingIndicatorEl.setAttribute("aria-label", "Karl's assistant is typing");
    typingIndicatorEl.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    bodyEl.appendChild(typingIndicatorEl);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    if (typingIndicatorEl) {
      typingIndicatorEl.remove();
      typingIndicatorEl = null;
    }
  }

  function scrollToBottom() {
    if (!bodyEl) return;
    requestAnimationFrame(() => {
      bodyEl.scrollTop = bodyEl.scrollHeight;
    });
  }

  function resetConversation() {
    if (!bodyEl) return;
    bodyEl.innerHTML = "";
    appendMessage(
      "assistant",
      "Hey! 👋 Welcome to my portfolio. I'm Karl Evan's assistant. Ask me anything about Karl's background, education, projects, skills, or how to get in touch!"
    );
    appendSuggestions();
  }

  async function sendUserMessage(text) {
    const trimmed = (text || "").trim();
    if (!trimmed || isTyping) return;

    playSound("pop");
    appendMessage("visitor", trimmed);

    if (inputEl) {
      inputEl.value = "";
    }

    isTyping = true;
    if (sendBtn) sendBtn.disabled = true;

    showTypingIndicator();

    // Natural cadence pause (350ms - 650ms)
    const delay = Math.min(Math.max(trimmed.length * 15, 380), 750);
    await new Promise(r => setTimeout(r, delay));

    hideTypingIndicator();

    const response = await Engine.generateResponse(trimmed);
    appendMessage("assistant", response);

    playSound("tick");
    isTyping = false;
    if (sendBtn) sendBtn.disabled = false;
    if (inputEl) inputEl.focus();
  }

  function handleUserSubmit() {
    if (!inputEl) return;
    const val = inputEl.value;
    sendUserMessage(val);
  }

  function open() {
    buildChatDOM();
    if (isOpen) return;
    isOpen = true;
    chatEl.classList.add("is-open");
    playSound("pop");
    setTimeout(() => {
      if (inputEl) inputEl.focus();
    }, 150);
  }

  function close() {
    if (!isOpen || !chatEl) return;
    isOpen = false;
    chatEl.classList.remove("is-open");
    if (window.PortfolioFab && typeof window.PortfolioFab.onChatClosed === "function") {
      window.PortfolioFab.onChatClosed();
    }
  }

  function toggle() {
    if (isOpen) close();
    else open();
  }

  function init() {
    buildChatDOM();
  }

  return {
    init,
    open,
    close,
    toggle,
    isOpen: () => isOpen,
    sendQuestion: sendUserMessage,
    reset: resetConversation
  };
})();

if (typeof window !== "undefined") {
  window.PortfolioChat = PortfolioChat;
}
