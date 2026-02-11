import { motion } from 'framer-motion'
import { clsx } from 'clsx'

const variants = {
  primary: 'bg-accent text-white',
  secondary: 'bg-card text-white border border-white/10',
  danger: 'bg-red-600 text-white',
  ghost: 'bg-transparent text-white/70 hover:text-white',
}

export default function Button({ children, variant = 'primary', className = '', disabled, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={clsx(
        'flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
        variants[variant],
        disabled && 'opacity-40 cursor-not-allowed',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}
