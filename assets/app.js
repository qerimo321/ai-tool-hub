// ===== SPRACHSYSTEM =====
let lang = 'de';

// Initialisierung des Sprachsystems
function initLanguageSystem() {
  // 1. Prüfe localStorage für gespeicherte Sprache
  const savedLang = localStorage.getItem('preferredLang');
  
  // 2. Wenn gespeichert, diese verwenden
  if (savedLang && (savedLang === 'de' || savedLang === 'en')) {
    lang = savedLang;
  } 
  // 3. Ansonsten Browsersprache prüfen
  else {
    const browserLang = navigator.language || navigator.userLanguage;
    // Vereinfachte Erkennung: Wenn Deutsch (de, de-DE, de-AT, etc.) dann DE, sonst EN
    lang = browserLang.toLowerCase().startsWith('de') ? 'de' : 'en';
  }
  
  // 4. Sprache anwenden
  updateLanguage(lang);
  
  // 5. Button-Text setzen
  document.getElementById('langText').textContent = lang === 'de' ? 'EN' : 'DE';
}

// Sprache umschalten
function toggleLanguage() {
  lang = lang === 'de' ? 'en' : 'de';
  localStorage.setItem('preferredLang', lang);
  updateLanguage(lang);
  document.getElementById('langText').textContent = lang === 'de' ? 'EN' : 'DE';
}

// Sprache auf der Seite anwenden
function updateLanguage(language) {
  lang = language;
  
  // 1. Alle Elemente mit data-de und data-en Attributen aktualisieren
  const elements = document.querySelectorAll('[data-de][data-en]');
  elements.forEach(element => {
    const text = element.getAttribute(`data-${lang}`);
    if (text !== null) {
      // Spezielle Behandlung für Input-Platzhalter
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = text;
      } 
      // Spezielle Behandlung für Buttons/Spans innerhalb von Chips
      else if (element.classList.contains('search-hint-chip')) {
        // Überspringe die Chip-Container selbst
        const span = element.querySelector('span');
        if (span) {
          const spanText = span.getAttribute(`data-${lang}`);
          if (spanText) span.textContent = spanText;
        }
      }
      else {
        element.textContent = text;
      }
    }
  });
  
  // 2. Dynamische Inhalte aktualisieren (Tool-Beschreibungen etc.)
  updateDynamicContent();
}

// Dynamische Inhalte aktualisieren (KI-Tools Beschreibungen)
function updateDynamicContent() {
  // Nur wenn die KI-Tools Daten bereits geladen sind
  if (typeof aiTools !== 'undefined') {
    // Top Charts neu rendern
    renderTopCharts();
    
    // Filter anwenden (rendert auch die Tool-Liste)
    applyFilters();
  }
}

// ===== KI TOOLS DATENBANK =====
let aiTools = [
{id:1,name:"ChatGPT",category:"text",price:"freemium",priceDisplay:"Free/$20",rating:4.9,description:{de:"Bester Allrounder für Texte, Ideen, Code.",en:"Best all-rounder for text, ideas, code."},features:["GPT-4","Web","Files"],link:"https://chat.openai.com/",badge:"popular",useCases:["chatbot", "writing", "coding"],votes:0,userVote:0},
{id:2,name:"Claude",category:"text",price:"freemium",priceDisplay:"Free/$20",rating:4.8,description:{de:"Exzellent für lange Texte, Dokumente.",en:"Excellent for long-form, documents."},features:["200K","Files","Writing"],link:"https://claude.ai/",badge:"popular",useCases:["chatbot", "writing", "analysis"],votes:0,userVote:0},
{id:3,name:"Midjourney",category:"image",price:"paid",priceDisplay:"$10/mo",rating:4.9,description:{de:"Beste künstlerische Bildgenerierung.",en:"Best artistic image generation."},features:["Art","Styles","Quality"],link:"https://www.midjourney.com/",badge:"popular",useCases:["image-generator", "art", "design"],votes:0,userVote:0},
{id:4,name:"GitHub Copilot",category:"code",price:"paid",priceDisplay:"$10/mo",rating:4.8,description:{de:"Bester Code-Assistent für Entwickler.",en:"Best code assistant for developers."},features:["Autocomplete","Chat","Multi-Lang"],link:"https://github.com/features/copilot",badge:"popular",useCases:["coding-assistant", "debugging", "code-explanation"],votes:0,userVote:0},
{id:5,name:"ElevenLabs",category:"audio",price:"freemium",priceDisplay:"Free/$5",rating:4.8,description:{de:"Realistische KI-Stimmen, Voice Cloning.",en:"Realistic AI voices, voice cloning."},features:["TTS","Clone","Emotion"],link:"https://elevenlabs.io/",badge:"popular",useCases:["voice-generator", "text-to-speech", "voice-cloning"],votes:0,userVote:0},
{id:6,name:"Runway",category:"video",price:"freemium",priceDisplay:"Free/$15",rating:4.7,description:{de:"Text-zu-Video, KI-Video Editing.",en:"Text-to-video, AI video editing."},features:["Gen","Edit","FX"],link:"https://runwayml.com/",badge:"popular",useCases:["video-editor", "video-generation", "editing"],votes:0,userVote:0},
{id:7,name:"Gemini",category:"text",price:"freemium",priceDisplay:"Free/$20",rating:4.6,description:{de:"Googles KI mit Web Integration.",en:"Google's AI with web integration."},features:["Web","Multimodal","Apps"],link:"https://gemini.google.com/",badge:"new",useCases:["chatbot", "research", "writing"],votes:0,userVote:0},
{id:8,name:"Perplexity",category:"text",price:"freemium",priceDisplay:"Free/$20",rating:4.7,description:{de:"KI-Suche mit Quellenangaben.",en:"AI search with citations."},features:["Citations","Web","Sources"],link:"https://www.perplexity.ai/",badge:"new",useCases:["chatbot", "research", "information"],votes:0,userVote:0},
{id:9,name:"DALL·E 3",category:"image",price:"paid",priceDisplay:"In ChatGPT+",rating:4.7,description:{de:"Text-zu-Bild in ChatGPT.",en:"Text-to-image in ChatGPT."},features:["Text","Images","ChatGPT"],link:"https://openai.com/dall-e-3",badge:"new",useCases:["image-generator", "art", "design"],votes:0,userVote:0},
{id:10,name:"Stable Diffusion",category:"image",price:"free",priceDisplay:"Free",rating:4.7,description:{de:"Open-Source Bildgenerierung.",en:"Open-source image generation."},features:["Open","Local","Custom"],link:"https://stability.ai/",badge:"free",useCases:["image-generator", "art", "custom-models"],votes:0,userVote:0},
{id:11,name:"Cursor",category:"code",price:"freemium",priceDisplay:"Free/$20",rating:4.7,description:{de:"AI-first Code Editor.",en:"AI-first code editor."},features:["Editor","Chat","Context"],link:"https://cursor.sh/",badge:"new",useCases:["coding-assistant", "debugging", "code-editor"],votes:0,userVote:0},
{id:12,name:"Codeium",category:"code",price:"free",priceDisplay:"Free",rating:4.6,description:{de:"Kostenloser Code Assistant.",en:"Free code assistant."},features:["Free","Autocomplete","Chat"],link:"https://codeium.com/",badge:"free",useCases:["coding-assistant", "debugging", "free"],votes:0,userVote:0},
{id:13,name:"Suno",category:"audio",price:"freemium",priceDisplay:"Free/$10",rating:4.8,description:{de:"Songs aus Text generieren.",en:"Generate songs from text."},features:["Songs","Vocals","Lyrics"],link:"https://suno.com/",badge:"popular",useCases:["voice-generator", "music", "audio-creation"],votes:0,userVote:0},
{id:14,name:"Pika",category:"video",price:"freemium",priceDisplay:"Free/$",rating:4.6,description:{de:"Text-zu-Video Generation.",en:"Text-to-video generation."},features:["T2V","Styles","Short"],link:"https://pika.art/",badge:"new",useCases:["video-editor", "video-generation", "short-videos"],votes:0,userVote:0},
{id:15,name:"Canva AI",category:"image",price:"freemium",priceDisplay:"Free/$",rating:4.6,description:{de:"Design mit KI Features.",en:"Design with AI features."},features:["Magic","Templates","Design"],link:"https://www.canva.com/",badge:"popular",useCases:["image-generator", "design", "templates"],votes:0,userVote:0},
{id:16,name:"Notion AI",category:"text",price:"paid",priceDisplay:"$10/mo",rating:4.6,description:{de:"KI in Notion für Notizen.",en:"AI in Notion for notes."},features:["Summaries","Write","Organize"],link:"https://www.notion.so/product/ai",badge:"new",useCases:["chatbot", "writing", "organization"],votes:0,userVote:0},
{id:17,name:"Grammarly",category:"text",price:"freemium",priceDisplay:"Free/$12",rating:4.7,description:{de:"Grammatik & Stil Korrektur.",en:"Grammar and style correction."},features:["Grammar","Tone","Check"],link:"https://www.grammarly.com/",badge:"popular",useCases:["writing", "editing", "grammar"],votes:0,userVote:0},
{id:18,name:"QuillBot",category:"text",price:"freemium",priceDisplay:"Free/$10",rating:4.5,description:{de:"Paraphrasieren, Zusammenfassen.",en:"Paraphrasing, summarizing."},features:["Paraphrase","Summarize"],link:"https://quillbot.com/",badge:"free",useCases:["writing", "paraphrasing", "summarizing"],votes:0,userVote:0},
{id:19,name:"Adobe Firefly",category:"image",price:"freemium",priceDisplay:"Free/$",rating:4.7,description:{de:"Adobe's generative KI.",en:"Adobe's generative AI."},features:["Gen fill","Text2img"],link:"https://www.adobe.com/products/firefly.html",badge:"new",useCases:["image-generator", "design", "editing"],votes:0,userVote:0},
{id:20,name:"Descript",category:"audio",price:"freemium",priceDisplay:"Free/$12",rating:4.7,description:{de:"Audio/Video über Text editieren.",en:"Edit audio/video via text."},features:["Transcribe","Overdub"],link:"https://www.descript.com/",badge:"popular",useCases:["voice-generator", "audio-editing", "transcription"],votes:0,userVote:0},
{id:21,name:"Synthesia",category:"video",price:"paid",priceDisplay:"$30/mo",rating:4.6,description:{de:"AI Avatare für Videos.",en:"AI avatars for videos."},features:["Avatars","Languages"],link:"https://www.synthesia.io/",badge:"popular",useCases:["video-editor", "avatars", "presentations"],votes:0,userVote:0},
{id:22,name:"Murf",category:"audio",price:"freemium",priceDisplay:"Free/$19",rating:4.6,description:{de:"TTS für Business.",en:"TTS for business."},features:["TTS","Studio"],link:"https://murf.ai/",badge:"free",useCases:["voice-generator", "text-to-speech", "business"],votes:0,userVote:0},
{id:23,name:"Leonardo AI",category:"image",price:"freemium",priceDisplay:"Free/$",rating:4.6,description:{de:"Bilder, Assets, Game Art.",en:"Images, assets, game art."},features:["Assets","Canvas"],link:"https://leonardo.ai/",badge:"free",useCases:["image-generator", "game-art", "assets"],votes:0,userVote:0},
{id:24,name:"v0",category:"code",price:"freemium",priceDisplay:"Free/$",rating:4.6,description:{de:"UI aus Text generieren.",en:"Generate UI from text."},features:["React","UI","Components"],link:"https://v0.dev/",badge:"new",useCases:["coding-assistant", "ui-design", "prototyping"],votes:0,userVote:0},
{id:25,name:"NotebookLM",category:"text",price:"freemium",priceDisplay:"Free/$20",rating:4.6,description:{de:"KI-gestützte Summaries und Erklärungen mit interaktiven Audio-Übersichten.",en:"AI-powered summaries and explanations with interactive audio overviews."},features:["Research","Audio","Summaries"],link:"https://notebooklm.google.com/",badge:"new",useCases:["research", "education", "organization"],votes:0,userVote:0},
{id:26,name:"TypingMind",category:"text",price:"paid",priceDisplay:"$12/mo",rating:4.5,description:{de:"Chat-Interface für viele KI-Modelle mit Plugins und Agenten.",en:"Chat interface for many AI models with plugins and agents."},features:["Multi-Model","Plugins","Agents"],link:"https://www.typingmind.com/",badge:"new",useCases:["chatbot", "multi-model", "automation"],votes:0,userVote:0},
{id:27,name:"Poe",category:"text",price:"freemium",priceDisplay:"Free/$20",rating:4.4,description:{de:"Einfacher Zugang zu mehreren KI-Modellen, mobil optimiert.",en:"Easy access to multiple AI models, mobile optimized."},features:["Multi-Model","Mobile","Simple"],link:"https://poe.com/",badge:"free",useCases:["chatbot", "multi-model", "mobile"],votes:0,userVote:0},
{id:28,name:"Jasper",category:"text",price:"paid",priceDisplay:"$39/mo",rating:4.6,description:{de:"Branchenspezifischer KI-Assistent für Marketing und Copywriting.",en:"Industry-specific AI assistant for marketing and copywriting."},features:["Copywriting","Marketing","Templates"],link:"https://www.jasper.ai/",badge:"popular",useCases:["copywriting", "marketing", "content"],votes:0,userVote:0},
{id:29,name:"neuroflash",category:"text",price:"freemium",priceDisplay:"Free/$30",rating:4.5,description:{de:"KI-Textgenerator mit Fokus auf die deutsche Sprache und SEO.",en:"AI text generator with focus on German language and SEO."},features:["German","SEO","Templates"],link:"https://neuroflash.com/",badge:"new",useCases:["copywriting", "german", "seo"],votes:0,userVote:0},
{id:30,name:"Artsmart.ai",category:"image",price:"paid",priceDisplay:"$19/mo",rating:4.7,description:{de:"Fortschrittlicher Bildgenerator mit vielen Bearbeitungsfunktionen.",en:"Advanced image generator with many editing functions."},features:["Hyper-Realistic","Editing","Tools"],link:"https://artsmart.ai/",badge:"new",useCases:["image-generator", "editing", "realistic"],votes:0,userVote:0},
{id:31,name:"Ideogram",category:"image",price:"freemium",priceDisplay:"Free/$7",rating:4.6,description:{de:"Starke Text-Bild-Integration, ideal für Corporate Design.",en:"Strong text-image integration, ideal for corporate design."},features:["Text-In-Image","Simple","Corporate"],link:"https://ideogram.ai/",badge:"new",useCases:["image-generator", "design", "text-integration"],votes:0,userVote:0},
{id:32,name:"FLUX",category:"image",price:"freemium",priceDisplay:"Free/$15",rating:4.5,description:{de:"Realistische Bilder, schnell, mit API für Entwickler.",en:"Realistic images, fast, with API for developers."},features:["Realistic","Fast","API"],link:"https://flux.ai/",badge:"new",useCases:["image-generator", "realistic", "api"],votes:0,userVote:0},
{id:33,name:"DreamStudio",category:"image",price:"paid",priceDisplay:"$10/1000",rating:4.4,description:{de:"Stable Diffusion-Interface mit vielen Anpassungsmöglichkeiten.",en:"Stable Diffusion interface with many customization options."},features:["Stable-Diffusion","Custom","Control"],link:"https://dreamstudio.ai/",badge:"free",useCases:["image-generator", "stable-diffusion", "custom"],votes:0,userVote:0},
{id:34,name:"Stockimg.ai",category:"image",price:"paid",priceDisplay:"$16/mo",rating:4.3,description:{de:"KI-generierte Stockfotos für kommerzielle Nutzung.",en:"AI-generated stock photos for commercial use."},features:["Stock","Commercial","Photos"],link:"https://stockimg.ai/",badge:"business",useCases:["image-generator", "stock", "commercial"],votes:0,userVote:0},
{id:35,name:"Udio",category:"audio",price:"freemium",priceDisplay:"Free/$10",rating:4.8,description:{de:"Hervorragende Audioqualität für Songs mit flexibler Kontrolle.",en:"Excellent audio quality for songs with flexible control."},features:["High-Quality","Song-Structure","Vocals"],link:"https://udio.com/",badge:"popular",useCases:["music", "song-creation", "audio-quality"],votes:0,userVote:0},
{id:36,name:"Mureka.ai",category:"audio",price:"freemium",priceDisplay:"Free/$15",rating:4.4,description:{de:"Voice-Cloning für eigene Stimme als Sänger, 200+ Musikstile.",en:"Voice cloning for your own voice as singer, 200+ music styles."},features:["Voice-Clone","200+Styles","Marketplace"],link:"https://mureka.ai/",badge:"new",useCases:["music", "voice-cloning", "personalization"],votes:0,userVote:0},
{id:37,name:"Beatoven.ai",category:"audio",price:"freemium",priceDisplay:"Free/$3",rating:4.5,description:{de:"Rechtlich sichere Hintergrundmusik mit Fairly Trained Zertifizierung.",en:"Legally safe background music with Fairly Trained certification."},features:["Legal","Background","Video-Sync"],link:"https://beatoven.ai/",badge:"business",useCases:["background-music", "legal", "video"],votes:0,userVote:0},
{id:38,name:"Soundful",category:"audio",price:"freemium",priceDisplay:"Free/$10",rating:4.3,description:{de:"Echte Studio-Samples für professionelle Klangqualität.",en:"Real studio samples for professional sound quality."},features:["Studio-Samples","Royalty-Free","Stems"],link:"https://soundful.com/",badge:"business",useCases:["background-music", "studio-quality", "royalty-free"],votes:0,userVote:0},
{id:39,name:"HeyGen",category:"video",price:"freemium",priceDisplay:"Free/$29",rating:4.7,description:{de:"Realistische AI Avatare und KI-generierte Sprecher für Videos.",en:"Realistic AI avatars and AI-generated speakers for videos."},features:["Avatars","Lip-Sync","Realistic"],link:"https://www.heygen.com/",badge:"popular",useCases:["video-avatars", "presentations", "content-creation"],votes:0,userVote:0},
{id:40,name:"InVideo",category:"video",price:"freemium",priceDisplay:"Free/$35",rating:4.5,description:{de:"KI-Video-Editor mit vielen Templates für Social Media.",en:"AI video editor with many templates for social media."},features:["Templates","Editing","Social-Media"],link:"https://invideo.io/",badge:"popular",useCases:["video-editing", "social-media", "templates"],votes:0,userVote:0},
{id:41,name:"Lumen5",category:"video",price:"freemium",priceDisplay:"Free/$19",rating:4.4,description:{de:"Text-zu-Video Konverter für Blogposts und Artikel.",en:"Text-to-video converter for blog posts and articles."},features:["Text-to-Video","Blog","Automation"],link:"https://lumen5.com/",badge:"business",useCases:["video-creation", "content", "automation"],votes:0,userVote:0},
{id:42,name:"Pictory.ai",category:"video",price:"paid",priceDisplay:"$19/mo",rating:4.3,description:{de:"Automatische Erstellung von Videos aus langen Inhalten.",en:"Automatic creation of videos from long content."},features:["Automatic","Summarization","Visuals"],link:"https://pictory.ai/",badge:"business",useCases:["video-summarization", "content", "automation"],votes:0,userVote:0},
{id:43,name:"Sora",category:"video",price:"unknown",priceDisplay:"Coming Soon",rating:4.9,description:{de:"OpenAIs hochmodernes Video-Tool mit beeindruckenden Ergebnissen.",en:"OpenAI's state-of-the-art video tool with impressive results."},features:["High-Quality","OpenAI","Advanced"],link:"https://openai.com/sora",badge:"new",useCases:["video-generation", "high-quality", "ai-research"],votes:0,userVote:0},
{id:44,name:"Tabnine",category:"code",price:"freemium",priceDisplay:"Free/$12",rating:4.5,description:{de:"KI-Code Completion für viele Programmiersprachen und IDEs.",en:"AI code completion for many programming languages and IDEs."},features:["Autocomplete","Multi-Language","IDEs"],link:"https://www.tabnine.com/",badge:"popular",useCases:["code-completion", "ide-integration", "multi-language"],votes:0,userVote:0},
{id:45,name:"Sourcegraph Cody",category:"code",price:"freemium",priceDisplay:"Free/$9",rating:4.4,description:{de:"KI-Code-Assistent mit Verständnis des gesamten Codebase.",en:"AI code assistant with understanding of entire codebase."},features:["Codebase","Context","Understanding"],link:"https://sourcegraph.com/cody",badge:"new",useCases:["code-understanding", "large-codebases", "context"],votes:0,userVote:0},
{id:46,name:"Windsurf",category:"code",price:"freemium",priceDisplay:"Free/$20",rating:4.3,description:{de:"AI-powered Code Editor mit integrierter Terminal und Git.",en:"AI-powered code editor with integrated terminal and Git."},features:["Editor","Terminal","Git"],link:"https://windsurf.dev/",badge:"new",useCases:["code-editor", "development", "integrated"],votes:0,userVote:0},
{id:47,name:"Replit Ghostwriter",category:"code",price:"freemium",priceDisplay:"Free/$10",rating:4.2,description:{de:"KI-Coding innerhalb der Replit Browser-IDE.",en:"AI coding within the Replit browser IDE."},features:["Browser-IDE","Real-Time","Collaboration"],link:"https://replit.com/ghostwriter",badge:"free",useCases:["browser-ide", "real-time", "collaboration"],votes:0,userVote:0},
{id:48,name:"Gumloop",category:"business",price:"freemium",priceDisplay:"Free/$29",rating:4.6,description:{de:"AI-Automatisierungstool für Workflows ohne Code.",en:"AI automation tool for workflows without code."},features:["Automation","No-Code","Workflows"],link:"https://gumloop.com/",badge:"business",useCases:["automation", "workflows", "no-code"],votes:0,userVote:0},
{id:49,name:"Surfer SEO",category:"business",price:"paid",priceDisplay:"$79/mo",rating:4.5,description:{de:"KI-gestützte SEO-Optimierung für Content-Ranking.",en:"AI-powered SEO optimization for content ranking."},features:["SEO","Optimization","Content"],link:"https://surferseo.com/",badge:"business",useCases:["seo", "content-optimization", "marketing"],votes:0,userVote:0},
{id:50,name:"Zapier",category:"business",price:"freemium",priceDisplay:"Free/$20",rating:4.7,description:{de:"Workflow-Automatisierung zwischen tausenden Apps.",en:"Workflow automation between thousands of apps."},features:["Automation","Integrations","Apps"],link:"https://zapier.com/",badge:"popular",useCases:["automation", "integrations", "workflows"],votes:0,userVote:0}
];

// ===== ÜBERSETZUNGEN FÜR DYNAMISCHE TEXTE =====
const translations = {
  de: {
    badge: n => `🚀 ${n} KI-Tools für 2026`,
    helpful: "Hilfreich",
    tryNow: "Testen",
    noTitle: "Keine Tools gefunden",
    noMsg: "Ändere deine Filter oder versuche andere Suchbegriffe.",
    resetBtn: "Filter zurücksetzen"
  },
  en: {
    badge: n => `🚀 ${n} AI Tools for 2026`,
    helpful: "Helpful",
    tryNow: "Try",
    noTitle: "No tools found",
    noMsg: "Change your filters or try different search terms.",
    resetBtn: "Reset filters"
  }
};

// ===== FILTER VARIABLEN =====
let cat = 'all';
let price = 'all';
let sort = 'votes';
let query = '';
let searchTimeout;
let userVotes = {};

// ===== INITIALISIERUNG =====
document.addEventListener('DOMContentLoaded', () => {
  // 1. Sprachsystem initialisieren (muss zuerst kommen!)
  initLanguageSystem();
  
  // 2. Daten laden
  loadUserVotes();
  
  // 3. Event Listener einrichten
  setupEvents();
  
  // 4. Filter Dropdowns initialisieren
  initFilterDropdowns();
  
  // 5. Inhalt rendern
  renderTopCharts();
  applyFilters();
});

// ===== EVENT HANDLER =====
function setupEvents() {
  // Sprachumschalter Button
  document.getElementById('langBtn').addEventListener('click', toggleLanguage);
  
  // Suchfunktion
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', e => {
    clearTimeout(searchTimeout);
    const v = e.target.value.toLowerCase();
    searchTimeout = setTimeout(() => {
      query = v;
      if (v.length > 1) showSuggestions(v);
      else hideSuggestions();
      applyFilters();
    }, 300);
  });
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.length > 0) showSuggestions(searchInput.value);
  });
  searchInput.addEventListener('blur', () => {
    setTimeout(hideSuggestions, 200);
  });
  
  // Tastatur Shortcuts
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
    if (e.key === 'Escape') {
      searchInput.value = '';
      query = '';
      hideSuggestions();
      applyFilters();
    }
  });
  
  // Search hint chips
  document.querySelectorAll('.search-hint-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const searchTerm = chip.dataset.search;
      searchInput.value = searchTerm;
      query = searchTerm.toLowerCase();
      applyFilters();
      searchInput.focus();
    });
  });
  
  // Quick Navigation Filter
  document.getElementById('quickNav').addEventListener('click', e => {
    const card = e.target.closest('.quick-card');
    if (!card) return;
    
    const filterType = card.dataset.filter;
    
    // Reset all filter buttons
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    
    // Reset search
    query = '';
    searchInput.value = '';
    
    // Handle different filter types
    if (filterType === 'chat-text') {
      cat = 'text';
      document.querySelector(`[data-category="text"]`).classList.add('active');
    } else if (filterType === 'free') {
      cat = 'all';
      price = 'free';
      document.querySelector(`[data-scope="all"]`).classList.add('active');
    } else if (['image', 'audio', 'video', 'code'].includes(filterType)) {
      cat = filterType;
      document.querySelector(`[data-category="${filterType}"]`).classList.add('active');
    }
    
    // Update filter dropdowns
    document.getElementById('priceFilter').value = price;
    document.getElementById('sortFilter').value = sort;
    
    applyFilters();
    window.scrollTo({ top: document.querySelector('.tools-container').offsetTop - 20, behavior: 'smooth' });
  });
  
  // Filter Buttons
  document.querySelector('.compact-filters').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    
    document.querySelectorAll('.compact-filters .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    if (btn.dataset.scope === 'all') {
      cat = 'all';
    } else if (btn.dataset.category) {
      cat = btn.dataset.category;
    }
    
    applyFilters();
  });
  
  // Filter Dropdowns
  document.getElementById('priceFilter').addEventListener('change', function() {
    price = this.value;
    applyFilters();
  });
  
  document.getElementById('sortFilter').addEventListener('change', function() {
    sort = this.value;
    applyFilters();
  });
  
  // Scroll to top Button
  const scrollBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.pageYOffset > 300);
  });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== FILTER DROPDOWNS INIT =====
function initFilterDropdowns() {
  const t = translations[lang];
  
  // Price Filter
  const priceFilter = document.getElementById('priceFilter');
  priceFilter.innerHTML = `
    <option value="all">${lang === 'de' ? '💰 Alle Preise' : '💰 All prices'}</option>
    <option value="free">${lang === 'de' ? '🆓 Kostenlos' : '🆓 Free'}</option>
    <option value="paid">${lang === 'de' ? '💳 Bezahlt' : '💳 Paid'}</option>
    <option value="freemium">${lang === 'de' ? '⭐ Freemium' : '⭐ Freemium'}</option>
  `;
  priceFilter.value = price;
  
  // Sort Filter
  const sortFilter = document.getElementById('sortFilter');
  sortFilter.innerHTML = `
    <option value="votes">${lang === 'de' ? '👍 Community' : '👍 Community'}</option>
    <option value="popular">${lang === 'de' ? '🔥 Beliebt' : '🔥 Popular'}</option>
    <option value="rating">${lang === 'de' ? '⭐ Bewertung' : '⭐ Rating'}</option>
    <option value="price-low">${lang === 'de' ? '💰 Preis ↑' : '💰 Price ↑'}</option>
    <option value="price-high">${lang === 'de' ? '💰 Preis ↓' : '💰 Price ↓'}</option>
  `;
  sortFilter.value = sort;
}

// ===== DATEN SPEICHERN/LADEN =====
function loadUserVotes() {
  const saved = localStorage.getItem('aiToolsVotes');
  if (saved) {
    userVotes = JSON.parse(saved);
    // Apply saved votes to tools
    aiTools.forEach(tool => {
      if (userVotes[tool.id]) {
        tool.votes = userVotes[tool.id].votes || 0;
        tool.userVote = userVotes[tool.id].userVote || 0;
      }
    });
  }
}

function saveUserVotes() {
  const toSave = {};
  aiTools.forEach(tool => {
    if (tool.votes !== 0 || tool.userVote !== 0) {
      toSave[tool.id] = { votes: tool.votes, userVote: tool.userVote };
    }
  });
  localStorage.setItem('aiToolsVotes', JSON.stringify(toSave));
}

// ===== SUCHE & VORSCHLÄGE =====
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function showSuggestions(q) {
  const div = document.getElementById('searchSuggestions');
  const matches = aiTools.filter(t => {
    const txt = `${t.name} ${t.category} ${t.description[lang]} ${t.features.join(' ')} ${t.useCases ? t.useCases.join(' ') : ''}`.toLowerCase();
    return txt.includes(q);
  }).slice(0, 6);
  
  if (matches.length > 0) {
    div.innerHTML = matches.map(t => `
      <div class="suggestion-item" data-tool="${t.id}">
        <i class="${catIcon(t.category)} suggestion-icon"></i>
        <div class="suggestion-text">
          <div class="suggestion-name">${highlight(t.name, q)}</div>
          <div class="suggestion-meta">${catName(t.category)} • ${t.priceDisplay}</div>
        </div>
      </div>
    `).join('');
    
    div.querySelectorAll('.suggestion-item').forEach(el => {
      el.addEventListener('click', () => {
        const toolId = parseInt(el.dataset.tool);
        const tool = aiTools.find(t => t.id === toolId);
        if (tool) {
          document.getElementById('searchInput').value = tool.name;
          query = tool.name.toLowerCase();
          hideSuggestions();
          applyFilters();
          // Scroll to that tool
          setTimeout(() => {
            const toolElement = document.querySelector(`[data-id="${toolId}"]`);
            if (toolElement) {
              toolElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              toolElement.style.boxShadow = '0 0 0 2px var(--neon-cyan)';
              setTimeout(() => toolElement.style.boxShadow = '', 2000);
            }
          }, 100);
        }
      });
    });
    div.classList.add('active');
  } else {
    hideSuggestions();
  }
}

function hideSuggestions() {
  const suggestions = document.getElementById('searchSuggestions');
  if (suggestions) {
    suggestions.classList.remove('active');
  }
}

function highlight(txt, q) {
  try {
    const escapedQ = escapeRegExp(q);
    const rx = new RegExp(`(${escapedQ})`, 'gi');
    return txt.replace(rx, '<span style="color:var(--neon-cyan)">$1</span>');
  } catch (e) {
    console.warn('Regex highlight failed:', e);
    return txt;
  }
}

function catIcon(c) {
  const m = {
    text: 'fas fa-keyboard',
    image: 'fas fa-image',
    audio: 'fas fa-music',
    video: 'fas fa-video',
    code: 'fas fa-code',
    business: 'fas fa-briefcase'
  };
  return m[c] || 'fas fa-star';
}

function catName(c) {
  const m = {
    text: lang === 'de' ? 'Text' : 'Text',
    image: lang === 'de' ? 'Bilder' : 'Images',
    audio: 'Audio',
    video: 'Video',
    code: 'Code',
    business: 'Business'
  };
  return m[c] || c;
}

// ===== TOP CHARTS RENDERN =====
function renderTopCharts() {
  const container = document.getElementById('topCharts');
  if (!container) return;
  
  const t = translations[lang];
  const sortedTools = [...aiTools]
    .sort((a, b) => (b.votes + b.rating * 10) - (a.votes + a.rating * 10))
    .slice(0, 5);

  container.innerHTML = sortedTools.map((tool, index) => {
    return `
    <div class="chart-card">
      <div class="chart-header">
        <div class="chart-rank rank-${index + 1}">${index + 1}</div>
        <div class="chart-votes">
          <i class="fas fa-thumbs-up"></i>
          <span>${tool.votes}</span>
        </div>
      </div>
      <div class="chart-tool-name">${tool.name}</div>
      <div class="chart-category">${catName(tool.category)}</div>
      <div class="chart-price">${tool.priceDisplay}</div>
      <div class="chart-description">${tool.description[lang]}</div>
      <div class="chart-actions">
        <button class="vote-btn up ${tool.userVote === 1 ? 'active' : ''}" data-id="${tool.id}" data-vote="1" type="button">
          <i class="fas fa-thumbs-up"></i> ${t.helpful}
        </button>
        <button class="vote-btn down ${tool.userVote === -1 ? 'active' : ''}" data-id="${tool.id}" data-vote="-1" type="button">
          <i class="fas fa-thumbs-down"></i>
        </button>
      </div>
    </div>
  `}).join('');

  // Add vote event listeners
  container.querySelectorAll('.vote-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const toolId = parseInt(btn.dataset.id);
      const vote = parseInt(btn.dataset.vote);
      handleVote(toolId, vote);
    });
  });
}

// ===== VOTE HANDLING =====
function handleVote(toolId, vote) {
  const tool = aiTools.find(t => t.id === toolId);
  if (!tool) return;

  // Reset if clicking same vote
  if (tool.userVote === vote) {
    tool.votes -= vote;
    tool.userVote = 0;
  } else {
    // Remove previous vote if exists
    if (tool.userVote !== 0) {
      tool.votes -= tool.userVote;
    }
    tool.votes += vote;
    tool.userVote = vote;
  }

  userVotes[toolId] = { votes: tool.votes, userVote: tool.userVote };
  saveUserVotes();
  renderTopCharts();
  applyFilters();
}

// ===== FILTER & TOOL LISTE =====
function applyFilters() {
  const toolsGrid = document.getElementById('toolsGrid');
  if (!toolsGrid) return;
  
  let filtered = aiTools.filter(tool => {
    if (cat !== 'all' && tool.category !== cat) return false;
    if (price !== 'all' && tool.price !== price) return false;
    if (query) {
      const txt = `${tool.name} ${tool.category} ${tool.description[lang]} ${tool.features.join(' ')} ${tool.useCases ? t.useCases.join(' ') : ''}`.toLowerCase();
      if (!txt.includes(query)) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (sort === 'rating') return b.rating - a.rating;
    if (sort === 'votes') return (b.votes + b.rating * 10) - (a.votes + a.rating * 10);
    if (sort === 'popular') return (b.badge === 'popular' ? 1 : 0) - (a.badge === 'popular' ? 1 : 0);
    if (sort === 'price-low' || sort === 'price-high') {
      const aPrice = a.priceDisplay.includes('Free') ? 0 : 
                    parseFloat(a.priceDisplay.replace(/[^\d.]/g, '')) || 999;
      const bPrice = b.priceDisplay.includes('Free') ? 0 : 
                    parseFloat(b.priceDisplay.replace(/[^\d.]/g, '')) || 999;
      return sort === 'price-low' ? aPrice - bPrice : bPrice - aPrice;
    }
    return 0;
  });

  renderTools(filtered);
}

function renderTools(tools) {
  const grid = document.getElementById('toolsGrid');
  if (!grid) return;
  
  const t = translations[lang];
  document.getElementById('toolCount').textContent = tools.length;

  if (tools.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <h3>${t.noTitle}</h3>
        <p>${t.noMsg}</p>
        <button class="reset-btn" id="resetFiltersBtn" type="button">
          <i class="fas fa-redo"></i> ${t.resetBtn}
        </button>
      </div>
    `;
    document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);
    return;
  }

  grid.innerHTML = tools.map(tool => {
    return `
    <div class="compact-tool-row" data-id="${tool.id}">
      <div class="tool-vote-compact">
        <div class="vote-count">${tool.votes}</div>
        <div class="vote-buttons-compact">
          <button class="vote-btn-compact up ${tool.userVote === 1 ? 'active' : ''}" data-id="${tool.id}" data-vote="1" type="button">
            <i class="fas fa-thumbs-up"></i>
          </button>
          <button class="vote-btn-compact down ${tool.userVote === -1 ? 'active' : ''}" data-id="${tool.id}" data-vote="-1" type="button">
            <i class="fas fa-thumbs-down"></i>
          </button>
        </div>
      </div>
      <div class="tool-info-compact">
        <div class="tool-name-row">
          <div class="tool-name-compact">${tool.name}</div>
          <div class="tool-category-compact">${catName(tool.category)}</div>
        </div>
        <div class="tool-desc-compact">${tool.description[lang]}</div>
      </div>
      <div class="tool-meta-compact">
        <div class="tool-price-compact">${tool.priceDisplay}</div>
        <div style="display:flex;gap:8px;align-items:center;">
          <a href="${tool.link}" class="tool-link-compact" target="_blank" rel="noopener noreferrer">${t.tryNow}</a>
        </div>
      </div>
    </div>
  `}).join('');

  // Add vote event listeners
  grid.querySelectorAll('.vote-btn-compact').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const toolId = parseInt(btn.dataset.id);
      const vote = parseInt(btn.dataset.vote);
      handleVote(toolId, vote);
    });
  });
}

function resetFilters() {
  cat = 'all';
  price = 'all';
  sort = 'votes';
  query = '';
  document.getElementById('searchInput').value = '';
  document.getElementById('priceFilter').value = 'all';
  document.getElementById('sortFilter').value = 'votes';
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-scope="all"]').classList.add('active');
  applyFilters();
}
