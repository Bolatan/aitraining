export const modulesData = [
  {
    order: 1,
    slug: 'windows-11-fundamentals',
    title: 'Windows 11 Fundamentals',
    accentColor: '#5C4A72',
    estMinutes: 120,
    objectives: [
      'Navigate the Start menu, Taskbar, and Quick Settings confidently',
      'Snap and arrange windows, and use virtual desktops to multitask cleanly',
      'Organize, find, and manage files with File Explorer',
      'Install, remove, and personalize apps and settings to make Windows your own',
      'Work noticeably faster using core Windows 11 keyboard shortcuts',
    ],
    lessons: [
      {
        tag: 'Four Basics',
        heading: 'Four basics, one Windows desktop',
        body: '• S - Start & Search: Press the Windows key, then type to find any app or file instantly.\n• D - Snap & Desktops: Snap windows into grids; use virtual desktops to separate tasks.\n• F - File Explorer: Tabs, Quick Access, and search keep files easy to find.\n• G - Settings & Updates: Win+I for display, accounts, storage, and Windows Update.',
      },
      {
        tag: 'Apps & Settings',
        heading: 'Apps, personalization & accessibility',
        body: '1. Install apps: Open the Microsoft Store from Start; Store apps update themselves automatically in the background.\n2. Remove apps safely: Settings → Apps → Installed apps → Uninstall, rather than deleting files by hand.\n3. Personalize your PC: Right-click the desktop → Personalize for background, accent colour, and Light/Dark mode.\n4. Accessibility & maintenance: Settings → Accessibility has Magnifier, Narrator, and high-contrast themes; Storage Sense keeps your disk clean automatically.',
      },
      {
        tag: 'Connecting & Focus',
        heading: 'Search, notifications & staying connected',
        body: '1. Windows Search: Type in the search box for apps, files, settings, or web results, filtered by category as you go.\n2. Notifications & Focus Assist: Click the clock for Notification Center; turn on Focus Assist (Settings → System) to silence alerts during deep work.\n3. Multiple monitors: Win+P (Project) picks how a second screen is used: Extend, Duplicate, or Second screen only.\n4. Wi-Fi & printers: Quick Settings connects Wi-Fi in two clicks; Settings → Bluetooth & devices → Printers & scanners adds a printer.',
      },
      {
        tag: 'Security & Backup',
        heading: 'Backup, security & sharing files',
        body: '1. OneDrive backup: Files saved to your OneDrive folder sync automatically and are recoverable if your PC is lost or reset.\n2. Windows Security: Built-in antivirus runs automatically; check Settings → Privacy & Security → Windows Security for a health check.\n3. Sharing a file: Right-click → Share to send a file by email, Nearby Sharing, or a synced cloud link instead of a USB drive.',
      },
      {
        tag: 'Shortcuts',
        heading: 'Keyboard shortcuts (Windows 11)',
        body: 'Windows & multitasking:\n• Win+E — open File Explorer\n• Win+D — show/hide the desktop\n• Win+Left / Right — snap window to a side\n• Win+Up / Down — maximize / minimize\n• Win+Tab — Task View (virtual desktops)\n• Win+Ctrl+D — new virtual desktop\n• Win+Ctrl+Left/Right — switch desktops\n• Alt+Tab — switch between open windows\n\nSystem & utilities:\n• Win — open Start menu\n• Win+I — open Settings\n• Win+L — lock your PC\n• Win+A — open Quick Settings\n• Win+Shift+S — snip a screenshot\n• Ctrl+Shift+Esc — open Task Manager\n• Alt+F4 — close the active window',
      },
    ],
    exercise:
      'Snap two windows side by side with Win+Left and Win+Right. Create a second virtual desktop with Win+Ctrl+D for a different task. Then open File Explorer, create a new folder for this course\'s files. Finish by switching to Dark mode in Settings → Personalization.',
    tip: 'Muscle memory here pays off in every other module.',
    quiz: [
      {
        questionText: 'Which shortcut creates a new virtual desktop in Windows 11?',
        options: ['Win + Ctrl + D', 'Win + Tab', 'Alt + Tab', 'Win + Shift + S'],
        correctAnswerIndex: 0,
      },
      {
        questionText: 'What key combination snaps a window to the left side of the screen?',
        options: ['Win + Left', 'Alt + Left', 'Ctrl + Left', 'Shift + Left'],
        correctAnswerIndex: 0,
      },
      {
        questionText: 'Which settings area handles display, accounts, storage, and updates?',
        options: ['Win + I (Settings)', 'Win + A (Quick Settings)', 'Task Manager', 'Control Panel'],
        correctAnswerIndex: 0,
      },
    ],
  },
  {
    order: 2,
    slug: 'office-foundations',
    title: 'Office Foundations',
    accentColor: '#2E5C8A',
    estMinutes: 300,
    objectives: [
      'Navigate the Word, Excel, and PowerPoint interfaces confidently',
      'Format documents in Word using Styles, lists, tables, and images',
      'Set up an Excel sheet with real formulas, sorted/filtered tables, and charts',
      'Build a PowerPoint deck with consistent design, visuals, and smooth delivery',
      'Work noticeably faster using core Office keyboard shortcuts',
    ],
    lessons: [
      {
        tag: 'Core Skill',
        heading: 'One skill to anchor per application',
        body: '• Word: Set fonts, colours and layout once in Slide Master; every slide inherits it. (Styles & Formatting)\n• PowerPoint: Set fonts, colours and layout once in Slide Master; every slide inherits it.\n• Excel: Format data as Table, use formulas, and turn raw numbers into insight.',
      },
      {
        tag: 'Word',
        heading: 'Word: interface, formatting & sharing',
        body: '1. The interface: The Ribbon groups commands into tabs; the File tab opens Backstage view for opening, saving, and printing.\n2. Formatting text: Apply heading styles and font formatting to keep structure clear.\n3. Lists, tables: Bulleted/numbered lists, Insert → Table for a resizable grid.\n4. Images & export: Insert → Pictures with text wrap and Export → PDF for sharing anywhere.',
      },
      {
        tag: 'Word Essentials',
        heading: 'Word: more essentials',
        body: '1. Find & Replace: Ctrl+H swaps every instance of a word or phrase at once.\n2. Columns & layout: Layout → Columns turns a page into a newsletter-style multi-column layout in one click.\n3. Co-authoring: Save to OneDrive and multiple people can edit the same document at once, with each person\'s cursor shown live.',
      },
      {
        tag: 'Excel',
        heading: 'Excel: interface, data & analysis',
        body: '1. The interface: A workbook holds worksheets.\n2. Entering & formatting data: AutoFill drags a series down a column; Number Format and Conditional Formatting keep data readable.\n3. Formulas & functions: SUM, AVERAGE, and standard Excel functions.\n4. Tables, sorting & charts: Insert → Table, Data → Sort/Filter, and Insert → Recommended Charts turn raw numbers into insight.',
      },
      {
        tag: 'Excel Functions',
        heading: 'Excel: functions worth knowing',
        body: '1. Data Validation: Data tab → Data Validation restricts a cell to a dropdown list or a number range, preventing typos.\n2. Named ranges & printing: Name a range (Formulas → Define Name) to use in formulas instead of cell references; Page Layout → Print Area controls what prints.\n3. Freeze Panes: View → Freeze Panes keeps header rows visible while you scroll through a long sheet.',
      },
      {
        tag: 'PowerPoint',
        heading: 'PowerPoint: interface, slides & delivery',
        body: '1. The interface: Ribbon, Slide Pane, and Main Workspace.\n2. Building slides: Pick a Layout that fits the content.\n3. Master, transitions & animation: Set the look once in Slide Master; apply smooth slide transitions and animations.',
      },
      {
        tag: 'PowerPoint Essentials',
        heading: 'PowerPoint: more essentials',
        body: '1. Charts & linked data: Insert → Chart brings Excel-style charts into a slide; paste from Excel with "Keep Source Formatting & Link Data" to update automatically.\n2. Video & audio: Insert → Video/Audio embeds media directly on a slide, trimmed and set to play automatically if you choose.\n3. Custom slide size: Design → Slide Size switches between widescreen (16:9) and other aspect ratios before you start building.',
      },
      {
        tag: 'Shortcuts Part 1',
        heading: 'Keyboard shortcuts (Office) — part 1 of 2',
        body: 'Word:\n• Ctrl+N — new document | Ctrl+O — open document | Ctrl+S — save document | Ctrl+P — print\n• Ctrl+B — bold | Ctrl+I — italic | Ctrl+U — underline | Ctrl+C — copy\n\nExcel:\n• Ctrl+N — new workbook | Ctrl+O — open workbook | Ctrl+S — save workbook | Ctrl+P — print\n• Ctrl++ — insert row | Ctrl+- — delete row | Ctrl+- — delete column\n\nPowerPoint:\n• Ctrl+N — new presentation | Ctrl+O — open presentation | Ctrl+S — save presentation | Ctrl+P — print\n• F5 — start slide show | Page Down — next slide | Page Up — previous slide | Ctrl+D — duplicate slide',
      },
      {
        tag: 'Shortcuts Part 2',
        heading: 'Keyboard shortcuts (Office) — part 2 of 2',
        body: 'Word:\n• Ctrl+V — paste | Ctrl+Z — undo | Ctrl+Y — redo | Ctrl+A — select all\n• Ctrl+F — find | Ctrl+H — replace | Ctrl+] — increase font size | Ctrl+[ — decrease font size\n\nExcel:\n• Ctrl+1 — format cells | Alt+= — AutoSum | Ctrl+D — fill down | Ctrl+R — fill right | Ctrl+G — go to | Ctrl+F — find | Ctrl+K — insert hyperlink\n\nPowerPoint:\n• Ctrl+B — bold | Ctrl+I — italic | Ctrl+U — underline\n• Ctrl+E — align center | Ctrl+L — align left | Ctrl+R — align right',
      },
    ],
    exercise:
      'Create a brief Word document with Heading styles and a table. Build an Excel spreadsheet with a formatted table and AutoSum. Create a 3-slide PowerPoint presentation using Slide Master.',
    tip: 'Word tip: Ctrl+E centers text, Ctrl+L left-aligns. Excel tip: Ctrl+T creates a table, Ctrl+Shift+L toggles filters. PowerPoint tip: Ctrl+M adds a slide, Ctrl+Shift+> enlarges text.',
    quiz: [
      {
        questionText: 'Which Excel shortcut inserts AutoSum for selected numbers?',
        options: ['Alt + =', 'Ctrl + S', 'Ctrl + A', 'F5'],
        correctAnswerIndex: 0,
      },
      {
        questionText: 'How do you ensure every slide in a PowerPoint presentation inherits consistent fonts and colours?',
        options: ['Set the look once in Slide Master', 'Edit every slide manually', 'Copy paste slides', 'Use Page Setup'],
        correctAnswerIndex: 0,
      },
      {
        questionText: 'What feature in Excel keeps header rows visible while scrolling?',
        options: ['Freeze Panes', 'Data Validation', 'AutoFill', 'Conditional Formatting'],
        correctAnswerIndex: 0,
      },
    ],
  },
  {
    order: 3,
    slug: 'drafting-with-claude',
    title: 'Drafting with Claude',
    accentColor: '#A85A2A',
    estMinutes: 75,
    objectives: [
      'Apply core prompt-engineering principles that work across any AI chat tool',
      'Use Claude\'s free plan to turn a rough idea into a structured proposal outline',
      'Iterate a draft with follow-up prompts instead of restarting each time',
      'Convert a draft into an actual Word document or PowerPoint outline',
    ],
    lessons: [
      {
        tag: 'Prompting',
        heading: 'Prompt engineering fundamentals',
        body: '1. Set the role and context first: Tell it who to act as and what it needs to know before asking for output.\n2. Be specific about the output: Name the format, length, audience, and tone you want rather than leaving it to guess.\n3. Show an example when format matters: One good example of the structure you want beats a paragraph of rules.\n4. Ask it to reason step by step: Helps break down complex requests into logical parts.\n5. Iterate with follow-ups, not rewrites: Refine what\'s already there instead of re-explaining the whole task each time.',
      },
      {
        tag: 'Drafting Loop',
        heading: 'The drafting loop',
        body: 'Brief (idea + files) → Outline (sections + purpose) → Draft (section by section) → Refine (summary, tone) → Export (Word / slide outline).',
      },
    ],
    exercise:
      'Take a rough application idea, set a persona and context for Claude, and generate a proposal outline. Refine section by section using follow-up prompts and export as a structured outline.',
    tip: 'Iterate with follow-up prompts instead of restarting each time.',
    quiz: [
      {
        questionText: 'What is the best practice when refining an AI output in Claude?',
        options: [
          'Iterate with follow-up prompts instead of restarting',
          'Restart the entire chat from scratch every time',
          'Use single-word prompts only',
          'Avoid specifying tone or format',
        ],
        correctAnswerIndex: 0,
      },
      {
        questionText: 'What is the first step in effective prompt engineering?',
        options: [
          'Set the role and context first',
          'Ask for the final download link',
          'Paste unformatted text without instructions',
          'Close the browser tab',
        ],
        correctAnswerIndex: 0,
      },
    ],
  },
  {
    order: 4,
    slug: 'designing-infographics-with-chatgpt',
    title: 'Designing Infographics with ChatGPT',
    accentColor: '#96721F',
    estMinutes: 45,
    objectives: [
      'Turn a chart or a process into a clear image-generation brief',
      'Iterate an infographic through edits instead of rewriting the prompt',
      'Bring the result into a document at a usable resolution',
    ],
    lessons: [
      {
        tag: 'Briefing',
        heading: 'Write the brief, then edit — don\'t restart',
        body: '1. Message: One sentence on what the viewer should take away.\n2. Format: Square for social, portrait for print, widescreen for a slide.\n3. Style: Flat icons, hand-drawn, corporate — name the look you want.\n4. Exact labels: Spell out labels and numbers; short text reduces misspellings.',
      },
      {
        tag: 'Pipeline',
        heading: 'From data to a checked graphic',
        body: 'Idea / data → Brief (message, style, labels) → Generate → Fact-check (+ targeted edits) → Place in doc.\n\nFact-checking is not optional — it\'s the step that keeps an AI-generated visual honest.',
      },
    ],
    exercise:
      'Write a 4-part infographic brief (Message, Format, Style, Exact labels) for your proposal idea. Generate the visual in ChatGPT, fact-check all numbers/labels, and place the graphic into your document.',
    tip: 'Fact-checking is not optional — it\'s the step that keeps an AI-generated visual honest.',
    quiz: [
      {
        questionText: 'Which step in the infographic pipeline ensures numeric accuracy on AI-generated visuals?',
        options: ['Fact-check step', 'Auto-export step', 'Initial prompt step', 'Slide Master step'],
        correctAnswerIndex: 0,
      },
      {
        questionText: 'Why are short text labels recommended when generating infographics with AI?',
        options: [
          'Short text reduces misspellings and visual clutter',
          'AI cannot generate text at all',
          'Long text turns the image into audio',
          'Short text deletes the background',
        ],
        correctAnswerIndex: 0,
      },
    ],
  },
  {
    order: 5,
    slug: 'building-and-deploying-web-app',
    title: 'Building & Deploying a Web Application',
    accentColor: '#3F6249',
    estMinutes: 180,
    objectives: [
      'Explain what "agentic AI" and "vibe coding" mean, in plain terms',
      'Prototype a working web application from plain language in Bolt',
      'Add a database with MongoDB when the application needs to remember data',
      'Push the codebase to GitHub, then deploy free on Vercel\'s Hobby plan',
      'Hand Jules a scoped task and merge its result',
      'You can also add your custom domain to vercel',
    ],
    lessons: [
      {
        tag: 'Definitions',
        heading: 'Two terms worth knowing',
        body: '• Agentic AI: An AI system that plans and carries out a multi-step task with some independence — it decides what to do next, takes actions, checks its own results, and comes back when the task is done.\nExample in this module: Jules plans, edits code across files, runs tests, and opens a pull request largely on its own.\n\n• Vibe Coding: Building software by describing what you want in plain language and letting an AI tool generate and revise the working code — iterating against the running result instead of writing every line by hand.\nExample in this module: prototyping in Bolt.',
      },
      {
        tag: 'Pipeline',
        heading: 'Five steps, one pipeline',
        body: '1. Bolt — vibe coding in practice: Describe the application in plain language; iterate against the live in-browser preview.\n2. MongoDB (if needed): Ask Bolt or Jules to connect the application to a free MongoDB Atlas database for anything that must persist.\n3. GitHub: Push the project here; it becomes the permanent, versioned source of truth.\n4. Vercel (Hobby): Import the repo; every push to main auto-deploys, every pull request gets a preview URL.\n5. Jules — agentic AI in practice: Give it one scoped task; review its plan and diff, then merge.\n(Note: You can also add your custom domain to Vercel.)',
      },
      {
        tag: 'The Loop',
        heading: 'The loop, end to end',
        body: 'Bolt (prototype fast, in the browser) → GitHub (source of truth, version history) → Vercel (Hobby plan, live + preview URLs) → Jules (scoped fixes, tests, small PRs) → merge → automatic Vercel redeploy.',
      },
    ],
    exercise:
      'Build an app prototype in Bolt, connect MongoDB if needed, push to GitHub, deploy on Vercel, and assign Jules one scoped task to complete.',
    tip: 'Give Jules one scoped task; review its plan and diff, then merge.',
    quiz: [
      {
        questionText: 'What defines "Vibe Coding" in software development?',
        options: [
          'Describing what you want in plain language and letting AI generate and revise code iteratively',
          'Writing assembly code by hand in silence',
          'Memorizing entire programming language specifications',
          'Running database backups manually every hour',
        ],
        correctAnswerIndex: 0,
      },
      {
        questionText: 'In the Module 5 pipeline, which platform serves as the permanent versioned source of truth?',
        options: ['GitHub', 'Bolt', 'Windows 11 Desktop', 'Word'],
        correctAnswerIndex: 0,
      },
      {
        questionText: 'What happens when a pull request is merged into main on GitHub connected to Vercel?',
        options: [
          'Automatic Vercel redeploy is triggered',
          'The repository is deleted',
          'The database is erased',
          'Windows reboots',
        ],
        correctAnswerIndex: 0,
      },
    ],
  },
  {
    order: 6,
    slug: 'cybersecurity-principles',
    title: 'Cybersecurity Principles',
    accentColor: '#1E3A8A',
    estMinutes: 90,
    objectives: [
      'Understand core cybersecurity definitions, compliance drivers, and the analyst mindset',
      'Apply the CIA triad, non-repudiation, and authenticity to real-world security requirements',
      'Distinguish cybersecurity objectives and controls across work, home, education, and government environments',
      'Navigate governance structures, policies, and the continuous risk management cycle',
      'Utilize cybersecurity frameworks (NIST CSF, ISO 27001, CIS Controls) and zero trust / defense-in-depth models',
    ],
    lessons: [
      {
        tag: 'Foundations',
        heading: 'What is Cybersecurity & Compliance',
        body: '• Definition: Protecting people, systems, networks, and information from cyber threats.\n• Core Purpose: Protect confidentiality, integrity, and availability; reduce likelihood and impact of incidents; enable trusted operations.\n• Analyst Mindset: Understand business context, recognize threats/vulnerabilities/controls, detect, respond, recover, and learn.\n• Compliance Drivers: Cybersecurity operates within legal, regulatory, contractual, and internal obligations. Control gaps create legal and operational exposure.',
      },
      {
        tag: 'Objectives',
        heading: 'Cybersecurity Objectives & CIA Triad',
        body: '• Confidentiality: Prevent unauthorized disclosure through least privilege, access control, and encryption.\n• Integrity: Prevent unauthorized alteration using change control, checksums, signatures, and audit trails.\n• Availability: Keep services usable via resilience, backups, redundancy, and disaster recovery.\n• Extended Objectives: Authenticity and Non-repudiation (supporting proof of actions or transactions).',
      },
      {
        tag: 'Everyday Security',
        heading: 'Applied Security Across Everyday Environments',
        body: '• Remote Workers: MFA, secure remote access, managed/patched devices, approved VPN paths, avoiding sensitive work on unsafe networks.\n• Home Users: Strong unique passwords + MFA, secure router settings, updates, endpoint protection, and backups.\n• Education: Protecting learner/staff data, LMS security, role-based access, Wi-Fi/cloud security, and security awareness.\n• Government: Safeguard citizen data, privileged access management, network segmentation, secure portals, and continuity.',
      },
      {
        tag: 'Governance & Risk',
        heading: 'Governance & Continuous Risk Management',
        body: '• Governance: Leadership sets direction and risk appetite; CISO/security leadership owns policy and strategy; operational layer follows standards and procedures.\n• Continuous Risk Cycle: 1) Identify (assets, threats, vulnerabilities) → 2) Assess (likelihood, impact) → 3) Respond (avoid, mitigate, transfer, accept) → 4) Monitor (track residual risk).\n• Key Concepts: Risk appetite (level of risk willing to retain), Risk tolerance (acceptable variation), Residual risk (risk remaining after controls).',
      },
      {
        tag: 'Frameworks & Models',
        heading: 'Models, Frameworks & Threat Scenarios',
        body: '• NIST CSF: Identify, Protect, Detect, Respond, Recover.\n• ISO/IEC 27001 & CIS Controls: ISMS, risk-based controls, prioritized safeguards.\n• Security Models: Zero Trust (verify explicitly, least privilege) & Defense-in-Depth (layered controls).\n• Scenarios & Analyst Actions: Credential theft (MFA + account containment), Account takeover (RBAC + audit review), Malware delivery (email filtering + endpoint isolation), Supplier compromise (segmentation + access validation).',
      },
    ],
    exercise:
      'Analyze a potential account takeover scenario: identify which CIA objective was breached, map the appropriate preventive/detective controls, and outline the initial analyst containment steps.',
    tip: 'Security is a continuous process — controls must match risk and organizational requirements.',
    quiz: [
      {
        questionText: 'Which element of the CIA triad ensures data is protected against unauthorized alteration?',
        options: ['Integrity', 'Confidentiality', 'Availability', 'Non-repudiation'],
        correctAnswerIndex: 0,
      },
      {
        questionText: 'What core security model operates under the principle of "verify explicitly and enforce least privilege"?',
        options: ['Zero Trust', 'Defense-in-Depth', 'Air-gapping', 'Perimeter-only Security'],
        correctAnswerIndex: 0,
      },
      {
        questionText: 'Which step in the risk management cycle involves deciding to avoid, mitigate, transfer, or accept a risk?',
        options: ['Respond', 'Identify', 'Assess', 'Monitor'],
        correctAnswerIndex: 0,
      },
    ],
  },
  {
    order: 7,
    slug: 'toolkit-summary',
    title: 'Toolkit summary',
    accentColor: '#1B2330',
    estMinutes: 20,
    objectives: [
      'Review all course tools, their primary capabilities, and starting costs',
      'Understand how every tool offers a free tier for absolute beginners',
    ],
    lessons: [
      {
        tag: 'Toolkit Matrix',
        heading: 'Complete Course Toolkit & Cost Summary',
        body: '• Windows 11 — Best for: The desktop, windows, and files everything else in this course runs inside | Cost: Free — included with your PC\n• Word — Best for: Polished, structured text documents and proposals | Cost: Free web version, or with an Office licence\n• PowerPoint — Best for: Visual, spoken narratives — slide decks and pitches | Cost: Free web version, or with an Office licence\n• Excel — Best for: Numbers, budgets, and simple charts | Cost: Free web version, or with an Office licence\n• Claude — Best for: Drafting and thinking partner for outlines, proposals, and copy | Cost: Free plan, no card required\n• ChatGPT — Best for: Generating and iterating infographic images | Cost: Free tier, with account-based usage limits\n• Bolt.new — Best for: Rapid, full-stack application prototyping — vibe coding | Cost: Free tier, daily token allowance\n• Cybersecurity Principles — Best for: Governance, risk management, framework applications, and practical security operations | Cost: Free course module\n• MongoDB (Atlas) — Best for: Optional database for an application that needs to store data | Cost: Free Atlas tier available\n• GitHub — Best for: Version control and the handoff point between every Module 5 tool | Cost: Free for personal public and private repos\n• Vercel (Hobby) — Best for: Free hosting with automatic deploys from GitHub | Cost: Free for personal, non-commercial projects\n• Google Jules — Best for: Agentic, autonomous bug fixes, tests, and small features | Cost: Free introductory tier, daily task allowance',
      },
    ],
    exercise:
      'Verify that all tools in your application development pipeline are accessible on their free tiers.',
    tip: 'AI product interfaces and pricing shift often — check what\'s current on vendor sites.',
    quiz: [
      {
        questionText: 'Which tool in the course stack provides free web hosting with automatic deployments from GitHub?',
        options: ['Vercel (Hobby)', 'Word Web', 'Windows 11', 'MongoDB Atlas'],
        correctAnswerIndex: 0,
      },
    ],
    isToolkit: true,
  },
  {
    order: 8,
    slug: 'capstone-proposal-backed-application',
    title: 'Capstone: Ship a Proposal-Backed Application',
    accentColor: '#1B2330',
    estMinutes: 120,
    objectives: [
      'Combine all course modules into one deliverable: a small application idea, pitched properly, secure by design, and actually live',
    ],
    lessons: [
      {
        tag: 'Capstone Steps',
        heading: 'Five capstone steps',
        body: '1. Use Claude (Module 3) to draft a one-page proposal for a small application idea, then format it properly in Word (Module 2).\n2. Design one supporting infographic for the proposal in ChatGPT (Module 4), fact-checked against your own numbers.\n3. Turn the proposal\'s narrative into a short PowerPoint deck (Module 2 + 3), using your Office and Windows shortcuts to move fast.\n4. Apply Cybersecurity Principles (Module 6) to ensure identity, access, and data security standards are planned for the project.\n5. Build the application itself in Bolt, add MongoDB if it needs to store data, push it to GitHub, deploy it on Vercel, and send Jules at least one real improvement task (Module 5).\n6. Present the finished package — proposal, deck, infographic, and a working link to the live application.',
      },
    ],
    exercise:
      'Complete all capstone steps and submit your proposal URL, pitch deck URL, infographic URL, and live Vercel application URL.',
    tip: 'Present the finished package — proposal, deck, infographic, and a working link to the live application.',
    quiz: [
      {
        questionText: 'What are the four core deliverables required for the Capstone submission?',
        options: [
          'Proposal doc, Pitch deck, Infographic visual link, Live application URL',
          '4 Excel files',
          '4 Windows shortcuts',
          '4 GitHub branches',
        ],
        correctAnswerIndex: 0,
      },
    ],
    isCapstone: true,
  },
];
