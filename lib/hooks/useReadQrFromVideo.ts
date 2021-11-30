import jsqr from 'jsqr'
import { useEffect, useRef, useState } from 'react'

const useReadQrFromVideo = (onQrCodeRead: (content: string) => void) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoLive, setVideoLive] = useState(false)
  useEffect(() => {
    const video = videoRef.current!
    let stopTick = false
    let stream: MediaStream | undefined

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
          onQrCodeRead(qr.data)
          return
        }

        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    start()

    return () => {
      console.log(stream, video, stream?.getTracks())
      if (stream !== undefined) {
        stream.getTracks().forEach(track => track.stop())
        stream.addEventListener('addtrack', track => track.track.stop())
      }
      stopTick = true
    }
  }, [onQrCodeRead])
  return { videoRef, videoLive }
}

export default useReadQrFromVideo
