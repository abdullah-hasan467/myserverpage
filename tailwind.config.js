/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space': '#081120',
        'electric-cyan': '#00E5FF',
        'royal-purple': '#7B61FF',
        'premium-gold': '#FFD700',
        'space-light': '#0d1f35',
        'space-mid': '#0a1628',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'ball-fly': 'ballFly 5s ease-in-out infinite',
        'aurora': 'aurora 8s ease-in-out infinite',
        'border-glow': 'borderGlow 3s ease-in-out infinite',
        'light-sweep': 'lightSweep 5s ease-in-out infinite',
        'particle': 'particle 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,229,255,0.5)' },
          '50%': { boxShadow: '0 0 50px rgba(0,229,255,0.9), 0 0 80px rgba(123,97,255,0.4)' },
        },
        ballFly: {
          '0%': { transform: 'translateX(-150px) translateY(0px) rotate(0deg)', opacity: 0 },
          '5%': { opacity: 1 },
          '50%': { transform: 'translateX(50vw) translateY(-100px) rotate(540deg)', opacity: 1 },
          '95%': { opacity: 1 },
          '100%': { transform: 'translateX(110vw) translateY(30px) rotate(1080deg)', opacity: 0 },
        },
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%', opacity: 0.7 },
          '50%': { backgroundPosition: '100% 50%', opacity: 1 },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(0,229,255,0.4)' },
          '50%': { borderColor: 'rgba(123,97,255,0.8)' },
        },
        lightSweep: {
          '0%': { transform: 'translateX(-200%) skewX(-20deg)', opacity: 0 },
          '30%': { opacity: 0.15 },
          '70%': { opacity: 0.15 },
          '100%': { transform: 'translateX(300%) skewX(-20deg)', opacity: 0 },
        },
        particle: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)', opacity: 0.3 },
          '33%': { transform: 'translateY(-30px) translateX(15px)', opacity: 0.8 },
          '66%': { transform: 'translateY(15px) translateX(-20px)', opacity: 0.5 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
