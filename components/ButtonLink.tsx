import clsx from 'clsx'
import Link from 'next/link'
import type { AnchorHTMLAttributes, FC } from 'react'

// delete if not needed
export interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: 'neutral' | 'primary'
  disabled?: boolean
}

const ButtonLink: FC<Props> = ({
  children,
  className,
  href,
  variant = 'neutral',
  disabled,
  ...props
}) => {
  return (
    <Link href={href}>
      <a
        {...props}
        className={clsx(
          variant === 'neutral'
            ? 'text-lg xs:text-xl font-bold bg-purple-100 text-gray-900 dark:bg-gray-800 dark:text-purple-50'
            : 'bg-purple-400 text-purple-50 dark:text-gray-900 active:hover:bg-purple-500 active:hover:text-purple-100 dark:active:hover:text-purple-100 md:hover:bg-purple-500 md:active:hover:bg-purple-600 md:dark:hover:text-purple-50',
          'rounded flex place-content-center p-1 transition-all shadow md:hover:cursor-pointer md:disabled:hover:cursor-default active:translate-y-0.5',
          { 'pointer-events-none opacity-80': disabled },
          className
        )}
      >
        {children}
      </a>
    </Link>
  )
}

export default ButtonLink
