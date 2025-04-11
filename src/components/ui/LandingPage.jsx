// src/components/ui/LandingPage.jsx

"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { Link } from "react-scroll" // For smooth scrolling within the page
import { useNavigate } from "react-router-dom" // For navigating to other routes (like /home)
import { Menu, X } from "lucide-react" // Icons for mobile menu

// --- Typewriter Component ---
const Typewriter = ({ text, className }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // Typing speed
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <motion.div className={className} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {displayText}
      <motion.span
        className="inline-block ml-1"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      >
        |
      </motion.span>
    </motion.div>
  );
};


// --- Main Landing Page Component ---
const LandingPage = () => {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // --- Framer Motion Scroll Hooks ---
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
    layoutEffect: false
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0], { clamp: false });
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9], { clamp: false });
  const heroYPos = useTransform(scrollYProgress, [0, 0.2], [0, -50], { clamp: false });
  const scrollTracer = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001, mass: 0.5 });

  // --- Navbar Scroll Background Effect ---
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Reset Scroll Position on Mount ---
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- Mobile Menu Toggle & Body Scroll Lock ---
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  // --- FAQ Accordion State & Toggle ---
  const [activeIndex, setActiveIndex] = useState(null);
  const toggleAccordion = (index) => setActiveIndex(activeIndex === index ? null : index);

  // --- Data (Features, Testimonials, FAQs, Pricing) ---
   const features = [
      { title: "User-Driven Link Addition", description: "Empower your community to contribute knowledge with our simple link-sharing system.", icon: <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> },
      { title: "Smart Filters and Search", description: "Organize and filter content by tags, categories, and custom attributes for quick access.", icon: <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg> },
      { title: "AI-Powered Contextual Search", description: "Find exactly what you need with our intelligent RAG-based search that understands context and relevance.", icon: <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
      { title: "Centralized Clean Dashboard", description: "Access all your community's shared knowledge in one beautifully designed, intuitive interface.", icon: <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
  ];
  const testimonials = [
      { name: "Priya R.", title: "Community Manager", text: "This solved our biggest community pain point." },
      { name: "Rajat K.", title: "Product Lead", text: "The AI search is mind-blowing." },
      { name: "Anjali S.", title: "Team Lead", text: "No more scrolling through chats." },
      { name: "Kunal V.", title: "Developer", text: "Love the interface!" },
      { name: "Rhea M.", title: "Content Creator", text: "Organizing links has never been easier." },
      { name: "Mohit J.", title: "UX Designer", text: "Beautifully executed platform." },
  ];
  const faqs = [
      { question: "Can I use Compendium for personal use?", answer: "While Compendium was designed with communities in mind, many individuals use it to organize their own collection of links and resources." },
      { question: "Is there a mobile version?", answer: "Yes, Compendium is fully responsive and works on all devices. We also plan to release native mobile apps for iOS and Android for an even better mobile experience." },
      { question: "What powers the AI search?", answer: "Our search is powered by a custom-built Retrieval Augmented Generation (RAG) system combined with vector embeddings that understands the context of your query and retrieves the most relevant links from your collection." },
      { question: "Can I import old links?", answer: "Yes! Compendium allows you to bulk import links from various sources including browser bookmarks, spreadsheets, and potentially directly from chat platforms in the future." },
      { question: "How secure is my data?", answer: "We employ industry-standard security measures, including encryption at rest and in transit, and regular backups, to ensure your data is always safe and protected." },
  ];
  const pricingPlans = [
      { name: "Free", price: "₹0", period: "forever", features: ["Up to 500 links", "Basic search", "3 team members", "Community support"], cta: "Get Started", popular: false },
      { name: "Pro", price: "₹299", period: "per month", features: ["Unlimited links", "AI-powered search", "Up to 20 team members", "Priority support", "Advanced analytics"], cta: "Start Free Trial", popular: true },
      { name: "Enterprise", price: "Custom", period: "pricing", features: ["Unlimited everything", "Dedicated support", "Custom integrations", "SSO & advanced security", "SLA guarantees"], cta: "Contact Sales", popular: false },
  ];

  // --- Initial Forum Topics Data ---
  const initialForumTopics = [
    {
      title: "Getting Started with Compendium",
      author: "Priya Sharma",
      replies: 3,
      lastActivity: "2 hours ago",
      category: "Guides",
      content: "I'm new to Compendium and would love to hear some tips...",
      repliesList: [
        { author: "Arjun Patel", time: "1 hour ago", content: "Welcome! Start with link organization.", likes: 12 },
        { author: "Meera Desai", time: "45 mins ago", content: "Check out the AI search feature.", likes: 8 },
        { author: "Rajat K.", time: "15 mins ago", content: "The browser extension is helpful!", likes: 5 }
      ]
    },
    {
      title: "Best Practices for Link Organization",
      author: "Rahul Verma",
      replies: 2,
      lastActivity: "5 hours ago",
      category: "Tips & Tricks",
      content: "What's everyone's favorite way to organize links?",
      repliesList: [
          { author: "Ananya Singh", time: "4 hours ago", content: "Use tags and categories.", likes: 15 },
          { author: "Vikram Reddy", time: "3 hours ago", content: "Create custom collections per project.", likes: 9 },
      ]
    },
     {
      title: "Feature Request: Dark Mode Toggle",
      author: "Sam Joshi",
      replies: 2,
      lastActivity: "1 day ago",
      category: "Feedback",
      content: "Would love an option to toggle between light and dark modes!",
      repliesList: [
          { author: "Dev Team", time: "20 hours ago", content: "Thanks, Sam! Considering it.", likes: 18 },
          { author: "Priya R.", time: "19 hours ago", content: "+1 for this!", likes: 11 },
      ]
    }
  ];

  // --- Animation Variants & Section Refs ---
  const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
  const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } } };
  const heroRef = useRef(null); const aboutRef = useRef(null); const featuresRef = useRef(null);
  const testimonialsRef = useRef(null); const pricingRef = useRef(null); const faqRef = useRef(null);
  const forumRef = useRef(null); const contactRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 });
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.1 });
  const pricingInView = useInView(pricingRef, { once: true, amount: 0.2 });
  const faqInView = useInView(faqRef, { once: true, amount: 0.2 });
  const forumInView = useInView(forumRef, { once: true, amount: 0.2 });
  const contactInView = useInView(contactRef, { once: true, amount: 0.2 });


  // --- Forum State & Handlers ---
  const [forumTopics, setForumTopics] = useState(initialForumTopics); // *** Initialize forum topics with state ***
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [newReplies, setNewReplies] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const toggleTopic = (index) => setExpandedTopic(prevIndex => (prevIndex === index ? null : index));

  const handleReplyChange = (topicIndex, value) => {
      setReplyInputs(prev => ({ ...prev, [topicIndex]: value }));
  };

  const handleAddReply = (topicIndex) => {
      const currentInput = replyInputs[topicIndex]?.trim();
      if (!currentInput) return;
      const userName = localStorage.getItem('userName') || 'You'; // Get username
      const newReply = { author: userName, time: "Just now", content: currentInput, likes: 0 };
      setNewReplies(prev => ({ ...prev, [topicIndex]: [...(prev[topicIndex] || []), newReply] }));
      setReplyInputs(prev => ({ ...prev, [topicIndex]: "" }));
       // Optionally update the main topic reply count (visual only unless saved)
       setForumTopics(prevTopics => prevTopics.map((topic, idx) =>
           idx === topicIndex ? { ...topic, replies: topic.replies + 1 } : topic
       ));
  };

  // --- State and Handlers for "Start New Discussion" Form ---
  const [isNewDiscussionFormVisible, setIsNewDiscussionFormVisible] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");
  const [newTopicCategory, setNewTopicCategory] = useState(""); // Start empty or with a default

  // *** UPDATED: Function to handle posting new discussion ***
  const handlePostNewDiscussion = (e) => {
      e.preventDefault(); // Prevent page reload
      const title = newTopicTitle.trim();
      const content = newTopicContent.trim();
      const category = newTopicCategory.trim() || "General"; // Default category if empty
      const userName = localStorage.getItem('userName') || 'Anonymous'; // Get username

      if (!title || !content) {
          alert("Please enter both a title and content for your discussion.");
          return;
      }

      // Create the new topic object
      const newTopic = {
          title,
          author: userName,
          replies: 0,             // New topics start with 0 replies
          lastActivity: "Just now", // Set current time indicator
          category,
          content,
          repliesList: []       // New topics start with an empty replies list
      };

      // Update the forumTopics state to include the new topic at the beginning
      setForumTopics(prevTopics => [newTopic, ...prevTopics]);

      // Reset form fields and hide the form
      setNewTopicTitle("");
      setNewTopicContent("");
      setNewTopicCategory(""); // Reset category as well
      setIsNewDiscussionFormVisible(false);

      // Optional: Provide user feedback
      // alert("New discussion posted!"); // You might want a more subtle notification
  };


  // --- Navigation Handlers ---
  const handleGetStarted = () => navigate('/home');
  const handleViewProduct = () => navigate('/home');


  // --- Navigation Links Data Structure ---
  const navLinks = [
    { to: "home", label: "Home" },
    { to: "about", label: "About Us" },
    { to: "features", label: "Features" },
    { to: "testimonials", label: "Testimonials" },
    { to: "pricing", label: "Pricing" },
    { to: "faq", label: "FAQs" },
    { to: "forum", label: "Forum" },
    { to: "contact", label: "Contact" },
  ];


  // --- JSX Render ---
  return (
    <div className="bg-transparent text-white min-h-screen font-['IBM_Plex_Mono',monospace] selection:bg-[#8483ec] selection:text-black">

      {/* --- Fixed Background Elements --- */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#080808] via-[#0a0a0a] to-[#080808]"></div>
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(hsl(0 0% 100% / 0.5) 0.5px, transparent 0.5px), linear-gradient(90deg, hsl(0 0% 100% / 0.5) 0.5px, transparent 0.5px)`, backgroundSize: "40px 40px" }}></div>
        </div>
      </div>

      {/* --- Scroll Progress Tracer --- */}
      <motion.div className="fixed left-2 md:left-4 top-0 bottom-0 w-1 origin-top z-50" style={{ scaleY: scrollTracer, background: 'linear-gradient(to bottom, #6366f1, #8b5cf6, #d946ef)', opacity: 0.6 }}>
        <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef] shadow-[0_0_15px_6px_rgba(139,92,246,0.4)]" animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7], boxShadow: ["0 0 15px 6px rgba(139,92,246,0.4)", "0 0 25px 10px rgba(139,92,246,0.5)", "0 0 15px 6px rgba(139,92,246,0.4)"] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
      </motion.div>


      {/* --- Main Content Wrapper --- */}
      <div className="relative z-10">

        {/* --- Navbar --- */}
        <nav className={`fixed w-full z-40 transition-all duration-300 ease-in-out ${isScrolled ? "py-2" : "py-4"}`}>
          <div className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out ${isScrolled ? "max-w-6xl bg-black/30 backdrop-blur-lg rounded-full shadow-lg py-2" : "max-w-none bg-transparent rounded-none py-0"}`}>
            <div className="flex items-center justify-between h-14">
              <Link to="home" spy={true} smooth={true} duration={500} offset={-100} className="flex-shrink-0 flex items-center cursor-pointer" title="Scroll to Top">
                <img src="/compendium-transparent.png" alt="Compendium" className="h-10 w-auto" />
              </Link>
              <div className="hidden md:flex items-center space-x-5 lg:space-x-7">
                {navLinks.map((link) => ( <Link key={link.to} to={link.to} spy={true} smooth={true} duration={500} offset={-70} className="text-sm lg:text-base text-gray-300 cursor-pointer transition-colors relative group hover:text-white" activeClass="text-[#8483ec] font-medium">{link.label}<span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#8483ec] transition-all duration-300 group-hover:w-full"></span></Link> ))}
              </div>
              <div className="flex items-center space-x-3">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleViewProduct} className="hidden sm:inline-block bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-5 py-2 rounded-full text-sm font-medium shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] transition-all text-white"> View Product </motion.button>
                <div className="md:hidden">
                  <button onClick={toggleMobileMenu} className="text-gray-300 hover:text-white focus:outline-none p-2 rounded-md hover:bg-white/10 transition-colors" aria-label="Toggle menu" aria-expanded={isMobileMenuOpen}> <Menu size={26} /> </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* --- Full Screen Mobile Menu (Animated) --- */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div key="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md h-dvh w-screen flex flex-col items-center justify-center space-y-5 font-['IBM_Plex_Mono',monospace] md:hidden">
              <button onClick={closeMobileMenu} className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-md hover:bg-white/10 transition-colors" aria-label="Close menu"> <X size={30} /> </button>
              {navLinks.map((link) => ( <Link key={`mobile-${link.to}`} to={link.to} spy={true} smooth={true} duration={500} offset={-70} className="block text-2xl text-gray-300 cursor-pointer transition-colors hover:text-white py-2" onClick={closeMobileMenu}> {link.label} </Link> ))}
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { handleViewProduct(); closeMobileMenu(); }} className="mt-6 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-8 py-3 rounded-full text-lg font-medium shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] transition-shadow text-white"> View Product </motion.button>
            </motion.div>
          )}
        </AnimatePresence>


        {/* --- Hero Section (id="home") --- */}
        <section ref={heroRef} id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16">
          <motion.div className="absolute inset-0 z-[-1]" style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}>
            <motion.div animate={{ x: [0, 10, 0], y: [0, -15, 0], opacity: [0.4, 0.6, 0.4] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute top-1/4 left-1/4 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] rounded-full bg-gradient-to-r from-[#6366f1]/15 to-[#d946ef]/15 blur-3xl"></motion.div>
            <motion.div animate={{ x: [0, -20, 0], y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }} className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-r from-[#8b5cf6]/15 to-[#6366f1]/15 blur-3xl"></motion.div>
          </motion.div>
          <motion.div style={{ opacity: heroOpacity, scale: heroScale, y: heroYPos }} className="container mx-auto px-6 z-10 text-center">
            <motion.div initial="hidden" animate={heroInView ? "visible" : "hidden"} variants={staggerContainer} className="max-w-4xl mx-auto">
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight text-white">
                  <Typewriter text="Where Shared Links Live Forever" className="" />
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"> Compendium helps communities organize and retrieve shared knowledge with ease. </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleGetStarted} className="w-full sm:w-auto bg-[#8483ec] px-8 py-3 rounded-full text-base sm:text-lg font-medium shadow-[0_0_20px_rgba(132,131,236,0.4)] hover:shadow-[0_0_30px_rgba(132,131,236,0.6)] transition-shadow"> Get Started For Free </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleViewProduct} className="w-full sm:w-auto bg-transparent border-2 border-white px-8 py-3 rounded-full text-base sm:text-lg font-medium hover:bg-white/10 transition-colors"> View Our Product </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:block">
            <Link to="about" spy={true} smooth={true} duration={500} offset={-70} className="cursor-pointer">
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}> <svg className="w-8 h-8 text-gray-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg> </motion.div>
            </Link>
          </div>
        </section>


        {/* --- About Section (id="about") --- */}
        <section ref={aboutRef} id="about" className="py-16 md:py-24 relative">
           <motion.div initial="hidden" animate={aboutInView ? "visible" : "hidden"} variants={fadeInUp} className="max-w-5xl mx-auto px-6 md:px-8 text-center md:text-left">
             <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Built for <span className="text-[#8483ec]">Communities</span>, by a <span className="text-[#8483ec]">Community</span></h2>
             <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto md:mx-0">Compendium was born out of a simple problem faced in every WhatsApp or online group—shared links get lost in endless chats. We built a centralized tool that stores, categorizes, and intelligently retrieves links so knowledge never gets buried again.</p>
           </motion.div>
        </section>


        {/* --- Features Section (id="features") --- */}
        <section ref={featuresRef} id="features" className="py-16 md:py-24 relative bg-black/10">
            <div className="container mx-auto px-6 md:px-8">
                <motion.div initial="hidden" animate={featuresInView ? "visible" : "hidden"} variants={fadeInUp} className="mb-12 md:mb-16 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Powerful <span className="text-[#8483ec]">Features</span></h2>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto md:mx-0">Compendium comes packed with tools designed to make knowledge sharing and retrieval effortless.</p>
                </motion.div>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10" initial="hidden" animate={featuresInView ? "visible" : "hidden"} variants={staggerContainer}>
                    {features.map((feature, index) => ( <motion.div key={index} variants={fadeInUp} whileHover={{ y: -8, boxShadow: "0 10px 30px rgba(132, 131, 236, 0.2)" }} className="bg-[#0f0f0f] p-6 md:p-8 rounded-2xl border border-[#8483ec]/20 transition-all duration-300 flex flex-col sm:flex-row items-start gap-5 sm:gap-6"> <div className="text-[#8483ec] flex-shrink-0 mt-1">{feature.icon}</div> <div> <h3 className="text-xl md:text-2xl font-bold mb-3">{feature.title}</h3> <p className="text-gray-300 text-base md:text-lg leading-relaxed">{feature.description}</p> </div> </motion.div> ))}
                </motion.div>
           </div>
        </section>


        {/* --- Testimonials Section (id="testimonials") --- */}
        <section ref={testimonialsRef} id="testimonials" className="py-16 md:py-24 relative overflow-hidden">
          <div className="container mx-auto px-6 md:px-8">
              <motion.div initial="hidden" animate={testimonialsInView ? "visible" : "hidden"} variants={fadeInUp} className="mb-12 md:mb-16 text-center md:text-left">
                 <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">What Our <span className="text-[#8483ec]">Users Say</span></h2>
                 <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto md:mx-0">Don't just take our word for it. Here's what people are saying about Compendium.</p>
               </motion.div>
           </div>
           <div className="relative flex overflow-hidden group" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
               <motion.div className="flex gap-6 md:gap-8 py-6 flex-shrink-0" animate={{ x: ["0%", "-100%"] }} transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 45, ease: "linear" } }}>
                   {[...testimonials, ...testimonials].map((testimonial, index) => ( <motion.div key={`testimonial-${index}`} className="w-[300px] sm:w-[350px] flex-shrink-0 bg-[#0f0f0f]/50 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-[#8483ec]/20 flex flex-col group-hover:[animation-play-state:paused]"> <div className="flex-1 mb-4"> <p className="text-lg md:text-xl italic text-gray-300">"{testimonial.text}"</p> </div> <div> <h4 className="text-base md:text-lg font-bold">{testimonial.name}</h4> <p className="text-[#8483ec] text-sm md:text-base">{testimonial.title}</p> </div> </motion.div> ))}
               </motion.div>
           </div>
        </section>


        {/* --- Pricing Section (id="pricing") --- */}
        <section ref={pricingRef} id="pricing" className="py-16 md:py-24 relative bg-black/10">
            <div className="container mx-auto px-6 md:px-8">
                <motion.div initial="hidden" animate={pricingInView ? "visible" : "hidden"} variants={fadeInUp} className="mb-12 md:mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Choose the Right <span className="text-[#8483ec]">Plan for You</span></h2>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">Choose the plan that works best for your team. All plans include core features.</p>
                </motion.div>
                <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 max-w-6xl mx-auto items-stretch" initial="hidden" animate={pricingInView ? "visible" : "hidden"} variants={staggerContainer}>
                    {pricingPlans.map((plan, index) => (
                        <motion.div key={index} variants={fadeInUp} whileHover={{ y: -10 }} className={`relative flex flex-col bg-[#0f0f0f] rounded-2xl overflow-visible transition-all duration-300 ${ plan.popular ? "border-2 border-[#8483ec] shadow-[0_0_35px_rgba(132,131,236,0.25)] scale-100 lg:scale-105 z-10 mt-6 lg:mt-0" : "border border-[#8483ec]/20 mt-0" }`}>
                            {plan.popular && ( <div className="absolute top-[-0.875rem] left-1/2 -translate-x-1/2 bg-[#8483ec] px-4 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg z-20 whitespace-nowrap text-white"> Most Popular </div> )}
                            <div className={`p-6 md:p-8 ${plan.popular ? 'pt-10 md:pt-12' : 'pt-8'} flex flex-col flex-grow`}>
                                <h3 className="text-2xl font-bold mb-2 text-center">{plan.name}</h3>
                                <div className="mb-6 text-center"> <span className="text-4xl font-bold">{plan.price}</span> <span className="text-gray-400 text-sm">/{plan.period}</span> </div>
                                <ul className="mb-8 space-y-3 flex-grow"> {plan.features.map((feature, i) => ( <li key={i} className="flex items-center text-base"> <svg className="w-5 h-5 text-[#8483ec] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> <span className="text-gray-300">{feature}</span> </li> ))} </ul>
                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className={`w-full mt-auto py-3 rounded-lg font-medium text-base transition-colors ${ plan.popular ? "bg-[#8483ec] text-white hover:bg-opacity-90" : "bg-white/10 text-white hover:bg-white/20" }`}> {plan.cta} </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
           </div>
        </section>


        {/* --- FAQ Section (id="faq") --- */}
        <section ref={faqRef} id="faq" className="py-16 md:py-24 relative">
           <div className="container mx-auto px-6 md:px-8">
               <motion.div initial="hidden" animate={faqInView ? "visible" : "hidden"} variants={fadeInUp} className="mb-12 md:mb-16 text-center">
                 <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Frequently Asked <span className="text-[#8483ec]">Questions</span></h2>
                 <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">Got Questions? Answers below. Still need help? Our team is just a click away.</p>
               </motion.div>
               <div className="max-w-3xl mx-auto">
                 {faqs.map((faq, index) => (
                   <motion.div key={index} initial="hidden" animate={faqInView ? "visible" : "hidden"} variants={fadeInUp} transition={{ delay: index * 0.05 }} className="mb-4 overflow-hidden rounded-lg border border-[#8483ec]/20 bg-[#0f0f0f]">
                     <button onClick={() => toggleAccordion(index)} className={`flex justify-between items-center w-full p-4 md:p-5 text-left transition-colors duration-200 hover:bg-white/5 ${activeIndex === index ? "bg-white/5" : ""}`} aria-expanded={activeIndex === index} aria-controls={`faq-content-${index}`}>
                       <span className="text-base md:text-lg font-medium flex-1 pr-4">{faq.question}</span>
                       <motion.div animate={{ rotate: activeIndex === index ? 180 : 0 }} transition={{ duration: 0.3 }}> <svg className="w-5 h-5 md:w-6 md:h-6 text-[#8483ec] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg> </motion.div>
                     </button>
                     <AnimatePresence initial={false}>
                       {activeIndex === index && (
                         <motion.div id={`faq-content-${index}`} key="content" initial="collapsed" animate="open" exit="collapsed" variants={{ open: { opacity: 1, height: "auto", marginTop: '0px' }, collapsed: { opacity: 0, height: 0, marginTop: '-1px' } }} transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }} className="overflow-hidden">
                           <div className="p-4 md:p-5 text-gray-300 text-base border-t border-[#8483ec]/20 leading-relaxed"> {faq.answer} </div>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </motion.div>
                 ))}
             </div>
           </div>
        </section>


        {/* --- Discussion Forum Section (id="forum") --- */}
        <section ref={forumRef} id="forum" className="py-16 md:py-24 relative bg-black/10">
            <div className="container mx-auto px-6 md:px-8">
                {/* Section Header */}
                <motion.div
                  initial="hidden"
                  animate={forumInView ? "visible" : "hidden"}
                  variants={fadeInUp}
                  className="mb-12 md:mb-16 text-center md:text-left"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Community <span className="text-[#8483ec]">Discussion</span></h2>
                    <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto md:mx-0">Join the conversation and share your experiences with Compendium.</p>
                </motion.div>

                {/* Forum Topics Grid */}
                <motion.div
                  className="max-w-4xl mx-auto grid gap-6"
                  initial="hidden"
                  animate={forumInView ? "visible" : "hidden"}
                  variants={staggerContainer}
                >
                    {/* Map over the forumTopics STATE variable */}
                    {forumTopics.map((topic, index) => (
                        <motion.div
                          key={index} // Key for list rendering
                          variants={fadeInUp} // Animation variant for each topic card
                          className="bg-[#0f0f0f]/50 backdrop-blur-sm rounded-2xl border border-[#8483ec]/20 transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(132,131,236,0.15)] overflow-hidden" // Added hover shadow and overflow hidden
                        >
                            {/* Clickable Topic Header */}
                            <div
                              className="p-5 md:p-6 cursor-pointer hover:bg-white/5 transition-colors"
                              onClick={() => toggleTopic(index)} // Toggle replies visibility
                              role="button" // Accessibility
                              aria-expanded={expandedTopic === index}
                              aria-controls={`forum-replies-${index}`}
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-[#a9a8ff] transition-colors">{topic.title}</h3>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-400">
                                            <span>by <span className="font-medium text-gray-300">{topic.author}</span></span>
                                            <span className="hidden sm:inline">•</span>
                                            <span>{topic.replies + (newReplies[index]?.length || 0)} replies</span> {/* Dynamic reply count */}
                                            <span className="hidden sm:inline">•</span>
                                            <span className="whitespace-nowrap">{topic.lastActivity}</span>
                                        </div>
                                    </div>
                                    <span className="flex-shrink-0 mt-1 sm:mt-0 px-3 py-1 bg-[#8483ec]/15 text-[#c0b7e8] rounded-full text-xs sm:text-sm font-medium">{topic.category}</span>
                                </div>
                                <p className="mt-3 md:mt-4 text-gray-300 text-base line-clamp-2">{topic.content}</p>
                            </div>

                            {/* Expanded Replies Section (Animated) */}
                            <AnimatePresence initial={false}>
                                {expandedTopic === index && (
                                    <motion.div
                                        id={`forum-replies-${index}`}
                                        key="content"
                                        initial="collapsed"
                                        animate="open"
                                        exit="collapsed"
                                        variants={{ open: { opacity: 1, height: "auto" }, collapsed: { opacity: 0, height: 0 } }}
                                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        className="border-t border-[#8483ec]/20 overflow-hidden"
                                    >
                                        <div className="p-5 md:p-6 space-y-4 bg-black/40">
                                            <h4 className="text-base font-semibold text-gray-300 mb-1">Replies:</h4>
                                            {/* Render Existing Replies */}
                                            {topic.repliesList && topic.repliesList.length > 0 ? (
                                                topic.repliesList.map((reply, replyIndex) => (
                                                    <div key={`existing-${replyIndex}`} className="bg-[#141417]/60 p-4 rounded-lg border border-white/10">
                                                        <div className="flex justify-between items-start mb-2 gap-2"> <span className="font-medium text-[#a7a6ff] text-sm sm:text-base">{reply.author}</span> <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">{reply.time}</span> </div>
                                                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{reply.content}</p>
                                                        <div className="flex items-center mt-2 text-sm text-gray-400"> <motion.button whileTap={{ scale: 0.9 }} className="flex items-center hover:text-white transition-colors p-1 -ml-1"> <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> {reply.likes} </motion.button> </div>
                                                    </div>
                                                ))
                                            ) : (!newReplies[index]?.length && <p className="text-sm text-gray-500 italic">No replies yet.</p>)}
                                            {/* Render New Replies */}
                                            {newReplies[index]?.map((reply, replyIndex) => (
                                                <div key={`new-${replyIndex}`} className="bg-[#1f1f23]/60 p-4 rounded-lg border border-[#8483ec]/20 animate-pulse-once">
                                                    <div className="flex justify-between items-start mb-2 gap-2"> <span className="font-medium text-[#c0b7e8] text-sm sm:text-base">{reply.author}</span> <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">{reply.time}</span> </div>
                                                    <p className="text-gray-200 text-sm sm:text-base leading-relaxed">{reply.content}</p>
                                                    <div className="flex items-center mt-2 text-sm text-gray-400"> <motion.button whileTap={{ scale: 0.9 }} className="flex items-center hover:text-white transition-colors p-1 -ml-1"> <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> {reply.likes} </motion.button> </div>
                                                </div>
                                            ))}
                                            {/* Reply Input Form */}
                                            <div className="flex items-center space-x-3 pt-4 mt-2 border-t border-white/10">
                                                <input type="text" value={replyInputs[index] || ""} onChange={(e) => handleReplyChange(index, e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter' && replyInputs[index]?.trim()) handleAddReply(index); }} placeholder="Write a reply..." className="flex-1 bg-[#141417] text-white px-4 py-2 rounded-lg border border-[#8483ec]/30 focus:border-[#8483ec] focus:ring-1 focus:ring-[#8483ec] outline-none transition-all text-sm sm:text-base placeholder-gray-500" aria-label={`Reply to ${topic.title}`} />
                                                <motion.button onClick={() => handleAddReply(index)} whileTap={{ scale: 0.95 }} disabled={!replyInputs[index]?.trim()} className="bg-[#8483ec] px-4 py-2 rounded-lg text-white hover:bg-opacity-90 transition-colors text-sm sm:text-base font-medium flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"> Reply </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>

                {/* --- Button to Trigger New Discussion Form --- */}
                <motion.div
                  className="text-center mt-12"
                  initial="hidden"
                  animate={forumInView ? "visible" : "hidden"}
                  variants={fadeInUp}
                >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsNewDiscussionFormVisible(true)} // Show the form
                      className="bg-[#8483ec] px-8 py-3 rounded-full text-base sm:text-lg font-medium shadow-[0_0_20px_rgba(132,131,236,0.4)] hover:shadow-[0_0_30px_rgba(132,131,236,0.6)] transition-shadow"
                    >
                      Start New Discussion
                    </motion.button>
                </motion.div>

                {/* --- Start New Discussion Form Section (Animated) --- */}
                <AnimatePresence>
                    {isNewDiscussionFormVisible && (
                        <motion.div
                            key="new-discussion-form"
                            initial={{ opacity: 0, y: 30 }} // Start slightly lower and faded out
                            animate={{ opacity: 1, y: 0 }} // Animate to full opacity and original position
                            exit={{ opacity: 0, y: 30 }} // Animate out downwards
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="max-w-3xl mx-auto mt-12 bg-[#0f0f0f]/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-[#8483ec]/30 shadow-lg"
                         >
                            <h3 className="text-xl md:text-2xl font-bold mb-4 text-center text-white">Start a New Discussion</h3>
                            <p className="text-center text-gray-400 mb-6 text-sm md:text-base">Share your thoughts or ask a question.</p>
                            <form onSubmit={handlePostNewDiscussion} className="space-y-5">
                                <div>
                                    <label htmlFor="new-topic-title" className="block mb-2 text-sm font-medium text-gray-300">Discussion Title</label>
                                    <input
                                        type="text"
                                        id="new-topic-title"
                                        value={newTopicTitle}
                                        onChange={(e) => setNewTopicTitle(e.target.value)}
                                        required
                                        className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-[#8483ec]/30 focus:ring-1 focus:ring-[#8483ec] focus:border-[#8483ec] outline-none transition-colors text-white placeholder-gray-500"
                                        placeholder="Enter a clear and concise title"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new-topic-category" className="block mb-2 text-sm font-medium text-gray-300">Category (Optional)</label>
                                    <input
                                        type="text"
                                        id="new-topic-category"
                                        value={newTopicCategory}
                                        onChange={(e) => setNewTopicCategory(e.target.value)}
                                        className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-[#8483ec]/30 focus:ring-1 focus:ring-[#8483ec] focus:border-[#8483ec] outline-none transition-colors text-white placeholder-gray-500"
                                        placeholder="e.g., General, Feedback, Tips"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="new-topic-content" className="block mb-2 text-sm font-medium text-gray-300">Your Message</label>
                                    <textarea
                                        id="new-topic-content"
                                        rows={5}
                                        value={newTopicContent}
                                        onChange={(e) => setNewTopicContent(e.target.value)}
                                        required
                                        className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-[#8483ec]/30 focus:ring-1 focus:ring-[#8483ec] focus:border-[#8483ec] outline-none transition-colors text-white placeholder-gray-500 resize-none"
                                        placeholder="Start typing your discussion here..."
                                    ></textarea>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                        type="submit"
                                        className="w-full sm:w-auto flex-1 order-1 sm:order-2 py-2.5 px-6 bg-[#8483ec] rounded-lg font-medium text-base shadow-[0_4px_15px_rgba(132,131,236,0.2)] hover:shadow-[0_6px_25px_rgba(132,131,236,0.3)] hover:bg-opacity-90 transition-all"
                                    >
                                        Post Discussion
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                        type="button" // Important: type="button" prevents form submission
                                        onClick={() => setIsNewDiscussionFormVisible(false)} // Hide form on cancel
                                        className="w-full sm:w-auto order-2 sm:order-1 py-2.5 px-6 bg-gray-600/40 hover:bg-gray-500/50 rounded-lg font-medium text-base text-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                </div>
                            </form>
                         </motion.div>
                    )}
                </AnimatePresence>
                {/* --- End New Discussion Form --- */}

           </div>

           {/* Add custom animation style for new replies */}
           <style jsx>{`
             @keyframes pulse-once {
               0% { opacity: 0.6; transform: scale(0.98); }
               50% { opacity: 1; transform: scale(1.02); }
               100% { opacity: 1; transform: scale(1); }
             }
             .animate-pulse-once {
               animation: pulse-once 0.6s ease-out;
             }
           `}</style>
        </section>


        {/* --- Contact Section (id="contact") --- */}
        <section ref={contactRef} id="contact" className="py-16 md:py-24 relative">
            <div className="container mx-auto px-6 md:px-8">
               <motion.div initial="hidden" animate={contactInView ? "visible" : "hidden"} variants={fadeInUp} className="mb-12 md:mb-16 text-center">
                 <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Get In <span className="text-[#8483ec]">Touch</span></h2>
                 <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">Have questions or want to learn more? Reach out to our team, and we will get back to you as soon as possible.</p>
               </motion.div>
               <motion.div initial="hidden" animate={contactInView ? "visible" : "hidden"} variants={fadeInUp} className="max-w-3xl mx-auto bg-[#0f0f0f] p-6 md:p-10 rounded-2xl border border-[#8483ec]/20 shadow-xl">
                 <form className="space-y-6">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div><label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300">Your Name</label><input type="text" id="name" name="name" autoComplete="name" className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-[#8483ec]/30 focus:ring-1 focus:ring-[#8483ec] focus:border-[#8483ec] outline-none transition-colors text-white placeholder-gray-500" required placeholder="Enter your full name" /></div>
                       <div><label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Your Email</label><input type="email" id="email" name="email" autoComplete="email" className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-[#8483ec]/30 focus:ring-1 focus:ring-[#8483ec] focus:border-[#8483ec] outline-none transition-colors text-white placeholder-gray-500" required placeholder="you@example.com" /></div>
                   </div>
                   <div><label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-300">Your Message</label><textarea id="message" name="message" rows={5} className="w-full p-3 bg-[#1a1a1a] rounded-lg border border-[#8483ec]/30 focus:ring-1 focus:ring-[#8483ec] focus:border-[#8483ec] outline-none transition-colors text-white placeholder-gray-500 resize-none" required placeholder="How can we help?"></textarea></div>
                   <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full py-3 bg-[#8483ec] rounded-lg font-medium text-base shadow-[0_5px_20px_rgba(132,131,236,0.25)] hover:shadow-[0_8px_30px_rgba(132,131,236,0.35)] hover:bg-opacity-90 transition-all">Send Message</motion.button>
                 </form>
               </motion.div>
                <motion.div initial="hidden" animate={contactInView ? "visible" : "hidden"} variants={fadeInUp} transition={{ delay: 0.2 }} className="flex justify-center mt-12 space-x-6">
                   <motion.a href="#" target="_blank" rel="noopener noreferrer" whileHover={{ y: -4, color: "#8483ec" }} className="text-gray-400 transition-colors" aria-label="Twitter"><svg className="h-6 w-6 md:h-7 md:w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></motion.a>
                   <motion.a href="#" target="_blank" rel="noopener noreferrer" whileHover={{ y: -4, color: "#8483ec" }} className="text-gray-400 transition-colors" aria-label="Github"><svg className="h-6 w-6 md:h-7 md:w-7" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg></motion.a>
                   <motion.a href="#" target="_blank" rel="noopener noreferrer" whileHover={{ y: -4, color: "#8483ec" }} className="text-gray-400 transition-colors" aria-label="LinkedIn"><svg className="h-6 w-6 md:h-7 md:w-7" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg></motion.a>
                </motion.div>
           </div>
        </section>

      </div> {/* End Main Content Relative Wrapper */}

      {/* --- Footer Section --- */}
      <footer className="py-12 md:py-16 bg-black/20 backdrop-blur-sm border-t border-[#8483ec]/15">
         <div className="container mx-auto px-6 md:px-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
             <div className="col-span-2 sm:col-span-1 text-center sm:text-left">
               <Link to="home" spy={true} smooth={true} duration={500} offset={-100} className="inline-block mb-4 cursor-pointer">
                  <img src="/compendium-transparent.png" alt="Compendium" className="h-10 md:h-12 w-auto mx-auto sm:mx-0" />
               </Link>
               <p className="text-sm text-gray-400">Where shared links live forever.</p>
             </div>
             <div>
               <h3 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Product</h3>
               <ul className="space-y-2">
                 <li><Link to="features" spy={true} smooth={true} duration={500} offset={-70} className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Features</Link></li>
                 <li><Link to="pricing" spy={true} smooth={true} duration={500} offset={-70} className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Pricing</Link></li>
                 <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Documentation</a></li>
               </ul>
             </div>
             <div>
               <h3 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Company</h3>
               <ul className="space-y-2">
                 <li><Link to="about" spy={true} smooth={true} duration={500} offset={-70} className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">About</Link></li>
                 <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</a></li>
                 <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Careers</a></li>
               </ul>
             </div>
             <div>
               <h3 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Legal</h3>
               <ul className="space-y-2">
                 <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                 <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                 <li><Link to="contact" spy={true} smooth={true} duration={500} offset={-70} className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Contact</Link></li>
               </ul>
             </div>
           </div>
           <div className="mt-10 pt-8 border-t border-[#8483ec]/15 text-center">
             <p className="text-sm text-gray-500">
               © {new Date().getFullYear()} Compendium. All rights reserved.
             </p>
           </div>
         </div>
      </footer>

      {/* --- Global Styles (Font Import, Scroll Behavior, etc.) --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

        html {
          scroll-behavior: smooth; /* Enable smooth scrolling for anchor links */
          scroll-padding-top: 80px; /* Offset for fixed header during scroll-snap */
        }

        body {
          font-family: 'IBM Plex Mono', monospace;
          background-color: #0a0a0a; /* Base background color */
          -webkit-font-smoothing: antialiased; /* Smoother fonts on WebKit */
          -moz-osx-font-smoothing: grayscale; /* Smoother fonts on Firefox */
        }

        /* Optional Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #18181b; } /* Darker track */
        ::-webkit-scrollbar-thumb { background-color: #3f3f46; border-radius: 4px; } /* Neutral thumb */
        ::-webkit-scrollbar-thumb:hover { background-color: #52525b; } /* Lighter on hover */

        /* Style for react-scroll active link highlight */
        .text-\\[\\#8483ec\\] {
           color: #8483ec !important; /* Force active color if Tailwind class is overridden */
        }
        .font-medium.text-\\[\\#8483ec\\] {
            font-weight: 600 !important; /* Example: Make active link bolder */
        }
      `}</style>
    </div>
  )
}

export default LandingPage;