import { motion } from "framer-motion";

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
      transition={{ 
        duration: 0.4, 
        ease: [0.16, 1, 0.3, 1] // Custom "Expo" easing for a premium feel
      }}
      className="relative w-full"
    >
      {/* Visual "Scan" Bar on entry */}
      <motion.div 
        initial={{ top: "-100%" }}
        animate={{ top: "100%" }}
        transition={{ duration: 0.6, ease: "linear" }}
        className="absolute left-0 right-0 h-[2px] bg-neonCyan opacity-50 z-50 pointer-events-none"
      />
      {children}
    </motion.div>
  );
};

export default PageTransition;