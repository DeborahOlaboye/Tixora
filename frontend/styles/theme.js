// Centralized theme configuration using ONLY the specified Tixora logo colors
export const tixoraTheme = {
  colors: {
    primary: {
      purple: "#A855F7", // Neon Purple - Primary highlight color
      blue: "#06B6D4", // Neon Blue - Secondary accent color
    },
    background: {
      dark: "#0F172A", // Dark Navy - Background (base)
    },
    text: {
      primary: "#FFFFFF", // White - Text, contrast against dark
    },
  },

  gradients: {
    primary: "from-[#A855F7] to-[#06B6D4]",
    primaryReverse: "from-[#06B6D4] to-[#A855F7]",
    background: "bg-[#0F172A]",
  },

  components: {
    button: {
      primary:
        "bg-gradient-to-r from-[#A855F7] to-[#06B6D4] hover:opacity-90 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105",
      secondary:
        "bg-[#0F172A] hover:bg-opacity-80 text-white border border-[#A855F7] hover:border-[#06B6D4] px-8 py-3 rounded-xl transition-all duration-300",
    },
    card: "bg-[#0F172A] border border-[#A855F7]/30 rounded-2xl p-6 hover:border-[#06B6D4]/50 transition-all duration-300",
    input:
      "bg-[#0F172A] border border-[#A855F7]/50 text-white placeholder-white/50 rounded-xl px-4 py-3 focus:border-[#06B6D4] transition-all duration-300",
    section: "py-20 px-4 bg-[#0F172A]",
    status: {
      success: "text-[#06B6D4] bg-[#06B6D4]/10 border-[#06B6D4]/30",
      warning: "text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/30",
      error: "text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/30",
    },
  },

  // Animation classes remain the same
  animations: {
    fadeInUp: "scroll-animate opacity-0 translate-y-8",
    fadeInUpSlow: "scroll-animate-slow opacity-0 translate-y-12",
    hover: "transition-all duration-300 transform hover:scale-105",
  },
}

// Utility function to get theme classes
export const getThemeClass = (category, variant = "primary") => {
  return tixoraTheme.components[category] || tixoraTheme.gradients[variant] || ""
}
