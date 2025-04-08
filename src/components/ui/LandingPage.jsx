"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { Link } from "react-scroll"
import { useNavigate } from "react-router-dom"

// Typewriter component
const Typewriter = ({ text, className }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <motion.h2 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        |
      </motion.span>
    </motion.h2>
  );
};

const LandingPage = () => {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
    layoutEffect: false
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0], {
    clamp: false
  })
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9], {
    clamp: false
  })
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50], {
    clamp: false
  })

  // Smooth scroll tracer
  const scroller = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
    mass: 0.5
  })

  // Handle navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Reset scroll position on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // FAQ accordion state
  const [activeIndex, setActiveIndex] = useState(null)

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  // Features data
  const features = [
    {
      title: "User-Driven Link Addition",
      description: "Empower your community to contribute knowledge with our simple link-sharing system.",
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
    },
    {
      title: "Smart Filters and Search",
      description: "Organize and filter content by tags, categories, and custom attributes for quick access.",
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      ),
    },
    {
      title: "AI-Powered Contextual Search",
      description:
        "Find exactly what you need with our intelligent RAG-based search that understands context and relevance.",
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      title: "Centralized Clean Dashboard",
      description: "Access all your community's shared knowledge in one beautifully designed, intuitive interface.",
      icon: (
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
  ]

  // Update testimonials data
  const testimonials = [
    {
      name: "Priya R.",
      title: "Community Manager",
      text: "This solved our biggest community pain point.",
    },
    {
      name: "Rajat K.",
      title: "Product Lead",
      text: "The AI search is mind-blowing.",
    },
    {
      name: "Anjali S.",
      title: "Team Lead",
      text: "No more scrolling through chats.",
    },
    {
      name: "Kunal V.",
      title: "Developer",
      text: "Love the interface!",
    },
    {
      name: "Rhea M.",
      title: "Content Creator",
      text: "Organizing links has never been easier.",
    },
    {
      name: "Mohit J.",
      title: "UX Designer",
      text: "Beautifully executed platform.",
    },
    {
      name: "Sneha D.",
      title: "Marketing Head",
      text: "Increased productivity across teams.",
    },
    {
      name: "Vikram A.",
      title: "Project Manager",
      text: "Seamless integration with our existing tools.",
    },
    {
      name: "Divya Patel",
      title: "Data Analyst",
      text: "The analytics dashboard provides valuable insights.",
    },
    {
      name: "Aryan Singh",
      title: "Software Engineer",
      text: "Easy to use and highly efficient.",
    },
  ]

  // FAQ data
  const faqs = [
    {
      question: "Can I use Compendium for personal use?",
      answer:
        "While Compendium was designed with communities in mind, many individuals use it to organize their own collection of links and resources.",
    },
    {
      question: "Is there a mobile version?",
      answer:
        "Yes, Compendium is fully responsive and works on all devices. We also have native mobile apps for iOS and Android for an even better mobile experience.",
    },
    {
      question: "What powers the AI search?",
      answer:
        "Our search is powered by a custom-built Retrieval Augmented Generation (RAG) system that understands the context of your query and retrieves the most relevant links from your collection.",
    },
    {
      question: "Can I import old links?",
      answer:
        "Yes! Compendium allows you to bulk import links from various sources including browser bookmarks, spreadsheets, and even directly from chat platforms like WhatsApp and Telegram.",
    },
    {
      question: "How secure is my data?",
      answer:
        "We employ industry-standard security measures, including encryption and regular backups, to ensure your data is always safe and protected.",
    },
    {
      question: "Is there a limit to the number of links I can store?",
      answer:
        "The number of links you can store depends on your chosen pricing plan. Our Pro and Enterprise plans offer unlimited link storage.",
    },
    
    {
      question: "What kind of support do you offer?",
      answer:
        "We offer comprehensive support through email, chat, and a detailed knowledge base. Priority support is available for Pro and Enterprise users.",
    },
  ]

  // Pricing plans
  const pricingPlans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      features: ["Up to 500 links", "Basic search", "3 team members", "Community support"],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "₹299",
      period: "per month",
      features: [
        "Unlimited links",
        "AI-powered search",
        "Up to 20 team members",
        "Priority support",
        "Advanced analytics",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      features: [
        "Unlimited everything",
        "Dedicated support",
        "Custom integrations",
        "SSO & advanced security",
        "SLA guarantees",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  // Refs for section animations
  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const featuresRef = useRef(null)
  const testimonialsRef = useRef(null)
  const pricingRef = useRef(null)
  const faqRef = useRef(null)
  const forumRef = useRef(null)
  const contactRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 })
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 })
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.3 })
  const pricingInView = useInView(pricingRef, { once: true, amount: 0.3 })
  const faqInView = useInView(faqRef, { once: true, amount: 0.3 })
  const forumInView = useInView(forumRef, { once: true, amount: 0.3 })
  const contactInView = useInView(contactRef, { once: true, amount: 0.3 })

  // Update forum topics data to include avatars
  const forumTopics = [
    {
      title: "Getting Started with Compendium",
      author: "Priya Sharma",
      replies: 24,
      lastActivity: "2 hours ago",
      category: "Guides",
      content: "I'm new to Compendium and would love to hear some tips on how to get started. What features should I explore first?",
      repliesList: [
        {
          author: "Arjun Patel",
          time: "1 hour ago",
          content: "Welcome! I'd recommend starting with the link organization features. They're super intuitive and will help you get the most out of Compendium right away.",
          likes: 12,
        },
        {
          author: "Meera Desai",
          time: "45 minutes ago",
          content: "Don't forget to check out the AI search feature - it's a game changer for finding specific content in your collection.",
          likes: 8,
        }
      ]
    },
    {
      title: "Best Practices for Link Organization",
      author: "Rahul Verma",
      replies: 18,
      lastActivity: "5 hours ago",
      category: "Tips & Tricks",
      content: "What's everyone's favorite way to organize their links? Looking for some inspiration!",
      repliesList: [
        {
          author: "Ananya Singh",
          time: "4 hours ago",
          content: "I use a combination of tags and categories. Tags for quick filtering, categories for broader organization.",
          likes: 15,
        },
        {
          author: "Vikram Reddy",
          time: "3 hours ago",
          content: "I create custom collections for different projects. Makes it easy to share with team members.",
          likes: 9,
        }
      ]
    },
    {
      title: "AI Search Feature Discussion",
      author: "Neha Kapoor",
      replies: 32,
      lastActivity: "1 day ago",
      category: "Features",
      content: "The new AI search is amazing! How is everyone using it?",
      repliesList: [
        {
          author: "Aditya Kumar",
          time: "20 hours ago",
          content: "I use it to find old resources I've saved but can't remember the exact title of. Saves so much time!",
          likes: 21,
        },
        {
          author: "Ishaan Malhotra",
          time: "18 hours ago",
          content: "The contextual understanding is impressive. It finds related content I didn't even know I had.",
          likes: 17,
        }
      ]
    },
    {
      title: "Share Your Favorite Use Cases",
      author: "Compendium Team",
      replies: 7,
      lastActivity: "3 days ago",
      category: "Announcements",
      content: "We'd love to hear how you're using Compendium in your daily workflow. Share your most creative and efficient use cases!",
      repliesList: [
        {
          author: "Sakshi Iyer",
          time: "2 days ago",
          content: "I've created a collection of resources for onboarding new team members. It's saved me so much time and effort!",
          likes: 5,
        },
        {
          author: "Gaurav Menon",
          time: "1 day ago",
          content: "I use Compendium to curate research papers for my academic projects. The AI search helps me find relevant information quickly.",
          likes: 3,
        }
      ]
    }
  ]

  const [expandedTopic, setExpandedTopic] = useState(null);
  const [newReplies, setNewReplies] = useState({});
  const [replyInputs, setReplyInputs] = useState({});

  const toggleTopic = (index) => {
    setExpandedTopic(expandedTopic === index ? null : index);
  };

  const handleReplyChange = (topicIndex, value) => {
    setReplyInputs(prev => ({
      ...prev,
      [topicIndex]: value
    }));
  };

  const handleAddReply = (topicIndex) => {
    if (!replyInputs[topicIndex]?.trim()) return;

    const userName = localStorage.getItem('userName') || 'Anonymous';

    const newReply = {
      author: userName,
      time: "Just now",
      content: replyInputs[topicIndex],
      likes: 0,
    };

    setNewReplies(prev => ({
      ...prev,
      [topicIndex]: [...(prev[topicIndex] || []), newReply]
    }));

    setReplyInputs(prev => ({
      ...prev,
      [topicIndex]: ""
    }));
  };

  const handleGetStarted = () => {
    navigate('/components/ui/Home')
  }

  const handleViewProduct = () => {
    navigate('/components/ui/Home')
  }

  // Update the testimonials section JSX
  return (
    <div className="bg-transparent text-white min-h-screen font-['IBM_Plex_Mono',monospace]">
      {/* Grid Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#080808] via-[#0a0a0a] to-[#080808]"></div>
        <div className="absolute inset-0 opacity-[0.1]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(#ffffff 0.5px, transparent 0.5px), linear-gradient(90deg, #ffffff 0.5px, transparent 0.5px)`,
              backgroundSize: "35px 35px",
            }}
          ></div>
        </div>
      </div>

      {/* Scroll Tracer */}
      <motion.div
        className="fixed left-4 top-0 bottom-0 w-1 origin-top z-50"
        style={{ 
          scaleY: scroller,
          background: 'linear-gradient(to bottom, #6366f1, #8b5cf6, #d946ef)',
          opacity: 0.5
        }}
      >
        <motion.div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef] shadow-[0_0_20px_8px_rgba(99,102,241,0.3)]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              "0 0 20px 8px rgba(99,102,241,0.3)",
              "0 0 30px 12px rgba(139,92,246,0.4)",
              "0 0 20px 8px rgba(99,102,241,0.3)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
              background: "radial-gradient(circle, rgba(99,102,241,0.5) 0%, rgba(139,92,246,0) 70%)"
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10">
      {/* Navbar */}
        <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
            isScrolled ? "bg-black/20 backdrop-blur-lg shadow-lg rounded-full" : "bg-transparent"
        }`}
      >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
          <div className="flex items-center">
                <img 
                  src="/compendium-transparent.png" 
                  alt="Compendium" 
                  className="h-12 w-auto"
                />
          </div>
              <div className="hidden md:flex items-center space-x-8 font-['Inter']">
                <Link
                  to="home"
                spy={true}
                smooth={true}
                duration={500}
                  className="text-white hover:text-[#8483ec] cursor-pointer transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="about"
                  spy={true}
                  smooth={true}
                  duration={500}
                  className="text-white hover:text-[#8483ec] cursor-pointer transition-colors"
                >
                  About Us
                </Link>
                <Link
                  to="testimonials"
                  spy={true}
                  smooth={true}
                  duration={500}
                  className="text-white hover:text-[#8483ec] cursor-pointer transition-colors"
                >
                  Testimonials
                </Link>
                <Link
                  to="pricing"
                  spy={true}
                  smooth={true}
                  duration={500}
                  className="text-white hover:text-[#8483ec] cursor-pointer transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  to="faq"
                    spy={true}
                    smooth={true}
                    duration={500}
                  className="text-white hover:text-[#8483ec] cursor-pointer transition-colors"
                >
                  FAQs
                </Link>
                <Link
                  to="forum"
                  spy={true}
                  smooth={true}
                  duration={500}
                  className="text-white hover:text-[#8483ec] cursor-pointer transition-colors"
                >
                  Discussion Forum
                </Link>
                <Link
                  to="contact"
                  spy={true}
                  smooth={true}
                  duration={500}
                  className="text-white hover:text-[#8483ec] cursor-pointer transition-colors"
                >
                  Contact Us
                </Link>
              </div>
              <div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewProduct}
                  className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-6 py-2 rounded-full font-medium shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(139,92,246,0.7)] transition-shadow text-white font-['Inter']"
                >
                  View Our Product
                </motion.button>
              </div>
            </div>
          </div>
        </nav>

      {/* Hero Section */}
        <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Animated background elements */}
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ 
              y: useTransform(scrollYProgress, [0, 1], [0, -100])
            }}
          >
            {/* Floating gradients */}
          <motion.div 
              animate={{
                x: [0, 10, 0],
                y: [0, -15, 0],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 8, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-[#6366f1]/20 to-[#d946ef]/20 blur-3xl"
            ></motion.div>
            <motion.div
              animate={{
                x: [0, -20, 0],
                y: [0, 20, 0],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#8b5cf6]/20 to-[#6366f1]/20 blur-3xl"
            ></motion.div>

            {/* Grid lines */}
            <div
              className="absolute inset-0 opacity-[0.03]"
            style={{ 
                backgroundImage: `linear-gradient(#ffffff 0.5px, transparent 0.5px), linear-gradient(90deg, #ffffff 0.5px, transparent 0.5px)`,
                backgroundSize: "35px 35px",
            }}
            ></div>
          </motion.div>
          
              <motion.div
            style={{ 
              opacity, 
              scale, 
              y,
              x: useTransform(scrollYProgress, [0, 1], [0, 100])
            }} 
            className="container mx-auto px-6 z-10 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <Typewriter text="Where Shared Links Live Forever" className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight text-center" />
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                Compendium helps communities organize and retrieve shared knowledge with ease.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className="bg-[#8483ec] px-8 py-4 rounded-full text-lg font-medium shadow-[0_0_20px_rgba(132,131,236,0.5)] hover:shadow-[0_0_30px_rgba(132,131,236,0.7)] transition-shadow font-['Inter']"
                >
                  Get Started For Free
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewProduct}
                  className="bg-transparent border-2 border-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white/10 transition-colors font-['Inter']"
                >
                  View Our Product
                </motion.button>
              </motion.div>
            </motion.div>
              </motion.div>
              
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
            <Link to="about" spy={true} smooth={true} duration={500} className="cursor-pointer">
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
                <svg
                  className="w-10 h-10 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>
            </Link>
            </div>
        </section>
      
      {/* About Section */}
        <section ref={aboutRef} className="py-20 relative">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={aboutInView ? "visible" : "hidden"}
            className="max-w-4xl mx-auto px-12"
          >
            <h2 className="text-4xl font-bold mb-6 text-left">
              Built for <span className="text-[#8483ec]">Communities</span>, by a{" "}
              <span className="text-[#8483ec]">Community</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto text-left">
              Compendium was born out of a simple problem faced in every WhatsApp or online group—shared links get lost
              in endless chats. We built a centralized tool that stores, categorizes, and intelligently retrieves links
              so knowledge never gets buried again.
            </p>
          </motion.div>
        </section>
      
      {/* Features Section */}
        <section ref={featuresRef} className="py-20 relative">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="mb-16 px-12"
          >
            <h2 className="text-4xl font-bold mb-8 text-left">
              Powerful <span className="text-[#8483ec]">Features</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl  mb-6 text-left">
              Compendium comes packed with tools designed to make knowledge sharing and retrieval effortless.
            </p>
          </motion.div>
          
          <motion.div
            className="grid md:grid-cols-2 gap-10 px-12"
            variants={staggerContainer}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, boxShadow: "0 0 30px rgba(132, 131, 236, 0.3)" }}
                className="bg-[#0f0f0f] p-8 rounded-2xl border border-[#8483ec]/20 transition-all duration-300"
              >
                <div className="text-[#8483ec] mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      
      {/* Testimonials Section */}
        <section ref={testimonialsRef} className="py-20 relative overflow-hidden">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            className="mb-16 px-12"
          >
            <h2 className="text-4xl font-bold mb-6 text-left">
              What Our <span className="text-[#8483ec]">Users Say</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl  mb-6  text-left">
              Don't just take our word for it. Here's what people are saying about Compendium.
            </p>
          </motion.div>
          
          <motion.div
            className="flex gap-6 py-10 overflow-visible"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            }}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10, scale: 1.03 }}
                className="min-w-[350px] bg-[#0f0f0f]/40 backdrop-blur-lg p-8 rounded-2xl border border-[#8483ec]/20 flex flex-col"
              >
                <div className="flex-1">
                  <p className="text-xl italic text-gray-300 mb-6">"{testimonial.text}"</p>
                          </div>
                <div>
                  <h4 className="text-lg font-bold">{testimonial.name}</h4>
                  <p className="text-[#8483ec]">{testimonial.title}</p>
                        </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      
      {/* Pricing Section */}
        <section ref={pricingRef} className="py-20 relative">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={pricingInView ? "visible" : "hidden"}
            className="mb-16 px-6 text-center"
          >
            <h2 className="text-4xl font-bold mb-6 pl-8 text-left">
  Choose the Right{" "}
  <span className="text-[#8483ec]">Plan for You</span>
</h2>

            <p className="text-xl text-gray-300 max-w-3xl mb-6 pl-10 text-left">
              Choose the plan that works best for your team. All plans include core features.
            </p>
          </motion.div>
          
          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            animate={pricingInView ? "visible" : "hidden"}
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className={`bg-[#0f0f0f] rounded-2xl overflow-hidden ${
                  plan.popular 
                    ? "border-2 border-[#8483ec] shadow-[0_0_30px_rgba(132,131,236,0.3)]"
                    : "border border-[#8483ec]/20"
                }`}
              >
                {plan.popular && <div className="bg-[#8483ec] text-center py-2 font-medium">Most Popular</div>}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                </div>
                  <ul className="mb-8 space-y-4">
                  {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-[#8483ec] mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-lg font-medium ${
                      plan.popular ? "bg-[#8483ec] text-white" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {plan.cta}
                </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      
      {/* FAQ Section */}
        <section ref={faqRef} className="py-20 relative">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={faqInView ? "visible" : "hidden"}
            className="mb-16 px-6 text-center"
          >
            <h2 className="text-4xl font-bold mb-6 ml- 4 pl-6 text-left">
              Frequently Asked <span className="text-[#8483ec]">Questions</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-6xl ml-4 pl-6 mx-auto">
               Got Questions? Answers below. Still need help? Our team's just a click away.
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mb-4"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className={`flex justify-between items-center w-full p-5 text-left bg-[#0f0f0f] rounded-lg ${
                    activeIndex === index ? "rounded-b-none border-b border-[#8483ec]/30" : ""
                  } border border-[#8483ec]/20`}
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  <svg
                    className={`w-6 h-6 text-[#8483ec] transition-transform ${activeIndex === index ? "transform rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                    <motion.div
                  initial={false}
                  animate={{
                    height: activeIndex === index ? "auto" : 0,
                    opacity: activeIndex === index ? 1 : 0,
                  }}
                      transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-[#0f0f0f]/50 rounded-b-lg border-x border-b border-[#8483ec]/20"
                    >
                  <div className="p-5 text-gray-300">{faq.answer}</div>
                    </motion.div>
              </motion.div>
            ))}
        </div>
        </section>
      
        {/* Discussion Forum Section */}
        <section ref={forumRef} className="py-20 relative">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={forumInView ? "visible" : "hidden"}
            className="mb-16 px-6 text-center"
          >
            <h2 className="text-4xl font-bold mb-6 ml- 4 pl-6 text-left">
              Community <span className="text-[#8483ec]">Discussion</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto ml- 4 pl-4 text-left">
              Join the conversation and share your experiences with Compendium.
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto grid gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={forumInView ? "visible" : "hidden"}
          >
            {forumTopics.map((topic, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-[#0f0f0f]/40 backdrop-blur-lg rounded-2xl border border-[#8483ec]/20 transition-all duration-300"
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleTopic(index)}
                >
                  <div className="flex justify-between items-start">
                  <div>
                      <h3 className="text-xl font-bold mb-2">{topic.title}</h3>
                      <div className="flex items-center space-x-4 text-gray-400">
                        <span>by {topic.author}</span>
                        <span>•</span>
                        <span>{topic.replies} replies</span>
                        <span>•</span>
                        <span>{topic.lastActivity}</span>
                  </div>
                    </div>
                    <span className="px-3 py-1 bg-[#8483ec]/20 text-[#8483ec] rounded-full text-sm">
                      {topic.category}
                    </span>
                  </div>
                  <p className="mt-4 text-gray-300">{topic.content}</p>
                </div>
                
                {expandedTopic === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-[#8483ec]/20"
                  >
                    <div className="p-6 space-y-4">
                      {topic.repliesList.map((reply, replyIndex) => (
                        <div key={replyIndex} className="bg-[#0f0f0f]/60 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-[#8483ec]">{reply.author}</span>
                            <span className="text-sm text-gray-400">{reply.time}</span>
                          </div>
                          <p className="text-gray-300">{reply.content}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-400">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {reply.likes}
                          </div>
                        </div>
                      ))}
                      {newReplies[index]?.map((reply, replyIndex) => (
                        <div key={`new-${replyIndex}`} className="bg-[#0f0f0f]/60 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-[#8483ec]">{reply.author}</span>
                            <span className="text-sm text-gray-400">{reply.time}</span>
                          </div>
                          <p className="text-gray-300">{reply.content}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-400">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {reply.likes}
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center space-x-4 mt-4">
                        <input
                          type="text"
                          value={replyInputs[index] || ""}
                          onChange={(e) => handleReplyChange(index, e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 bg-[#0f0f0f]/60 text-white px-4 py-2 rounded-lg border border-[#8483ec]/20 focus:border-[#8483ec] outline-none"
                        />
                        <button 
                          onClick={() => handleAddReply(index)}
                          className="bg-[#8483ec] px-4 py-2 rounded-lg text-white hover:bg-[#8483ec]/90 transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
            </motion.div>
            
            <motion.div 
            className="text-center mt-10"
            variants={fadeInUp}
            initial="hidden"
            animate={forumInView ? "visible" : "hidden"}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#8483ec] px-8 py-3 rounded-full text-lg font-medium shadow-[0_0_20px_rgba(132,131,236,0.5)] hover:shadow-[0_0_30px_rgba(132,131,236,0.7)] transition-shadow"
            >
              Start New Discussion
            </motion.button>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section ref={contactRef} className="py-20 relative">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={contactInView ? "visible" : "hidden"}
            className="mb-16 px-6 text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              Get In <span className="text-[#8483ec]">Touch</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions or want to learn more? Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <motion.form
              className="space-y-6"
              variants={fadeInUp}
              initial="hidden"
              animate={contactInView ? "visible" : "hidden"}
            >
              <div className="grid md:grid-cols-2 gap-6">
              <div>
  <label
    htmlFor="name"
    className="block mb-2 text-sm font-medium text-white"
  >
    Your Name
  </label>
  <input
    type="text"
    id="name"
    name="name"
    autoComplete="off"
    className="w-full p-3 bg-[#0f0f0f] rounded-lg border border-[#8483ec]/20 focus:ring-[#8483ec] focus:border-[#8483ec] outline-none transition-colors text-white placeholder-gray-400"
    required
    placeholder="Enter your full name"
  />
</div>

                <div>
  <label
    htmlFor="email"
    className="block mb-2 text-sm font-medium text-white"
  >
    Your Email
  </label>
  <input
    type="email"
    id="email"
    name="email"
    autoComplete="off"
    className="w-full p-3 bg-[#0f0f0f] rounded-lg border border-[#8483ec]/20 focus:ring-[#8483ec] focus:border-[#8483ec] outline-none transition-colors text-white placeholder-gray-400"
    required
    placeholder="you@example.com"
  />
</div>

              </div>
                <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium">
                  Your Message
                  </label>
                  <textarea
                  id="message"
                  rows={6}
                  className="w-full p-3 bg-[#0f0f0f] rounded-lg border border-[#8483ec]/20 focus:ring-[#8483ec] focus:border-[#8483ec] outline-none transition-colors"
                  required
                ></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 bg-[#8483ec] rounded-lg font-medium shadow-[0_0_15px_rgba(132,131,236,0.3)] hover:shadow-[0_0_25px_rgba(132,131,236,0.5)] transition-shadow"
                >
                  Send Message
                </motion.button>
            </motion.form>

            <motion.div
              className="flex justify-center mt-10 space-x-6"
              variants={fadeInUp}
              initial="hidden"
              animate={contactInView ? "visible" : "hidden"}
              transition={{ delay: 0.3 }}
            >
              <motion.a href="#" whileHover={{ y: -5, color: "#8483ec" }} className="text-white transition-colors">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </motion.a>
              <motion.a href="#" whileHover={{ y: -5, color: "#8483ec" }} className="text-white transition-colors">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.a>
              <motion.a href="#" className="text-gray-400 hover:text-[#8483ec] transition-colors">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.a>
          </motion.div>
        </div>
        </section>
      </div>

      {/* Footer Section */}
      <footer className="py-12 bg-black/20 backdrop-blur-lg border-t border-[#8483ec]/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left">
              <img 
                src="/compendium-transparent.png" 
                alt="Compendium" 
                className="h-12 w-auto mx-auto md:mx-0 mb-4"
              />
              <p className="text-gray-400">
                Where shared links live forever.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#8483ec] transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#8483ec] transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#8483ec] transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#8483ec] transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#8483ec] transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#8483ec] transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#8483ec] transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#8483ec] transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#8483ec] transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#8483ec]/20 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Compendium. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Font Import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'IBM Plex Mono', monospace;
        }
      `}</style>
    </div>
  )
}

export default LandingPage;
