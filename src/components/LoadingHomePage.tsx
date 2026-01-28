import { QrCode } from "./icons/Icons";
import { motion } from "framer-motion";

function LoadingHomePage() {


  return (
    <div
      className={`!fixed !inset-0 !z-[11111111111111] flex items-center justify-center loader-background`}

    >
      {/* Amazing Background with Gradient and Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50"></div>

      {/* Animated Background Circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-200%] animate-shine"></div>

      {/* Professional Loader Design */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-3">
        {/* SVG Logo Icon */}
        <div className="loader-logo-container">
          <motion.div
            animate={{
              rotate: [0, 90, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={"text-purple-600 dark:text-purple-400"}
          >
            <QrCode size={46} className="" />
          </motion.div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="loader-progress-container">
          <div className="loader-progress-bar">
            <div className="loader-progress-fill"></div>
            <div className="loader-progress-shine"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingHomePage;
