import bcrypt from 'bcryptjs';
import { User, ModuleModel } from '@/models';

export const modulesData = [
  {
    order: 1,
    slug: 'windows-11-fundamentals',
    title: 'Windows 11 Fundamentals',
    accentColor: '#5C4A72',
    estMinutes: 90,
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
        heading: 'The Four Basics of Windows Desktop',
        body: '• Start & Search: Press Win key and type to find any app or file instantly.\n• Snap & Desktops: Snap windows into grids; use virtual desktops (Win+Ctrl+D) to separate tasks.\n• File Explorer: Use tabs, Quick Access, and search to keep files organized.\n• Settings & Updates: Win+I for display, accounts, storage, and Windows Update.',
      },
      {
        tag: 'Apps & Customization',
        heading: 'Apps, Personalization & Accessibility',
        body: '1. Install apps safely via Microsoft Store.\n2. Remove apps via Settings → Apps → Installed apps.\n3. Personalize PC appearance via Right-click desktop → Personalize (Light/Dark mode).\n4. Accessibility & maintenance via Storage Sense, Magnifier, and Narrator.',
      },
      {
        tag: 'Shortcuts',
        heading: 'Essential Windows 11 Keyboard Shortcuts',
        body: '• Multitasking: Win+E (Explorer), Win+D (Desktop), Win+Left/Right (Snap), Win+Tab (Task View), Alt+Tab (Switch apps)\n• System: Win (Start), Win+I (Settings), Win+L (Lock), Win+A (Quick Settings), Win+Shift+S (Screenshot), Win+V (Clipboard History).',
      },
    ],
    exercise:
      'Snap two windows side by side with Win+Left and Win+Right. Create a second virtual desktop with Win+Ctrl+D for a different task. Then open File Explorer, create a new folder for this course\'s files, and pin it to Quick Access. Finish by switching to Dark mode in Settings → Personalization.',
    tip: 'Learn Win+V (clipboard history) early — it turns copy-paste into a small superpower once you\'re pasting between Word, Claude, and a browser all day.',
    quiz: [
      {
        questionText: 'Which keyboard shortcut opens the Clipboard History menu in Windows 11?',
        options: ['Ctrl + C', 'Win + V', 'Win + C', 'Alt + V'],
        correctAnswerIndex: 1,
      },
      {
        questionText: 'What keyboard shortcut creates a new virtual desktop in Windows 11?',
        options: ['Win + Ctrl + D', 'Win + Tab', 'Ctrl + Shift + N', 'Alt + F4'],
        correctAnswerIndex: 0,
      },
    ],
  },
  {
    order: 2,
    slug: 'office-foundations',
    title: 'Office Foundations (Word, Excel, PowerPoint)',
    accentColor: '#2E5C8A',
    estMinutes: 240,
    objectives: [
      'Navigate the Word, Excel, and PowerPoint interfaces confidently',
      'Format documents in Word using Styles, lists, tables, and images',
      'Set up an Excel sheet with real formulas, sorted/filtered tables, and charts',
      'Build a PowerPoint deck with consistent design, visuals, and smooth delivery',
      'Work noticeably faster using core Office keyboard shortcuts',
    ],
    lessons: [
      {
        tag: 'Core Habits',
        heading: 'Three Essential Application Habits',
        body: '• Word: Use Styles for headings & body text; build a Table of Contents automatically once applied.\n• PowerPoint: Set fonts, colors, and layout in Slide Master; every slide inherits it.\n• Excel: Master SUM, IF, XLOOKUP, format as Table, then use Insert → Recommended Charts.',
      },
      {
        tag: 'Word',
        heading: 'Word: Interface, Formatting & Sharing',
        body: 'Ribbon navigation, Backstage view, Heading Styles, Table of Contents generation, Bulleted lists, Insert Tables, Track Changes, and Export to PDF.',
      },
      {
        tag: 'Excel',
        heading: 'Excel: Interface, Data & Formulas',
        body: 'Workbooks, Formula Bar, Name Box, AutoFill, Number Formatting, Relative vs Absolute references ($A$1), SUM, AVERAGE, IF, XLOOKUP, and Recommended Charts.',
      },
      {
        tag: 'PowerPoint',
        heading: 'PowerPoint: Slides, Master & Delivery',
        body: 'Normal View & Slide Sorter, Design Ideas, SmartArt, Slide Master layout customization, Transitions, and Presenter View rehearsing.',
      },
      {
        tag: 'Shortcuts',
        heading: 'Core Office Shortcuts',
        body: '• Basics: Ctrl+N (New), Ctrl+O (Open), Ctrl+S (Save), Ctrl+P (Print), Ctrl+B (Bold), Ctrl+C/V/Z/Y.\n• Excel: Alt+= (AutoSum), Ctrl+T (Table), Ctrl+Shift+L (Filter).\n• PowerPoint: F5 (Start Show), Ctrl+M (New Slide), Ctrl+D (Duplicate Slide).',
      },
    ],
    exercise:
      'Pick a small project idea, real or invented. Write a one-page brief in Word using Styles, a bulleted list, and a table of contents. Mirror its structure into a 5-slide PowerPoint outline built from one Slide Master, with at least one image or SmartArt slide. Log a rough budget in Excel with a SUM formula, a sorted/filtered table, and one chart. Keep all three files — you\'ll reuse them in Modules 3 & 4.',
    tip: 'Word, PowerPoint and Excel all support the same underlying Office Theme — colours and fonts. Apply one theme across all three files so the document, deck, and spreadsheet read as a single, deliberate package.',
    quiz: [
      {
        questionText: 'In Word, what must be applied to headings to generate an automatic Table of Contents?',
        options: ['Bold text formatting', 'Heading Styles', 'Underline decoration', 'All-caps font'],
        correctAnswerIndex: 1,
      },
      {
        questionText: 'Which Excel shortcut automatically inserts a SUM formula for adjacent cells?',
        options: ['Ctrl + S', 'Alt + =', 'Ctrl + Shift + S', 'F5'],
        correctAnswerIndex: 1,
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
        heading: 'Prompt Engineering Fundamentals',
        body: '1. Set the role and context first (tell it who to act as).\n2. Be specific about output format, length, audience, and tone.\n3. Show an example when format matters (few-shot prompting).\n4. Ask it to reason step by step for complex tasks.\n5. Iterate with follow-ups, not rewrites.',
      },
      {
        tag: 'Drafting Loop',
        heading: 'The AI Drafting Loop',
        body: 'Brief (idea + files) → Outline (sections + purpose) → Draft (section by section) → Refine (summary, tone) → Export (Word / slide outline). Repeat "refine" iteratively.',
      },
      {
        tag: 'Free Plan',
        heading: 'Claude Free Tier Features',
        body: 'Includes web chat, web search, document uploads, and Artifacts preview. Keep in mind message limits refill automatically over rolling time windows.',
      },
    ],
    exercise:
      'Upload your Module 2 project brief to Claude. Get it to produce a one-page proposal outline, then a full draft, then a 6-slide narrative version. Build the real Word document and PowerPoint from that output.',
    tip: 'Before sending a proposal anywhere, ask Claude to argue against it in three bullet points. It\'s a fast, free way to find the weak spots in your own pitch before someone else does.',
    quiz: [
      {
        questionText: 'What is the recommended approach when refining AI-generated drafts in Claude?',
        options: [
          'Delete the chat and start over every time',
          'Iterate with follow-up prompts instead of restarting',
          'Use single-word prompts only',
          'Disable context windows',
        ],
        correctAnswerIndex: 1,
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
      'Iterate an infographic through targeted edits instead of rewriting the prompt',
      'Bring the result into a document or presentation at a usable resolution',
    ],
    lessons: [
      {
        tag: 'Briefing',
        heading: 'Writing the Infographic Brief',
        body: '1. Message: One sentence on key take-away.\n2. Format: Square for social, portrait for print, widescreen for slides.\n3. Style: Flat icons, corporate, hand-drawn — name the visual style.\n4. Exact labels: Spell out numbers and short text labels explicitly.',
      },
      {
        tag: 'Pipeline',
        heading: 'Data to Checked Graphic Pipeline',
        body: 'Idea/Data → Brief → Generate → Fact-Check (verify every number!) → Targeted Edits → Place in Document.',
      },
    ],
    exercise:
      'Take the Excel chart from Module 2. Write a one-paragraph infographic brief from it, generate the image in ChatGPT, verify every number against your spreadsheet, then place it into your Module 3 proposal or deck.',
    tip: 'Keep a short "style anchor" — your colour palette, font mood, and icon style in one or two sentences — and paste it into every request to keep a graphic set visually consistent.',
    quiz: [
      {
        questionText: 'Why is fact-checking numbers on AI-generated infographics mandatory before publishing?',
        options: [
          'Image AI tools can hallucinate or distort numeric labels and text spellings',
          'Fact-checking changes image background colors',
          'Images cannot be embedded in Word',
          'Fact-checking converts PNG to MP4',
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
      'Add a database with MongoDB Atlas when the application needs to remember data',
      'Push the codebase to GitHub, then deploy free on Vercel\'s Hobby plan',
      'Hand Jules a scoped task and merge its result',
    ],
    lessons: [
      {
        tag: 'Definitions',
        heading: 'Agentic AI & Vibe Coding Plain Terms',
        body: '• Agentic AI: An AI system that plans and carries out multi-step tasks independently (e.g. Jules plans edits, runs tests, and opens PRs).\n• Vibe Coding: Building software by describing goals in plain language and letting AI generate/revise working code against a live result (e.g. Bolt prototyping).',
      },
      {
        tag: 'Pipeline',
        heading: 'The 5-Step Agentic Pipeline',
        body: '1. Bolt: Vibe code prototype in browser.\n2. MongoDB Atlas: Connect persistence database.\n3. GitHub: Push versioned source of truth.\n4. Vercel Hobby: Import repo for auto-deploys.\n5. Jules: Hand scoped fix/feature task, review diff, merge PR.',
      },
    ],
    exercise:
      'Build a small web application in Bolt — a habit tracker or a simple internal tool is plenty. If it needs to remember anything between visits, connect it to a free MongoDB Atlas database. Push it to GitHub, deploy it to Vercel, confirm the live website works, then send Jules one well-scoped bug-fix or feature task and merge its pull request.',
    tip: 'Keep every Jules task to one clear outcome — one bug, one feature, one test suite. Small, scoped tasks are where agentic coding tools are most reliable; save architecture decisions for yourself.',
    quiz: [
      {
        questionText: 'What is the role of GitHub in the Module 5 pipeline?',
        options: [
          'To generate audio files',
          'To serve as the permanent, versioned source of truth triggering Vercel auto-deploys',
          'To replace Excel spreadsheets',
          'To edit PowerPoint slide masters',
        ],
        correctAnswerIndex: 1,
      },
      {
        questionText: 'What is the best practice for assigning tasks to autonomous AI agents like Jules?',
        options: [
          'Give it vague instructions to redesign the entire company',
          'Keep tasks small, well-scoped (e.g. one bug or one feature) with clear outcomes',
          'Never review pull requests before merging',
          'Delete the Git repository first',
        ],
        correctAnswerIndex: 1,
      },
    ],
  },
  {
    order: 6,
    slug: 'toolkit-summary',
    title: 'Toolkit Summary',
    accentColor: '#1B2330',
    estMinutes: 20,
    objectives: [
      'Review all software tools utilized across the entire curriculum',
      'Understand pricing tiers, free quotas, and cost optimization strategies',
    ],
    lessons: [
      {
        tag: 'Reference',
        heading: 'Complete Course Toolkit & Cost Tier Matrix',
        body: '• Windows 11: OS environment (Free - included with PC)\n• Word, Excel, PowerPoint: Office Suite (Free web versions or Office license)\n• Claude.ai: Drafting & reasoning partner (Free plan, no card required)\n• ChatGPT: Infographics & visual briefs (Free tier with account limits)\n• Bolt.new: Vibe coding app prototyping (Free tier, daily allowance)\n• MongoDB Atlas: Application database (Free Atlas M0 tier)\n• GitHub: Version control & repos (Free for public & private repos)\n• Vercel Hobby: Hosting & auto-deploys (Free for personal projects)\n• Google Jules: Agentic AI bug fixes & PRs (Free introductory tier)',
      },
    ],
    exercise:
      'Review the cost matrix and confirm that all software tools for your capstone project are running on $0 free tiers.',
    tip: 'All product names, pricing, and interfaces change over time — treat exact tier limits as snapshots and check official vendor pricing before committing.',
    quiz: [
      {
        questionText: 'How much upfront money is required to build and host a full-stack application using the course stack?',
        options: ['$0 (Everything has a free tier)', '$50/month', '$500 upfront', '$1,000/year'],
        correctAnswerIndex: 0,
      },
    ],
    isToolkit: true,
  },
  {
    order: 7,
    slug: 'capstone-proposal-backed-application',
    title: 'Capstone: Ship a Proposal-Backed Application',
    accentColor: '#1B2330',
    estMinutes: 120,
    objectives: [
      'Combine all five modules into one cohesive final project submission',
      'Submit proposal doc, pitch deck, infographic, and live application URL',
    ],
    lessons: [
      {
        tag: 'Capstone',
        heading: 'Final Capstone Deliverables',
        body: '1. Use Claude (Mod 3) to draft proposal, formatted in Word (Mod 2).\n2. Design supporting infographic in ChatGPT (Mod 4), fact-checked against numbers.\n3. Turn proposal into PowerPoint pitch deck (Mod 2 + 3).\n4. Build application in Bolt, connect MongoDB, push to GitHub, deploy on Vercel, and send Jules 1 improvement task (Mod 5).\n5. Present finished package in Capstone Portal.',
      },
    ],
    exercise: 'Complete and submit all four deliverable URLs in the Capstone submission form.',
    tip: 'Ensure all URLs (Google Docs/Word, Canva/PPT, GitHub/Image, and Vercel app link) are publicly accessible.',
    quiz: [
      {
        questionText: 'What are the four required deliverables in the Capstone Submission Form?',
        options: [
          '4 code files',
          'Proposal Doc URL, Pitch Deck URL, Infographic URL, Live Vercel App URL',
          '4 Excel spreadsheets',
          '4 domain registration receipts',
        ],
        correctAnswerIndex: 1,
      },
    ],
    isCapstone: true,
  },
];

export async function ensureDefaultData() {
  try {
    const moduleCount = await ModuleModel.countDocuments();
    if (moduleCount === 0) {
      await ModuleModel.insertMany(modulesData);
      console.log('Auto-seeded modules successfully.');
    }

    const adminEmail = 'admin@elearning.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123456', 10);
      await User.create({
        name: 'Portal Administrator',
        email: adminEmail,
        passwordHash,
        isAdmin: true,
        isAuthorized: true,
      });
      console.log('Auto-seeded default admin user.');
    }
  } catch (error) {
    console.error('Error during ensureDefaultData:', error);
  }
}
