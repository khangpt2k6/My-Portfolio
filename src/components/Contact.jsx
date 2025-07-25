"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaGithub,
  FaLinkedin,
  FaPaperPlane,
} from "react-icons/fa";

const Contact = () => {
  // References and state
  const formRef = useRef();
  const [formData, setFormData] = useState({
    from_name: "",
    user_email: "",
    subject: "",
    user_feedback: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [activeField, setActiveField] = useState(null);

  // Animation controls
  const controls = useAnimation();
  const titleControls = useAnimation();

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.98 },
  };

  const formFieldVariants = {
    idle: { scale: 1 },
    active: {
      scale: 1.01,
      transition: { type: "spring", stiffness: 300, damping: 10 },
    },
  };

  const successVariants = {
    hidden: { opacity: 0, height: 0, y: -20 },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  // Start title animation when component mounts
  useEffect(() => {
    const sequence = async () => {
      await titleControls.start("visible");
      await controls.start("visible");
    };
    sequence();
  }, [controls, titleControls]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (field) => {
    setActiveField(field);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        from_name: "",
        user_email: "",
        subject: "",
        user_feedback: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 2000);
  };

  return (
    <section
      id="contact"
      className="py-20 bg-white relative overflow-hidden"
    >
      {/* Glassmorphism Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating glass orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-80 h-80 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.1), rgba(22, 163, 74, 0.05))',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.08), rgba(22, 163, 74, 0.03))',
            backdropFilter: 'blur(60px)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div 
          className="absolute top-1/2 left-1/2 w-60 h-60 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.12), rgba(22, 163, 74, 0.04))',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.25)'
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(22, 163, 74, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(22, 163, 74, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial="hidden"
            animate={titleControls}
            variants={titleVariants}
          >
            <h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: '#16A34A' }}
            >
              Get In Touch
            </h2>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "4rem" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-1 mx-auto mb-6"
              style={{ backgroundColor: '#16A34A' }}
            />
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Feel free to reach out with any questions or opportunities. I'd love to hear from you!
            </p>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          {/* Contact Information Card */}
          <motion.div
            className="relative rounded-2xl p-8 shadow-xl border border-white/20"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(20px)',
            }}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 pointer-events-none" />
            
            <h3 
              className="text-2xl font-bold mb-8 relative"
              style={{ color: '#1F2937' }}
            >
              Contact Information
              <span 
                className="absolute bottom-0 left-0 w-16 h-1 -mb-2 rounded-full"
                style={{ backgroundColor: '#16A34A' }}
              />
            </h3>

            <div className="space-y-8">
              <motion.div
                className="flex items-start group"
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-lg relative overflow-hidden"
                  style={{ backgroundColor: '#16A34A' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <FaEnvelope className="text-white text-lg relative z-2" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1" style={{ color: '#1F2937' }}>
                    Email
                  </h4>
                  <a
                    href="mailto:2006tuankhang@gmail.com"
                    className="text-gray-600 hover:text-green-600 transition-colors duration-300 group-hover:underline"
                  >
                    2006tuankhang@gmail.com
                  </a>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start group"
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-lg relative overflow-hidden"
                  style={{ backgroundColor: '#16A34A' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <FaPhone className="text-white text-lg relative z-2" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1" style={{ color: '#1F2937' }}>
                    Phone
                  </h4>
                  <a
                    href="tel:8135704370"
                    className="text-gray-600 hover:text-green-600 transition-colors duration-300 group-hover:underline"
                  >
                    813-570-4370
                  </a>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start group"
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-lg relative overflow-hidden"
                  style={{ backgroundColor: '#16A34A' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <FaGithub className="text-white text-lg relative z-2" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1" style={{ color: '#1F2937' }}>
                    GitHub
                  </h4>
                  <a
                    href="https://github.com/khangpt2k6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-green-600 transition-colors duration-300 group-hover:underline"
                  >
                    github.com/khangpt2k6
                  </a>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start group"
                whileHover={{ x: 8 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-lg relative overflow-hidden"
                  style={{ backgroundColor: '#16A34A' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <FaLinkedin className="text-white text-lg relative z-2" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-1" style={{ color: '#1F2937' }}>
                    LinkedIn
                  </h4>
                  <a
                    href="https://linkedin.com/in/tuankhangphan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-green-600 transition-colors duration-300 group-hover:underline"
                  >
                    linkedin.com/in/tuankhangphan
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            className="relative rounded-2xl p-8 shadow-xl border border-white/20"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(20px)',
            }}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 pointer-events-none" />
            
            <h3 
              className="text-2xl font-bold mb-8 relative"
              style={{ color: '#1F2937' }}
            >
              Send Me a Message
              <span 
                className="absolute bottom-0 left-0 w-16 h-1 -mb-2 rounded-full"
                style={{ backgroundColor: '#16A34A' }}
              />
            </h3>

            <div className="space-y-6">
              <motion.div
                variants={formFieldVariants}
                animate={activeField === "from_name" ? "active" : "idle"}
              >
                <label
                  htmlFor="from_name"
                  className="block font-medium mb-2"
                  style={{ color: '#1F2937' }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="from_name"
                  name="from_name"
                  value={formData.from_name}
                  onChange={handleChange}
                  onFocus={() => handleFocus("from_name")}
                  onBlur={handleBlur}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-white/30 transition-all duration-300 placeholder-gray-400"
                  style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    color: '#1F2937'
                  }}
                  placeholder="Your Name"
                />
              </motion.div>

              <motion.div
                variants={formFieldVariants}
                animate={activeField === "user_email" ? "active" : "idle"}
              >
                <label
                  htmlFor="user_email"
                  className="block font-medium mb-2"
                  style={{ color: '#1F2937' }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                  onFocus={() => handleFocus("user_email")}
                  onBlur={handleBlur}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-white/30 transition-all duration-300 placeholder-gray-400"
                  style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    color: '#1F2937'
                  }}
                  placeholder="Your Email"
                />
              </motion.div>

              <motion.div
                variants={formFieldVariants}
                animate={activeField === "subject" ? "active" : "idle"}
              >
                <label
                  htmlFor="subject"
                  className="block font-medium mb-2"
                  style={{ color: '#1F2937' }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => handleFocus("subject")}
                  onBlur={handleBlur}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-white/30 transition-all duration-300 placeholder-gray-400"
                  style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    color: '#1F2937'
                  }}
                  placeholder="Subject"
                />
              </motion.div>

              <motion.div
                variants={formFieldVariants}
                animate={activeField === "user_feedback" ? "active" : "idle"}
              >
                <label
                  htmlFor="user_feedback"
                  className="block font-medium mb-2"
                  style={{ color: '#1F2937' }}
                >
                  Message
                </label>
                <textarea
                  id="user_feedback"
                  name="user_feedback"
                  value={formData.user_feedback}
                  onChange={handleChange}
                  onFocus={() => handleFocus("user_feedback")}
                  onBlur={handleBlur}
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl border border-white/30 transition-all duration-300 placeholder-gray-400 resize-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    color: '#1F2937'
                  }}
                  placeholder="Your Message"
                ></textarea>
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg relative overflow-hidden"
                style={{ backgroundColor: '#16A34A' }}
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5" />
                {isSubmitting ? (
                  <span className="flex items-center justify-center relative z-2">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center relative z-2">
                    <FaPaperPlane className="mr-2" />
                    Send Message
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    className="border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center relative overflow-hidden"
                    style={{
                      background: 'rgba(220, 252, 231, 0.6)',
                      backdropFilter: 'blur(10px)'
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={successVariants}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-50/20 to-green-100/10" />
                    <div className="flex-shrink-0 mr-3 relative z-2">
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="relative z-2">
                      Your message has been sent successfully! I'll get back to you soon.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {submitError && (
                  <motion.div
                    className="border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center relative overflow-hidden"
                    style={{
                      background: 'rgba(254, 226, 226, 0.6)',
                      backdropFilter: 'blur(10px)'
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={successVariants}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-50/20 to-red-100/10" />
                    <div className="flex-shrink-0 mr-3 relative z-2">
                      <svg
                        className="h-5 w-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="relative z-2">{submitError}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;