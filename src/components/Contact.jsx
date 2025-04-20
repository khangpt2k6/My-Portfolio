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
import emailjs from "@emailjs/browser";

const Contact = () => {
  // References and state
  const formRef = useRef();
  const [formData, setFormData] = useState({
    from_name: "", // Changed from "name" to match EmailJS template
    user_email: "", // Changed from "email" to match EmailJS template
    subject: "", // Keep this if your template uses it
    user_feedback: "", // Changed from "message" to match EmailJS template
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
      scale: 1.05,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  const formFieldVariants = {
    idle: { scale: 1 },
    active: {
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(5, 150, 105, 0.2)",
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

    // Add recipient info (to_name) to the form data
    // This aligns with your {{to_name}} template variable
    formRef.current.to_name = "Khang Phan"; // You can change this to your name

    // Replace these with your actual EmailJS service ID, template ID, and public key
    const serviceId = "service_a5rttmj";
    const templateId = "template_xxvslct";
    const publicKey = "UHaRQ92hG5FMULzb5";

    emailjs
      .sendForm(serviceId, templateId, formRef.current, publicKey)
      .then((result) => {
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
      })
      .catch((error) => {
        setIsSubmitting(false);
        setSubmitError("Failed to send message. Please try again later.");
        console.error("EmailJS Error:", error);
      });
  };

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-b from-emerald-50 to-cyan-50 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-emerald-200 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-cyan-300 opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-teal-400 opacity-10 blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial="hidden"
            animate={titleControls}
            variants={titleVariants}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Feel free to reach out with any questions or opportunities. I'd
              love to hear from you!
            </p>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-8 backdrop-blur-sm bg-opacity-80 border border-white border-opacity-20"
            variants={itemVariants}
          >
            <h3 className="text-2xl font-bold mb-8 text-emerald-700 relative">
              Contact Information
              <span className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 -mb-2"></span>
            </h3>

            <div className="space-y-8">
              <motion.div
                className="flex items-start group"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-md group-hover:shadow-emerald-200 transition-shadow duration-300">
                  <FaEnvelope className="text-white text-xl" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">Email</h4>
                  <a
                    href="mailto:2006tuankhang@gmail.com"
                    className="text-emerald-600 hover:text-emerald-700 transition-colors duration-300 relative inline-block group-hover:underline"
                  >
                    2006tuankhang@gmail.com
                  </a>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start group"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-md group-hover:shadow-emerald-200 transition-shadow duration-300">
                  <FaPhone className="text-white text-xl" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">Phone</h4>
                  <a
                    href="tel:8135704370"
                    className="text-emerald-600 hover:text-emerald-700 transition-colors duration-300 group-hover:underline"
                  >
                    813-570-4370
                  </a>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start group"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-md group-hover:shadow-emerald-200 transition-shadow duration-300">
                  <FaGithub className="text-white text-xl" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    GitHub
                  </h4>
                  <a
                    href="https://github.com/khangpt2k6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 transition-colors duration-300 group-hover:underline"
                  >
                    github.com/khangpt2k6
                  </a>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start group"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mr-4 shadow-md group-hover:shadow-emerald-200 transition-shadow duration-300">
                  <FaLinkedin className="text-white text-xl" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    LinkedIn
                  </h4>
                  <a
                    href="https://linkedin.com/in/tuankhangphan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 transition-colors duration-300 group-hover:underline"
                  >
                    linkedin.com/in/tuankhangphan
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-xl p-8 backdrop-blur-sm bg-opacity-80 border border-white border-opacity-20"
            variants={itemVariants}
          >
            <h3 className="text-2xl font-bold mb-8 text-emerald-700 relative">
              Send Me a Message
              <span className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 -mb-2"></span>
            </h3>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                variants={formFieldVariants}
                animate={activeField === "from_name" ? "active" : "idle"}
              >
                <label
                  htmlFor="from_name"
                  className="block text-gray-700 font-medium mb-2"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  placeholder="Your Name"
                />
              </motion.div>

              <motion.div
                variants={formFieldVariants}
                animate={activeField === "user_email" ? "active" : "idle"}
              >
                <label
                  htmlFor="user_email"
                  className="block text-gray-700 font-medium mb-2"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  placeholder="Your Email"
                />
              </motion.div>

              <motion.div
                variants={formFieldVariants}
                animate={activeField === "subject" ? "active" : "idle"}
              >
                <label
                  htmlFor="subject"
                  className="block text-gray-700 font-medium mb-2"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  placeholder="Subject"
                />
              </motion.div>

              <motion.div
                variants={formFieldVariants}
                animate={activeField === "user_feedback" ? "active" : "idle"}
              >
                <label
                  htmlFor="user_feedback"
                  className="block text-gray-700 font-medium mb-2"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  placeholder="Your Message"
                ></textarea>
              </motion.div>

              {/* Add hidden input for to_name */}
              <input type="hidden" name="to_name" value="Khang Phan" />

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
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
                  <span className="flex items-center justify-center">
                    <FaPaperPlane className="mr-2" />
                    Send Message
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={successVariants}
                  >
                    <div className="flex-shrink-0 mr-3">
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
                    <span>
                      Your message has been sent successfully! I'll get back to
                      you soon.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {submitError && (
                  <motion.div
                    className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={successVariants}
                  >
                    <div className="flex-shrink-0 mr-3">
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
                    <span>{submitError}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
