import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as ScrollLink, Element } from 'react-scroll';
import { 
  Search, ChevronDown, CheckCircle, Star, 
  MessageCircle, ArrowRight, Menu, X, Spotlight
} from 'lucide-react';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  // Handle scroll events for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle FAQ toggle
  const toggleFaq = (index) => {
    setSelectedFaq(selectedFaq === index ? null : index);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const navLinks = [
    { title: "Home", to: "home" },
    { title: "About", to: "about" },
    { title: "Features", to: "features" },
    { title: "Testimonials", to: "testimonials" },
    { title: "Pricing", to: "pricing" },
    { title: "FAQs", to: "faqs" },
    { title: "Contact", to: "contact" },
  ];
  
  const features = [
    {
      icon: <Search size={24} />,
      title: "AI-Powered Search",
      description: "Intelligent search that understands context and learns from user behavior"
    },
    {
      icon: <CheckCircle size={24} />,
      title: "User-Driven Links",
      description: "Easy addition and organization of links by your entire community"
    },
    {
      icon: <Star size={24} />,
      title: "Smart Filters",
      description: "Advanced filtering and tagging system for quick information retrieval"
    },
  ];
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Community Manager",
      content: "Compendium has transformed how our team shares knowledge. What used to take hours now takes seconds.",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
      name: "Mark Reynolds",
      role: "Development Lead",
      content: "The search functionality is incredible. It's like having a dedicated librarian for all our shared resources.",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    {
      name: "Priya Sharma",
      role: "Product Owner",
      content: "We've reduced onboarding time by 60% by using Compendium as our central knowledge repository.",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
  ];
  
  const pricingPlans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      features: [
        "Up to 5 team members",
        "100 shared links",
        "Basic search",
        "7-day history"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "₹299",
      period: "per month",
      features: [
        "Up to 20 team members",
        "Unlimited shared links",
        "Advanced AI search",
        "90-day history",
        "Analytics dashboard"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "per month",
      features: [
        "Unlimited team members",
        "Unlimited shared links",
        "Advanced AI search",
        "Unlimited history",
        "Custom integrations",
        "Dedicated support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];
  
  const faqs = [
    {
      question: "How does Compendium organize links?",
      answer: "Compendium uses AI-powered categorization and tagging to automatically organize links. You can also create custom categories and apply tags manually."
    },
    {
      question: "Can I integrate Compendium with other tools?",
      answer: "Yes! Compendium offers integrations with popular tools like Slack, Teams, Notion, and more. Enterprise plans include custom integration options."
    },
    {
      question: "Is there a limit to how many links I can save?",
      answer: "Free accounts can save up to 100 links. Pro and Enterprise accounts have unlimited link storage."
    },
    {
      question: "How secure is my data with Compendium?",
      answer: "Compendium uses bank-level encryption for all data. We also offer enterprise-grade security features like SSO and role-based access control."
    },
  ];

  return (
    <div
      className="relative flex min-h-screen w-full overflow-hidden bg-[#0f0f0f] text-white antialiased"
      style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, #171717 1px, transparent 1px), linear-gradient(to bottom, #171717 1px, transparent 1px)' }}
    >
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
      {/* Navbar */}
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'py-3 bg-[#0f0f0f]/80 backdrop-blur-lg shadow-lg' : 'py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/compendium.png" alt="Compendium Logo" className="h-8" />
            <span className="ml-3 text-xl font-bold text-[#9b5de5]">Compendium</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <ScrollLink
                key={link.to}
                to={link.to}
                spy={true}
                smooth={true}
                duration={500}
                className="text-sm font-medium hover:text-[#9b5de5] cursor-pointer transition-colors"
              >
                {link.title}
              </ScrollLink>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-full bg-[#9b5de5] text-white font-medium shadow-[0_0_15px_rgba(155,93,229,0.5)] hover:shadow-[0_0_20px_rgba(155,93,229,0.7)] transition-all"
            >
              View Our Product
            </motion.button>
          </nav>
          
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0f0f0f]/95 backdrop-blur-lg"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <ScrollLink
                    key={link.to}
                    to={link.to}
                    spy={true}
                    smooth={true}
                    duration={500}
                    className="text-sm font-medium hover:text-[#9b5de5] cursor-pointer transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.title}
                  </ScrollLink>
                ))}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 rounded-full bg-[#9b5de5] text-white font-medium shadow-[0_0_15px_rgba(155,93,229,0.5)] hover:shadow-[0_0_20px_rgba(155,93,229,0.7)] transition-all"
                >
                  View Our Product
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <Element name="home" className="relative">
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Parallax Background Elements */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1 }}
            className="absolute top-0 right-0 w-1/2 h-full"
            style={{ 
              background: 'radial-gradient(circle, rgba(155,93,229,0.15) 0%, rgba(155,93,229,0) 70%)',
            }}
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute bottom-0 left-0 w-1/2 h-1/2"
            style={{ 
              background: 'radial-gradient(circle, rgba(155,93,229,0.1) 0%, rgba(155,93,229,0) 70%)',
            }}
          />
          
          {/* Hero Content */}
          <div className="container mx-auto px-4 pt-20 pb-12 md:pt-32 md:pb-20 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                  Where Shared Links <br/>
                  <span className="text-[#9b5de5]">Live Forever</span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Compendium helps communities organize and retrieve shared knowledge with ease.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full bg-[#9b5de5] text-white font-medium shadow-[0_0_20px_rgba(155,93,229,0.5)] hover:shadow-[0_0_30px_rgba(155,93,229,0.7)] transition-all"
                >
                  Get Started Free
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full border border-[#9b5de5]/50 text-white font-medium hover:bg-[#9b5de5]/10 transition-all"
                >
                  Watch Demo
                </motion.button>
              </motion.div>
              
              <motion.div
                className="mt-16 md:mt-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                <motion.img
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1000"
                  alt="Compendium Dashboard"
                  className="rounded-lg shadow-2xl w-full max-w-4xl mx-auto"
                  style={{ 
                    boxShadow: '0 20px 50px rgba(155, 93, 229, 0.2)'
                  }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </Element>
      
      {/* About Section */}
      <Element name="about" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Knowledge Management <span className="text-[#9b5de5]">Reimagined</span>
            </h2>
            <p className="text-gray-300 mb-12 text-lg">
              Compendium is the modern way to collect, organize, and retrieve shared links and knowledge. 
              No more lost bookmarks or forgotten resources - everything your team needs is just a search away.
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Built for <span className="text-[#9b5de5]">Teams and Communities</span></h3>
              <p className="text-gray-300 mb-6">
                Whether you're a small team or large organization, Compendium scales with your needs.
                Create spaces for different teams, projects, or interests - all with powerful
                search capabilities.
              </p>
              <ul className="space-y-2">
                {[
                  "Shareable link collections",
                  "Real-time collaboration",
                  "Customizable organization",
                  "Powerful access controls"
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle size={18} className="text-[#9b5de5] mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              variants={fadeIn}
              className="relative"
            >
              <div 
                className="absolute inset-0 rounded-lg opacity-30"
                style={{
                  background: 'linear-gradient(45deg, #9b5de5 0%, #6d28d9 100%)',
                  filter: 'blur(40px)',
                  transform: 'translate(10px, 10px)'
                }}
              />
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
                alt="Team collaboration"
                className="rounded-lg relative z-10"
              />
            </motion.div>
          </motion.div>
        </div>
      </Element>
      
      {/* Features Section */}
      <Element name="features" className="py-20 md:py-28 bg-[#151515]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Powerful <span className="text-[#9b5de5]">Features</span>
            </h2>
            <p className="text-gray-300 mb-16">
              Everything you need to manage your team's knowledge in one place
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-[#1a1a1a] rounded-xl p-6 border border-[#333333] hover:border-[#9b5de5]/50 transition-all"
                variants={fadeIn}
                whileHover={{ 
                  y: -5,
                  boxShadow: '0 10px 30px rgba(155, 93, 229, 0.15)'
                }}
              >
                <div className="bg-[#9b5de5]/10 p-3 rounded-full w-12 h-12 flex items-center justify-center text-[#9b5de5] mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            className="mt-20 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full border border-[#9b5de5] text-white font-medium hover:bg-[#9b5de5]/10 transition-all"
            >
              Explore All Features <ArrowRight size={16} className="ml-2 inline" />
            </motion.button>
          </motion.div>
        </div>
      </Element>
      
      {/* Testimonials Section */}
      <Element name="testimonials" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Loved by <span className="text-[#9b5de5]">Teams</span>
            </h2>
            <p className="text-gray-300">
              Don't take our word for it - hear from teams already using Compendium
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Testimonials Carousel */}
              <div className="overflow-hidden">
                <div className="flex transition-all duration-500" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="min-w-full px-4">
                      <div className="bg-[#1a1a1a] rounded-xl p-8 border border-[#333333]">
                        <div className="flex items-center mb-6">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-14 h-14 rounded-full border-2 border-[#9b5de5]"
                          />
                          <div className="ml-4">
                            <h4 className="font-bold text-lg">{testimonial.name}</h4>
                            <p className="text-gray-400 text-sm">{testimonial.role}</p>
                          </div>
                        </div>
                        <p className="text-gray-300 italic">{testimonial.content}</p>
                        <div className="mt-5 flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={18} className="text-[#9b5de5]" fill="#9b5de5" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Dots navigation */}
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      activeTestimonial === index ? 'bg-[#9b5de5]' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Element>
      
      {/* Pricing Section */}
      <Element name="pricing" className="py-20 md:py-28 bg-[#151515]">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Simple, <span className="text-[#9b5de5]">Transparent</span> Pricing
            </h2>
            <p className="text-gray-300">
              Choose the plan that works for your team
            </p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                className={`bg-[#1a1a1a] rounded-xl p-8 border relative ${
                  plan.popular 
                    ? 'border-[#9b5de5]' 
                    : 'border-[#333333]'
                }`}
                variants={fadeIn}
                whileHover={{ 
                  y: -5,
                  boxShadow: plan.popular 
                    ? '0 10px 30px rgba(155, 93, 229, 0.3)' 
                    : '0 10px 30px rgba(155, 93, 229, 0.1)'
                }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-[#9b5de5] text-white text-xs font-bold py-1 px-3 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle size={18} className="text-[#9b5de5] mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    plan.popular
                      ? 'bg-[#9b5de5] text-white'
                      : 'bg-[#2a2a2a] text-white hover:bg-[#9b5de5]/20'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Element>
      
      {/* FAQ Section */}
      <Element name="faqs" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Frequently Asked <span className="text-[#9b5de5]">Questions</span>
            </h2>
            <p className="text-gray-300">
              Get answers to common questions about Compendium
            </p>
          </motion.div>
          
          <motion.div
            className="max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="mb-5"
                variants={fadeIn}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full text-left p-5 rounded-lg flex justify-between items-center ${
                    selectedFaq === index
                      ? 'bg-[#1a1a1a] border-l-2 border-[#9b5de5]'
                      : 'bg-[#151515] hover:bg-[#1a1a1a]'
                  }`}
                >
                  <span className="font-medium text-lg">{faq.question}</span>
                  <ChevronDown 
                    size={20} 
                    className={`transform transition-transform ${
                      selectedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <AnimatePresence>
                  {selectedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 bg-[#1a1a1a] rounded-b-lg border-l-2 border-[#9b5de5]">
                        <p className="text-gray-300">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Element>
      
      {/* Contact Section */}
      <Element name="contact" className="py-20 md:py-28 bg-[#151515]">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl md:text-4xl font-bold mb-5">
                Ready to <span className="text-[#9b5de5]">Get Started?</span>
              </h2>
              <p className="text-gray-300 mb-8">
                Contact us to learn more about Compendium or to request a demo for your team.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-[#9b5de5]/10 p-3 rounded-full text-[#9b5de5] mr-4">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium">Chat with us</h4>
                    <p className="text-gray-400 text-sm">Our friendly team is here to help</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-[#9b5de5]/10 p-3 rounded-full text-[#9b5de5] mr-4">
                    <Search size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium">Visit our help center</h4>
                    <p className="text-gray-400 text-sm">Comprehensive documentation and guides</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              className="bg-[#1a1a1a] rounded-xl p-6 md:p-8 border border-[#333333]"
            >
              <h3 className="text-xl font-bold mb-6">Contact Us</h3>
              
              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#252525] border border-[#333333] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9b5de5]/50 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-[#252525] border border-[#333333] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9b5de5]/50 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    className="w-full bg-[#252525] border border-[#333333] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9b5de5]/50 focus:border-transparent h-32"
                    placeholder="How can we help?"
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#9b5de5] text-white font-medium py-3 rounded-lg hover:bg-[#8a4dd0] transition-colors"
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </Element>
      
      {/* Footer */}
      <footer className="py-12 border-t border-[#333333]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h4 className="text-xl font-bold text-[#9b5de5] mb-4">Compendium</h4>
              <p className="text-gray-400 mb-6">
                Helping teams organize and retrieve shared knowledge with ease.
              </p>
            </div>
            
            <div>
              <h5 className="font-medium mb-4">Product</h5>
              <ul className="space-y-2">
                {["Features", "Pricing", "Integrations", "Enterprise"].map(item => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-[#9b5de5] transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-4">Resources</h5>
              <ul className="space-y-2">
                {["Blog", "Help Center", "Guides", "API"].map(item => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-[#9b5de5] transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium mb-4">Company</h5>
              <ul className="space-y-2">
                {["About", "Careers", "Privacy", "Terms"].map(item => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-[#9b5de5] transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#333333] pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Compendium. All rights reserved.
            </p>
            
            <div className="flex space-x-4 mt-4 md:mt-0">
              {["Twitter", "LinkedIn", "GitHub", "Discord"].map(item => (
                <a key={item} href="#" className="text-gray-400 hover:text-[#9b5de5] transition-colors text-sm">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
