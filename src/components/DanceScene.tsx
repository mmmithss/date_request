import React, { useEffect, useRef } from "react"
import * as THREE from "three"

interface DanceSceneProps {
  accepted: boolean
}

// Procedural texture for guy's face with facial features, eyes, smile, bandana pattern
function createGuyFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext("2d")!

  // Skin base
  ctx.fillStyle = "#a86847"
  ctx.fillRect(0, 0, 512, 512)

  // Black Bandana with paisley / geometric dots pattern on top half
  ctx.fillStyle = "#111111"
  ctx.fillRect(0, 0, 512, 170)

  // White bandana motifs
  ctx.fillStyle = "rgba(255,255,255,0.75)"
  for (let x = 30; x < 500; x += 45) {
    for (let y = 30; y < 150; y += 35) {
      ctx.beginPath()
      ctx.arc(x, y, 3.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeRect(x - 6, y - 6, 12, 12)
    }
  }

  // Bandana lower border
  ctx.fillStyle = "#222222"
  ctx.fillRect(0, 160, 512, 12)

  // Eyebrows
  ctx.strokeStyle = "#1f140e"
  ctx.lineWidth = 9
  ctx.lineCap = "round"
  ctx.beginPath()
  ctx.moveTo(140, 215)
  ctx.lineTo(215, 205)
  ctx.moveTo(295, 205)
  ctx.lineTo(370, 215)
  ctx.stroke()

  // Eyes
  const drawEye = (x: number, y: number) => {
    // Sclera
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.ellipse(x, y, 22, 13, 0, 0, Math.PI * 2)
    ctx.fill()

    // Iris
    ctx.fillStyle = "#3e2417"
    ctx.beginPath()
    ctx.arc(x + 2, y, 8, 0, Math.PI * 2)
    ctx.fill()

    // Pupil
    ctx.fillStyle = "#000000"
    ctx.beginPath()
    ctx.arc(x + 2, y, 4, 0, Math.PI * 2)
    ctx.fill()

    // Catchlight
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(x + 5, y - 3, 2.5, 0, Math.PI * 2)
    ctx.fill()
  }
  drawEye(180, 240)
  drawEye(330, 240)

  // Nose bridge & shading
  ctx.strokeStyle = "rgba(100, 45, 25, 0.45)"
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(256, 235)
  ctx.lineTo(250, 310)
  ctx.lineTo(265, 315)
  ctx.stroke()

  // Charming smile
  ctx.strokeStyle = "#4a2113"
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(256, 350, 42, 0.15 * Math.PI, 0.85 * Math.PI)
  ctx.stroke()

  // Subtle stubble / shadow (GTA style)
  ctx.fillStyle = "rgba(40, 20, 10, 0.15)"
  ctx.beginPath()
  ctx.arc(256, 390, 75, 0, Math.PI)
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// Procedural texture for girl's face with brown skin, bangs, eyeliner, warm lipstick
function createGirlFaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext("2d")!

  // Warm brown skin tone
  ctx.fillStyle = "#9c5d3f"
  ctx.fillRect(0, 0, 512, 512)

  // Brown hair fringe / bangs at the top
  ctx.fillStyle = "#2b170e"
  ctx.fillRect(0, 0, 512, 160)

  // Hair strand accents on bangs
  ctx.strokeStyle = "#442416"
  ctx.lineWidth = 6
  for (let x = 20; x < 500; x += 30) {
    ctx.beginPath()
    ctx.moveTo(x, 10)
    ctx.lineTo(x + (Math.random() - 0.5) * 20, 165)
    ctx.stroke()
  }

  // Soft feminine eyebrows
  ctx.strokeStyle = "#20120b"
  ctx.lineWidth = 6
  ctx.lineCap = "round"
  ctx.beginPath()
  ctx.arc(175, 220, 36, Math.PI * 1.1, Math.PI * 1.85)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(335, 220, 36, Math.PI * 1.15, Math.PI * 1.9)
  ctx.stroke()

  // Eyes with winged eyeliner & mascara
  const drawGirlEye = (x: number, y: number, isRight: boolean) => {
    // Sclera
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.ellipse(x, y, 22, 14, 0, 0, Math.PI * 2)
    ctx.fill()

    // Warm hazel / brown iris
    ctx.fillStyle = "#4a2d18"
    ctx.beginPath()
    ctx.arc(x, y, 9, 0, Math.PI * 2)
    ctx.fill()

    // Pupil
    ctx.fillStyle = "#000000"
    ctx.beginPath()
    ctx.arc(x, y, 4.5, 0, Math.PI * 2)
    ctx.fill()

    // Sparkle catchlights
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(x - 3, y - 3, 3, 0, Math.PI * 2)
    ctx.fill()

    // Winged eyeliner
    ctx.strokeStyle = "#0d0705"
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(x, y - 2, 22, Math.PI * 1.1, Math.PI * 1.9)
    ctx.stroke()

    // Wing tip
    ctx.beginPath()
    if (isRight) {
      ctx.moveTo(x + 20, y - 2)
      ctx.lineTo(x + 32, y - 8)
    } else {
      ctx.moveTo(x - 20, y - 2)
      ctx.lineTo(x - 32, y - 8)
    }
    ctx.stroke()
  }
  drawGirlEye(175, 245, false)
  drawGirlEye(335, 245, true)

  // Soft nose
  ctx.strokeStyle = "rgba(110, 45, 25, 0.4)"
  ctx.lineWidth = 3.5
  ctx.beginPath()
  ctx.arc(256, 305, 12, 0.1 * Math.PI, 0.9 * Math.PI)
  ctx.stroke()

  // Rosy cheeks
  ctx.fillStyle = "rgba(220, 90, 110, 0.22)"
  ctx.beginPath()
  ctx.ellipse(145, 305, 36, 20, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(365, 305, 36, 20, 0, 0, Math.PI * 2)
  ctx.fill()

  // Rose-red smiling lips
  ctx.fillStyle = "#d9465a"
  ctx.beginPath()
  ctx.ellipse(256, 365, 34, 16, 0, 0, Math.PI * 2)
  ctx.fill()

  // Smile line
  ctx.strokeStyle = "#7a1a28"
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(256, 355, 32, 0.2 * Math.PI, 0.8 * Math.PI)
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// Procedural texture for guy's oversized shirt with horizontal shooting comets & number 11
function createGuyShirtTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext("2d")!

  // White shirt base with fabric crease shading
  ctx.fillStyle = "#f5f5f7"
  ctx.fillRect(0, 0, 512, 512)

  // Subtle fabric fold shadows (GTA style character texturing)
  ctx.fillStyle = "rgba(0,0,0,0.06)"
  ctx.beginPath()
  ctx.moveTo(80, 0)
  ctx.lineTo(160, 512)
  ctx.lineTo(210, 512)
  ctx.lineTo(120, 0)
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(430, 0)
  ctx.lineTo(350, 512)
  ctx.lineTo(300, 512)
  ctx.lineTo(390, 0)
  ctx.fill()

  // Cosmic galaxy graphic patch across chest
  const grad = ctx.createLinearGradient(90, 150, 420, 270)
  grad.addColorStop(0, "rgba(15, 10, 40, 0.95)")
  grad.addColorStop(0.45, "rgba(60, 20, 100, 0.92)")
  grad.addColorStop(1, "rgba(210, 60, 130, 0.88)")

  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.roundRect(110, 135, 290, 220, 28)
  ctx.fill()

  // Horizontal flying comets and shooting stars
  const drawComet = (x: number, y: number, length: number, color: string) => {
    ctx.strokeStyle = color
    ctx.lineWidth = 5
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(x - length, y - 6)
    ctx.lineTo(x, y)
    ctx.stroke()

    // Comet glowing core
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(x, y, 6, 0, Math.PI * 2)
    ctx.fill()
  }

  drawComet(350, 190, 160, "#ffdd44")
  drawComet(310, 230, 125, "#ff88dd")
  drawComet(375, 270, 145, "#44eeff")

  // Star sparkles
  ctx.fillStyle = "#fffb88"
  ;[[160, 180], [200, 220], [330, 220], [260, 175], [180, 290], [280, 260]].forEach(([sx, sy]) => {
    ctx.beginPath()
    ctx.arc(sx, sy, 3.5, 0, Math.PI * 2)
    ctx.fill()
  })

  // Large Bold number 11 in sports jersey / street style
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 64px 'Impact', system-ui, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.strokeStyle = "#1a0b2e"
  ctx.lineWidth = 7
  ctx.strokeText("11", 256, 312)
  ctx.fillText("11", 256, 312)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export const DanceScene: React.FC<DanceSceneProps> = ({ accepted }) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const acceptedRef = useRef(accepted)

  useEffect(() => {
    acceptedRef.current = accepted
  }, [accepted])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 480
    const height = container.clientHeight || 210

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000)
    camera.position.set(0, 1.25, 7.2)

    // WebGL Renderer with smooth shadows
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // Lighting (Stylized game environment: warm key light, cool backlight, ambient fill)
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.5)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffedd5, 1.8)
    mainLight.position.set(4, 7, 5)
    mainLight.castShadow = true
    scene.add(mainLight)

    const rimLight = new THREE.DirectionalLight(0xf472b6, 1.4)
    rimLight.position.set(-4, 5, -3)
    scene.add(rimLight)

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 0.6)
    fillLight.position.set(0, -3, 4)
    scene.add(fillLight)

    // Circular Stage Platform on top of card
    const stageGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.2, 48)
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0xfff1f2,
      roughness: 0.35,
      metalness: 0.15,
    })
    const stage = new THREE.Mesh(stageGeo, stageMat)
    stage.position.y = -0.1
    stage.receiveShadow = true
    scene.add(stage)

    // Gold trim
    const trim = new THREE.Mesh(
      new THREE.TorusGeometry(3.68, 0.045, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25, metalness: 0.65 })
    )
    trim.rotation.x = Math.PI / 2
    trim.position.y = 0.01
    scene.add(trim)

    // Textures & Game Character Materials
    const guyFaceTexture = createGuyFaceTexture()
    const girlFaceTexture = createGirlFaceTexture()
    const guyShirtTexture = createGuyShirtTexture()

    const guySkinMat = new THREE.MeshStandardMaterial({ color: 0xa86847, roughness: 0.65 })
    const girlSkinMat = new THREE.MeshStandardMaterial({ color: 0x9c5d3f, roughness: 0.65 })
    const guyHairMat = new THREE.MeshStandardMaterial({ color: 0x22130c, roughness: 0.85 })
    const girlHairMat = new THREE.MeshStandardMaterial({ color: 0x2b170e, roughness: 0.85 })

    const guyShirtMat = new THREE.MeshStandardMaterial({
      map: guyShirtTexture,
      roughness: 0.65,
      bumpScale: 0.02,
    })

    const yellowDressMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.32,
      metalness: 0.12,
    })

    const blackPantsMat = new THREE.MeshStandardMaterial({
      color: 0x171717,
      roughness: 0.8,
    })

    const sneakersMat = new THREE.MeshStandardMaterial({
      color: 0x262626,
      roughness: 0.5,
    })

    const heelsMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
    })

    // -------------------------------------------------------------
    // BUILD SAN ANDREAS / GAME STYLE GUY CHARACTER
    // (Anatomical torso, limbs with joints, face texture, long hair, bandana)
    // -------------------------------------------------------------
    const guyGroup = new THREE.Group()

    // Pelvis root
    const guyHips = new THREE.Group()
    guyHips.position.y = 0.98
    guyGroup.add(guyHips)

    // Torso: Sculpted, rounded game character chest & waist
    const guyChestGeo = new THREE.CylinderGeometry(0.34, 0.29, 0.44, 20)
    guyChestGeo.scale(1, 1, 0.72)
    const guyChest = new THREE.Mesh(guyChestGeo, guyShirtMat)
    guyChest.position.y = 0.45
    guyChest.castShadow = true
    guyHips.add(guyChest)

    const guyBellyGeo = new THREE.CylinderGeometry(0.29, 0.32, 0.32, 20)
    guyBellyGeo.scale(1, 1, 0.72)
    const guyBelly = new THREE.Mesh(guyBellyGeo, guyShirtMat)
    guyBelly.position.y = 0.14
    guyBelly.castShadow = true
    guyHips.add(guyBelly)

    // Oversized t-shirt bottom hem drape
    const guyShirtHem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.36, 0.16, 20),
      new THREE.MeshStandardMaterial({ color: 0xf5f5f7, roughness: 0.7 })
    )
    guyShirtHem.position.y = -0.06
    guyHips.add(guyShirtHem)

    // Neck
    const guyNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.15, 16), guySkinMat)
    guyNeck.position.y = 0.72
    guyHips.add(guyNeck)

    // Head with textured game face & bandana
    const guyHeadGroup = new THREE.Group()
    guyHeadGroup.position.y = 0.93
    guyHips.add(guyHeadGroup)

    const guyHeadGeo = new THREE.SphereGeometry(0.21, 28, 28)
    guyHeadGeo.scale(0.9, 1.05, 0.95)
    const guyHeadMat = new THREE.MeshStandardMaterial({
      map: guyFaceTexture,
      roughness: 0.6,
    })
    const guyHead = new THREE.Mesh(guyHeadGeo, guyHeadMat)
    guyHead.rotation.y = -Math.PI / 2
    guyHead.castShadow = true
    guyHeadGroup.add(guyHead)

    // Bandana knot in back
    const bandanaKnot = new THREE.Mesh(
      new THREE.ConeGeometry(0.05, 0.22, 10),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 })
    )
    bandanaKnot.rotation.z = -Math.PI / 3.5
    bandanaKnot.position.set(-0.16, 0.06, -0.15)
    guyHeadGroup.add(bandanaKnot)

    // Wavy Long Hair Strands (Game character polygon hair cards style)
    const guyHairCrown = new THREE.Mesh(
      new THREE.SphereGeometry(0.225, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.5),
      guyHairMat
    )
    guyHairCrown.position.set(0, 0.08, -0.02)
    guyHeadGroup.add(guyHairCrown)

    const createHairCluster = (x: number, y: number, z: number, rZ: number, scaleY: number) => {
      const strand = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.52 * scaleY, 8), guyHairMat)
      strand.position.set(x, y, z)
      strand.rotation.z = rZ
      strand.rotation.x = 0.1
      return strand
    }
    guyHeadGroup.add(createHairCluster(-0.16, -0.18, -0.06, 0.2, 1.1))
    guyHeadGroup.add(createHairCluster(0.16, -0.18, -0.06, -0.2, 1.1))
    guyHeadGroup.add(createHairCluster(0, -0.22, -0.16, 0, 1.25))

    // Guy Arms (Shoulder sleeve + Forearm + Hand)
    const createGuyArm = (isLeft: boolean) => {
      const armGroup = new THREE.Group()
      const sign = isLeft ? -1 : 1
      armGroup.position.set(sign * 0.38, 0.62, 0)

      // Oversized shirt sleeve
      const sleeve = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.13, 0.26, 16),
        guyShirtMat
      )
      sleeve.position.y = -0.1
      armGroup.add(sleeve)

      // Forearm (Skin)
      const forearm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.065, 0.34, 16),
        guySkinMat
      )
      forearm.position.y = -0.34
      armGroup.add(forearm)

      // Hand
      const hand = new THREE.Mesh(
        new THREE.SphereGeometry(0.065, 14, 14),
        guySkinMat
      )
      hand.scale.set(0.9, 1.2, 0.7)
      hand.position.y = -0.53
      armGroup.add(hand)

      return armGroup
    }

    const guyLeftArm = createGuyArm(true)
    const guyRightArm = createGuyArm(false)
    guyHips.add(guyLeftArm)
    guyHips.add(guyRightArm)

    // Guy Legs (Baggy San Andreas cargo style pants + Sneakers)
    const createGuyLeg = (isLeft: boolean) => {
      const legGroup = new THREE.Group()
      const sign = isLeft ? -1 : 1
      legGroup.position.set(sign * 0.18, 0, 0)

      // Thigh
      const thigh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.12, 0.46, 16),
        blackPantsMat
      )
      thigh.position.y = -0.23
      thigh.castShadow = true
      legGroup.add(thigh)

      // Shin / Lower leg with baggy creases
      const shin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.11, 0.44, 16),
        blackPantsMat
      )
      shin.position.y = -0.62
      shin.castShadow = true
      legGroup.add(shin)

      // Sneaker
      const shoe = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.1, 0.28),
        sneakersMat
      )
      shoe.position.set(0, -0.86, 0.05)
      shoe.castShadow = true
      legGroup.add(shoe)

      return legGroup
    }

    const guyLeftLeg = createGuyLeg(true)
    const guyRightLeg = createGuyLeg(false)
    guyHips.add(guyLeftLeg)
    guyHips.add(guyRightLeg)

    scene.add(guyGroup)

    // -------------------------------------------------------------
    // BUILD LA LA LAND GAME STYLE GIRL CHARACTER
    // (Feminine silhouette, canary yellow dress, bangs, heels)
    // -------------------------------------------------------------
    const girlGroup = new THREE.Group()

    const girlHips = new THREE.Group()
    girlHips.position.y = 0.94
    girlGroup.add(girlHips)

    // Yellow Bodice: Tailored fitted dress
    const girlBust = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.18, 0.28, 20),
      yellowDressMat
    )
    girlBust.position.y = 0.44
    girlBust.castShadow = true
    girlHips.add(girlBust)

    const girlWaist = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.23, 0.24, 20),
      yellowDressMat
    )
    girlWaist.position.y = 0.22
    girlWaist.castShadow = true
    girlHips.add(girlWaist)

    // La La Land Flowing Yellow Pleated Skirt
    const skirtGeo = new THREE.ConeGeometry(0.56, 0.68, 28, 2, true)
    skirtGeo.translate(0, -0.34, 0)
    const girlSkirt = new THREE.Mesh(skirtGeo, yellowDressMat)
    girlSkirt.position.y = 0.14
    girlSkirt.castShadow = true
    girlHips.add(girlSkirt)

    // Neck
    const girlNeck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.09, 0.15, 16),
      girlSkinMat
    )
    girlNeck.position.y = 0.64
    girlHips.add(girlNeck)

    // Head with textured face (winged eyes, bangs, lipstick)
    const girlHeadGroup = new THREE.Group()
    girlHeadGroup.position.y = 0.84
    girlHips.add(girlHeadGroup)

    const girlHeadGeo = new THREE.SphereGeometry(0.19, 28, 28)
    girlHeadGeo.scale(0.88, 1.05, 0.92)
    const girlHeadMat = new THREE.MeshStandardMaterial({
      map: girlFaceTexture,
      roughness: 0.58,
    })
    const girlHead = new THREE.Mesh(girlHeadGeo, girlHeadMat)
    girlHead.rotation.y = -Math.PI / 2
    girlHead.castShadow = true
    girlHeadGroup.add(girlHead)

    // Hair: Crown with Front Bangs & Long Flowing Hair past shoulders
    const girlHairCrown = new THREE.Mesh(
      new THREE.SphereGeometry(0.205, 20, 20),
      girlHairMat
    )
    girlHairCrown.position.set(0, 0.05, -0.04)
    girlHeadGroup.add(girlHairCrown)

    // Long hair drape behind back
    const girlHairBack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.26, 0.62, 16),
      girlHairMat
    )
    girlHairBack.position.set(0, -0.24, -0.09)
    girlHairBack.rotation.x = 0.12
    girlHeadGroup.add(girlHairBack)

    // Girl Arms
    const createGirlArm = (isLeft: boolean) => {
      const armGroup = new THREE.Group()
      const sign = isLeft ? -1 : 1
      armGroup.position.set(sign * 0.25, 0.54, 0)

      // Upper arm
      const upperArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.05, 0.28, 16),
        girlSkinMat
      )
      upperArm.position.y = -0.14
      armGroup.add(upperArm)

      // Forearm
      const forearm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.045, 0.28, 16),
        girlSkinMat
      )
      forearm.position.y = -0.38
      armGroup.add(forearm)

      // Hand
      const hand = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 12, 12),
        girlSkinMat
      )
      hand.scale.set(0.8, 1.2, 0.6)
      hand.position.y = -0.52
      armGroup.add(hand)

      return armGroup
    }

    const girlLeftArm = createGirlArm(true)
    const girlRightArm = createGirlArm(false)
    girlHips.add(girlLeftArm)
    girlHips.add(girlRightArm)

    // Girl Legs & White Dancing Heels
    const createGirlLeg = (isLeft: boolean) => {
      const legGroup = new THREE.Group()
      const sign = isLeft ? -1 : 1
      legGroup.position.set(sign * 0.12, 0, 0)

      // Thigh
      const thigh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.07, 0.44, 16),
        girlSkinMat
      )
      thigh.position.y = -0.22
      thigh.castShadow = true
      legGroup.add(thigh)

      // Calf
      const calf = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.055, 0.44, 16),
        girlSkinMat
      )
      calf.position.y = -0.6
      calf.castShadow = true
      legGroup.add(calf)

      // White dancing shoe
      const heel = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.07, 0.2),
        heelsMat
      )
      heel.position.set(0, -0.83, 0.03)
      heel.castShadow = true
      legGroup.add(heel)

      return legGroup
    }

    const girlLeftLeg = createGirlLeg(true)
    const girlRightLeg = createGirlLeg(false)
    girlHips.add(girlLeftLeg)
    girlHips.add(girlRightLeg)

    scene.add(girlGroup)

    // 3D Heart particle sparkles
    const heartShape = new THREE.Shape()
    heartShape.moveTo(0, 0)
    heartShape.bezierCurveTo(0, 0.15, -0.2, 0.3, -0.35, 0.3)
    heartShape.bezierCurveTo(-0.6, 0.3, -0.6, -0.05, -0.6, -0.05)
    heartShape.bezierCurveTo(-0.6, -0.3, -0.25, -0.6, 0, -0.85)
    heartShape.bezierCurveTo(0.25, -0.6, 0.6, -0.3, 0.6, -0.05)
    heartShape.bezierCurveTo(0.6, -0.05, 0.6, 0.3, 0.35, 0.3)
    heartShape.bezierCurveTo(0.2, 0.3, 0, 0.15, 0, 0)

    const miniHeartGeo = new THREE.ShapeGeometry(heartShape)
    const miniHeartMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      side: THREE.DoubleSide,
      roughness: 0.3,
    })

    const floatingHeartsList: { mesh: THREE.Mesh; speed: number; rotSpeed: number }[] = []
    for (let i = 0; i < 14; i++) {
      const hm = new THREE.Mesh(miniHeartGeo, miniHeartMat)
      hm.scale.set(0.12, 0.12, 0.12)
      hm.position.set(
        (Math.random() - 0.5) * 4.5,
        0.5 + Math.random() * 2.2,
        (Math.random() - 0.5) * 2
      )
      hm.visible = false
      scene.add(hm)
      floatingHeartsList.push({
        mesh: hm,
        speed: 0.015 + Math.random() * 0.02,
        rotSpeed: 0.02 + Math.random() * 0.03,
      })
    }

    // Positions
    let guyX = -2.1
    let girlX = 2.1
    const targetGuyWaiting = -1.9
    const targetGirlWaiting = 1.9
    const targetGuyDancing = -0.38
    const targetGirlDancing = 0.38

    // Interactive mouse parallax
    let mouseX = 0
    let mouseY = 0
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    window.addEventListener("mousemove", onMouseMove, { passive: true })

    // Resize handler
    const onResize = () => {
      if (!container) return
      const w = container.clientWidth || 480
      const h = container.clientHeight || 210
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", onResize)

    // Animation Loop
    let animationFrameId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      const isAccepted = acceptedRef.current

      // Smooth camera parallax tracking
      camera.position.x += (mouseX * 0.45 - camera.position.x) * 0.05
      camera.position.y += (1.25 - mouseY * 0.25 - camera.position.y) * 0.05
      camera.lookAt(0, 0.95, 0)

      if (!isAccepted) {
        // WAITING STATE: Gesturing, waiting for user response
        guyX += (targetGuyWaiting - guyX) * 0.08
        girlX += (targetGirlWaiting - girlX) * 0.08

        guyGroup.position.set(guyX, 0, 0)
        girlGroup.position.set(girlX, 0, 0)

        // Turn towards each other
        guyGroup.rotation.y = 0.68 + Math.sin(t * 1.5) * 0.08
        girlGroup.rotation.y = -0.68 - Math.sin(t * 1.5) * 0.08

        // Guy waiting gesture: inviting arm wave & gentle breathing
        guyHips.position.y = 0.98 + Math.sin(t * 2) * 0.02
        guyLeftArm.rotation.z = -0.22 + Math.sin(t * 1.8) * 0.08
        guyRightArm.rotation.z = 0.78 + Math.sin(t * 2.2) * 0.15
        guyRightArm.rotation.x = -0.42 + Math.sin(t * 2) * 0.1
        guyLeftLeg.rotation.x = Math.sin(t * 2) * 0.05
        guyRightLeg.rotation.x = -Math.sin(t * 2) * 0.05

        // Girl waiting gesture: hand on hip, feminine pose
        girlHips.position.y = 0.94 + Math.cos(t * 2) * 0.02
        girlRightArm.rotation.z = 0.35 + Math.sin(t * 1.8) * 0.08
        girlLeftArm.rotation.z = -0.78 + Math.sin(t * 2.2) * 0.12
        girlLeftArm.rotation.x = -0.32
        girlSkirt.rotation.z = Math.sin(t * 2) * 0.05

        floatingHeartsList.forEach((h) => (h.mesh.visible = false))
      } else {
        // ACCEPTED STATE: Come together on stage and perform continuous waltz dance loop
        guyX += (targetGuyDancing - guyX) * 0.05
        girlX += (targetGirlDancing - girlX) * 0.05

        guyGroup.position.set(guyX, 0, 0)
        girlGroup.position.set(girlX, 0, 0)

        const danceSpeed = 3.2
        const dancePhase = t * danceSpeed

        // Rhythmic dance bounce
        const bounce = Math.abs(Math.sin(dancePhase)) * 0.08
        guyHips.position.y = 0.98 + bounce
        girlHips.position.y = 0.94 + bounce

        // Waltz twirl & tilt
        guyGroup.rotation.y = 0.85 + Math.sin(dancePhase * 0.5) * 0.35
        girlGroup.rotation.y = -0.85 - Math.sin(dancePhase * 0.5) * 0.35

        // Synchronized hand-in-hand hold
        guyRightArm.rotation.z = 1.15 + Math.sin(dancePhase) * 0.2
        guyRightArm.rotation.x = -0.65 + Math.cos(dancePhase) * 0.2
        guyLeftArm.rotation.z = -0.65 - Math.sin(dancePhase) * 0.15
        guyLeftArm.rotation.x = 0.35

        girlLeftArm.rotation.z = -1.15 - Math.sin(dancePhase) * 0.2
        girlLeftArm.rotation.x = -0.65 + Math.cos(dancePhase) * 0.2
        girlRightArm.rotation.z = 0.85 + Math.sin(dancePhase) * 0.25
        girlRightArm.rotation.x = 0.2

        // Flaring skirt physics
        girlSkirt.rotation.y = Math.sin(dancePhase * 2) * 0.35
        girlSkirt.scale.set(
          1 + Math.sin(dancePhase * 2) * 0.16,
          1,
          1 + Math.cos(dancePhase * 2) * 0.16
        )

        // Dancing footwork
        guyLeftLeg.rotation.x = Math.sin(dancePhase) * 0.35
        guyRightLeg.rotation.x = -Math.sin(dancePhase) * 0.35
        girlLeftLeg.rotation.x = -Math.sin(dancePhase) * 0.32
        girlRightLeg.rotation.x = Math.sin(dancePhase) * 0.32

        // 3D Floating Hearts
        floatingHeartsList.forEach((h) => {
          h.mesh.visible = true
          h.mesh.position.y += h.speed
          h.mesh.rotation.z += h.rotSpeed
          if (h.mesh.position.y > 2.8) {
            h.mesh.position.y = 0.2
            h.mesh.position.x = (Math.random() - 0.5) * 2.8
          }
        })
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", onResize)
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="w-full h-[180px] sm:h-[220px] md:h-[240px] relative pointer-events-none z-20"
      style={{ touchAction: "none" }}
    />
  )
}
