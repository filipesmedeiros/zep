import clsx from 'clsx'
import type { ButtonHTMLAttributes, FC } from 'react'

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'neutral' | 'primary'
  disabled?: boolean
  toggledOn?: boolean
}

const Button: FC<Props> = ({
  children,
  className,
  variant = 'neutral',
  toggledOn = false,
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        variant === 'neutral'
          ? 'text-lg xs:text-xl font-bold bg-purple-100 text-gray-900 dark:bg-gray-800 dark:text-purple-50'
          : toggledOn
          ? 'bg-purple-50 text-purple-400 dark:bg-gray-900 active:hover:bg-purple-500 active:hover:text-purple-100 dark:active:hover:text-purple-100 md:hover:bg-purple-500 md:active:hover:bg-purple-600 md:dark:hover:text-purple-50'
          : 'bg-purple-400 text-purple-50 dark:text-gray-900 active:hover:bg-purple-500 active:hover:text-purple-100 dark:active:hover:text-purple-100 md:hover:bg-purple-500 md:active:hover:bg-purple-600 md:dark:hover:text-purple-50',
        'p-1 rounded transition-all shadow md:hover:cursor-pointer md:disabled:hover:cursor-default',
        { 'opacity-80': disabled },
        className
      )}
    >
      {children}
    </button>
  )
}

export default Button
