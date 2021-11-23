import clsx from 'clsx'
import jsqr from 'jsqr'
import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'

const ReadQrCode: NextPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLive, setVideoLive] = useState(false)
  useEffect(() => {
    const video = videoRef.current!
    let stopTick = false
    let stream: MediaStream

    const start = async () => {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      video.srcObject = stream
      video.setAttribute('playsinline', 'true') // required to tell iOS safari we don't want fullscreen
      await video.play()
      setVideoLive(true)

      video.width = video.getBoundingClientRect().width
      video.height = video.getBoundingClientRect().height

      const tick = () => {
        if (stopTick) return

        const canvas = document.createElement('canvas')
        canvas.width = video.width
        canvas.height = video.height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(video, 0, 0, video.width, video.height)
        const qr = jsqr(
          ctx.getImageData(0, 0, video.width, video.height).data,
          video.width,
          video.height
        )

        if (qr !== null) {
          console.log(qr) // todo
          return
        }

        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    start()

    return () => {
      stream.getTracks().forEach(track => track.stop())
      stopTick = true
    }
  }, [])

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
      <h1 className="text-3xl font-semibold text-center">scan!</h1>
      <video
        className={clsx('rounded-md shadow-md', !videoLive ? 'hidden' : null)}
        ref={videoRef}
      />
      {!videoLive && (
        <div className="w-full h-64 rounded-md bg-purple-400 animate-pulse"></div>
      )}
    </div>
  )
}

export default ReadQrCode
