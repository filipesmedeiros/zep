import { FC } from 'react'

export interface Props {
  vertical?: boolean
  className?: string
  innerClassName?: string
}

const CornerButton: FC<Props> = ({ vertical, className, innerClassName }) => {
  return vertical ? (
    <svg
      className={className}
      width="159"
      height="288"
      fill="currentColor"
      viewBox="0 0 159 288"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 20C0 8.9543 8.95431 0 20 0H139C150.046 0 159 8.95431 159 20V267.277C159 285.015 137.622 293.975 124.976 281.536L5.97583 164.497C2.15302 160.737 0 155.6 0 150.238V20Z"
        className={innerClassName}
      />
    </svg>
  ) : (
    <svg
      className={className}
      width="288"
      height="159"
      fill="currentColor"
      viewBox="0 0 288 159"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 8.74228e-07C8.9543 3.91405e-07 -3.91405e-07 8.95431 -8.74228e-07 20L-6.07588e-06 139C-6.55871e-06 150.046 8.9543 159 20 159L267.277 159C285.015 159 293.975 137.622 281.536 124.976L164.497 5.97584C160.737 2.15303 155.6 6.80148e-06 150.238 6.56711e-06L20 8.74228e-07Z"
        className={innerClassName}
      />
    </svg>
  )
}

export default CornerButton
