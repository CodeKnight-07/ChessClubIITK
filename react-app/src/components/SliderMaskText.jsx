import { motion } from 'framer-motion';
import { useState } from 'react';

const SliderMaskText = ({ text, image, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.h2
        className={`font-display leading-[0.9] bg-cover bg-center ${className}`}
        style={{
          backgroundImage: `url(${image})`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          backgroundSize: '200% auto',
        }}
        /*
        animate={{
          backgroundPosition: isHovered ? ["0% 50%", "100% 50%"] : ["0% 50%", "100% 50%"],
        }}
        transition={{
          duration: isHovered ? 10 : 20,
          repeat: Infinity,
          ease: "linear",
          repeatType: "reverse"
        }}
        */
      >
        {text.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i !== text.split('\n').length - 1 && <br />}
          </span>
        ))}
      </motion.h2>
    </div>
  );
};

export default SliderMaskText;
