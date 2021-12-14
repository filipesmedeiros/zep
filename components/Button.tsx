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
          ? 'bg-primary-50 text-gray-900 dark:bg-gray-800 dark:text-primary-50'
          : toggledOn
          ? 'bg-primary-50 text-primary-400 dark:bg-gray-900 active:hover:bg-primary-500 active:hover:text-primary-100 dark:active:hover:text-primary-100 md:hover:bg-primary-500 md:active:hover:bg-primary-600 md:dark:hover:text-primary-50'
          : 'bg-primary-400 text-primary-50 dark:text-gray-900 active:hover:bg-primary-500 active:hover:text-primary-100 dark:active:hover:text-primary-100 md:hover:bg-primary-500 md:active:hover:bg-primary-600 md:dark:hover:text-primary-50',
        'p-1 rounded transition-all shadow active:translate-y-0.5 md:hover:cursor-pointer md:disabled:hover:cursor-default text-lg xs:text-xl font-bold',
        { 'opacity-80': disabled },
        className
      )}
    >
      {children}
    </button>
  )
}

export default Button
