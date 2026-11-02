export async function createSampleStillLife() {
  const canvas = document.createElement('canvas')
  canvas.width = 960
  canvas.height = 720
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not paint a sample image.')

  const sky = ctx.createLinearGradient(0, 0, 0, 720)
  sky.addColorStop(0, '#efe2d0')
  sky.addColorStop(1, '#d7c0a4')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, 960, 720)

  ctx.fillStyle = '#8b5a3c'
  ctx.beginPath()
  ctx.ellipse(480, 560, 260, 48, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#6b422e'
  ctx.beginPath()
  ctx.moveTo(390, 540)
  ctx.quadraticCurveTo(360, 360, 420, 250)
  ctx.quadraticCurveTo(480, 210, 540, 250)
  ctx.quadraticCurveTo(600, 360, 570, 540)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#c45c26'
  ctx.beginPath()
  ctx.arc(330, 430, 58, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#b8952a'
  ctx.beginPath()
  ctx.arc(620, 450, 46, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#3d2a22'
  ctx.font = '600 28px "Fraunces Variable", serif'
  ctx.fillText('Sienna sample', 56, 84)

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', 0.92)
  })
  if (!blob) throw new Error('Could not create the sample image.')
  return new File([blob], 'sienna-still-life.jpg', { type: 'image/jpeg' })
}
