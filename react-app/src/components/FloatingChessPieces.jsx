import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Minimalistic flat white SVG paths for chess pieces
const CHESS_PIECES = [
  // Pawn
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M12 2C10.9 2 10 2.9 10 4C10 4.8 10.5 5.5 11.2 5.8C10.1 6.5 9 8.1 9 10C9 11.9 10.1 13.5 11.2 14.2C10.5 14.5 10 15.2 10 16C10 17.1 10.9 18 12 18C13.1 18 14 17.1 14 16C14 15.2 13.5 14.5 12.8 14.2C13.9 13.5 15 11.9 15 10C15 8.1 13.9 6.5 12.8 5.8C13.5 5.5 14 4.8 14 4C14 2.9 13.1 2 12 2M8 20V22H16V20H8Z"/></svg>,
  // Rook
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M5 2V8H7V10H17V8H19V2H15V6H13V2H11V6H9V2H5M7 12V20H17V12H7M5 20V22H19V20H5Z"/></svg>,
  // Knight
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M14.5 2C13.2 2 11.9 2.5 11 3.4C10 4.3 9.4 5.6 9.4 7C9.4 7.6 9.5 8.1 9.7 8.6C8 9.3 6.6 10.6 5.8 12.3C5 14 5.1 16.1 6 17.8L7.7 16.1C7.2 15 7.1 13.6 7.6 12.5C8.1 11.4 9.1 10.6 10.2 10.1C9.6 12 10 14.2 11.3 15.7C12.7 17.2 14.8 17.9 16.8 17.5V20H7V22H17V17.5C18.6 17 19.8 15.7 20.4 14.2C21 12.6 20.8 10.8 19.8 9.5C18.8 8.1 17 7.3 15.2 7.5C14.7 7.5 14.2 7.6 13.8 7.8C13.6 7.6 13.4 7.3 13.4 7C13.4 6.2 13.7 5.4 14.2 4.8C14.8 4.3 15.6 4 16.4 4V2C15.8 2 15.1 2 14.5 2Z"/></svg>,
  // Bishop
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M12 2C10.9 2 10 2.9 10 4C10 4.5 10.2 4.9 10.5 5.2C8.6 6.5 7 9.1 7 12C7 14.9 8.6 17.5 10.5 18.8C10.2 19.1 10 19.5 10 20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20C14 19.5 13.8 19.1 13.5 18.8C15.4 17.5 17 14.9 17 12C17 9.1 15.4 6.5 13.5 5.2C13.8 4.9 14 4.5 14 4C14 2.9 13.1 2 12 2M12 7A5 5 0 0 1 17 12A5 5 0 0 1 12 17A5 5 0 0 1 7 12A5 5 0 0 1 12 7M11 9V11H9V13H11V15H13V13H15V11H13V9H11Z"/></svg>,
  // Queen
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M12 2C10.9 2 10 2.9 10 4C10 4.8 10.5 5.5 11.2 5.8L9 11L6.8 5.8C7.5 5.5 8 4.8 8 4C8 2.9 7.1 2 6 2C4.9 2 4 2.9 4 4C4 4.8 4.5 5.5 5.2 5.8L7 16H17L18.8 5.8C19.5 5.5 20 4.8 20 4C20 2.9 19.1 2 18 2C16.9 2 16 2.9 16 4C16 4.8 16.5 5.5 17.2 5.8L15 11L12.8 5.8C13.5 5.5 14 4.8 14 4C14 2.9 13.1 2 12 2M7 18V20H17V18H7M5 20V22H19V20H5Z"/></svg>,
  // King
  <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M11 2V4H9V6H11V8H13V6H15V4H13V2H11M7 10V18H17V10H7M5 20V22H19V20H5Z"/></svg>
];

const FloatingChessPieces = () => {
  // Generate a random set of pieces to float across the screen
  const pieces = useMemo(() => {
    const arr = [];
    // Increase quantity of pieces for a more dynamic field
    for (let i = 0; i < 25; i++) {
      arr.push({
        id: i,
        icon: CHESS_PIECES[Math.floor(Math.random() * CHESS_PIECES.length)],
        size: Math.random() * 40 + 20, // 20px to 60px
        startX: Math.random() * 100, // percentage across screen width
        startY: Math.random() * 100, // distribute them initially across the whole height
        duration: Math.random() * 30 + 25, // 25s to 55s slow drift
        delay: 0,
        opacity: Math.random() * 0.08 + 0.03, // very faint (0.03 to 0.11 opacity) - completely non-glowing
        rotationOffset: Math.random() * 360, // starting rotation
        xDrift: (Math.random() - 0.5) * 20, // horizontal drift amount
      });
    }
    return arr;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute text-white"
          initial={{ 
            x: `${piece.startX}vw`, 
            y: `${piece.startY}vh`,
            rotate: piece.rotationOffset
          }}
          animate={{ 
            y: [null, '-20vh'], 
            rotate: piece.rotationOffset + 360,
            x: [null, `${piece.startX + piece.xDrift}vw`]
          }}
          transition={{
            duration: piece.duration,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: piece.size,
            height: piece.size,
            opacity: piece.opacity,
          }}
        >
          {piece.icon}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingChessPieces;
