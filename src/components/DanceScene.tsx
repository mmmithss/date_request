import React, { useEffect, useRef } from "react"
import * as THREE from "three"

interface DanceSceneProps {
  accepted: boolean
}

// Procedural texture for guy shirt: White oversized shirt with horizontal shooting comets/stars and number 11
function createGuyShirtTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext("2d")!

  // Base white oversized shirt
  ctx.fillStyle = "#fafafa"
  ctx.fillRect(0, 0, 512, 512)

  // Cosmic comet background patch
  const grad = ctx.createLinearGradient(120, 180, 380, 260)
  grad.addColorStop(0, "rgba(20, 10, 45, 0.95)")
  grad.addColorStop(0.5, "rgba(45, 20, 85, 0.9)")
  grad.addColorStop(1, "rgba(180, 60, 120, 0.85)")

  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.roundRect(130, 160, 250, 190, 24)
  ctx.fill()

  // Horizontal flying comets and shooting stars
  const drawComet = (x: number, y: number, length: number, color: string) => {
    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.lineCap = "round"
    ctx.beginPath()
    ctx.moveTo(x - length, y - 8)
    ctx.lineTo(x, y)
    ctx.stroke()

    // Comet glowing head
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(x, y, 4.5, 0, Math.PI * 2)
    ctx.fill()
  }

  drawComet(310, 210, 120, "#ffdd44")
  drawComet(270, 245, 95, "#ff88dd")
  drawComet(330, 275, 110, "#44eeff")

  // Star sprinkles
  ctx.fillStyle = "#fffb88"
  ;[[180, 200], [210, 230], [330, 230], [250, 185], [190, 280]].forEach(([sx, sy]) => {
    ctx.beginPath()
    ctx.arc(sx, sy, 3, 0, Math.PI * 2)
    ctx.fill()
  })

  // Large Bold number 11 below
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 58px system-ui, sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("11", 256, 318)

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
    const height = container.clientHeight || 200

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000)
    camera.position.set(0, 1.3, 7.5)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.4)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffecd2, 1.8)
    mainLight.position.set(4, 8, 6)
    mainLight.castShadow = true
    scene.add(mainLight)

    const rimLight = new THREE.DirectionalLight(0xff99bb, 1.2)
    rimLight.position.set(-5, 4, -3)
    scene.add(rimLight)

    // Warm stage glow
    const stageLight = new THREE.PointLight(0xffd15c, 1.6, 12)
    stageLight.position.set(0, 0.4, 1.2)
    scene.add(stageLight)

    // Stage platform above the card
    const stageGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.22, 48)
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0xfff0f5,
      roughness: 0.4,
      metalness: 0.1,
    })
    const stage = new THREE.Mesh(stageGeo, stageMat)
    stage.position.y = -0.11
    stage.receiveShadow = true
    scene.add(stage)

    // Golden trim on stage
    const trimGeo = new THREE.TorusGeometry(3.7, 0.045, 16, 64)
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.6,
      roughness: 0.3,
    })
    const trim = new THREE.Mesh(trimGeo, trimMat)
    trim.rotation.x = Math.PI / 2
    trim.position.y = 0.01
    scene.add(trim)

    // Materials
    // Brown skin tone for both characters
    const girlSkinMat = new THREE.MeshStandardMaterial({ color: 0x9c5d3f, roughness: 0.55 })
    const guySkinMat = new THREE.MeshStandardMaterial({ color: 0xa86847, roughness: 0.55 })

    // Hair
    const darkBrownHairMat = new THREE.MeshStandardMaterial({ color: 0x2b170e, roughness: 0.85 })
    const wavyBrownHairMat = new THREE.MeshStandardMaterial({ color: 0x3d2013, roughness: 0.85 })

    // Girl: Iconic La La Land canary yellow dress
    const yellowDressMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.35,
      metalness: 0.1,
    })
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0xfdfdfd, roughness: 0.3 })

    // Guy: Black bandana, black pants, shoes, and custom comet #11 shirt
    const blackBandanaMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 })
    const blackPantsMat = new THREE.MeshStandardMaterial({ color: 0x171717, roughness: 0.8 })
    const guyShoeMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6 })
    const shirtMat = new THREE.MeshStandardMaterial({
      map: createGuyShirtTexture(),
      roughness: 0.7,
    })

    // -------------------------------------------------------------
    // BUILD GUY CHARACTER (Left Side initially: x ~ -2.4)
    // -------------------------------------------------------------
    const guyGroup = new THREE.Group()

    // Pelvis / Hips
    const guyHips = new THREE.Group()
    guyHips.position.y = 0.95
    guyGroup.add(guyHips)

    // Torso (Oversized white shirt with comet & 11)
    const guyTorsoGeo = new THREE.BoxGeometry(0.68, 0.72, 0.46)
    const guyTorso = new THREE.Mesh(guyTorsoGeo, shirtMat)
    guyTorso.position.y = 0.38
    guyTorso.castShadow = true
    guyHips.add(guyTorso)

    // Oversized shirt hem flair
    const shirtHemGeo = new THREE.BoxGeometry(0.72, 0.22, 0.5)
    const shirtHem = new THREE.Mesh(shirtHemGeo, new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.7 }))
    shirtHem.position.y = 0.04
    guyHips.add(shirtHem)

    // Neck
    const guyNeckGeo = new THREE.CylinderGeometry(0.1, 0.11, 0.14)
    const guyNeck = new THREE.Mesh(guyNeckGeo, guySkinMat)
    guyNeck.position.y = 0.78
    guyHips.add(guyNeck)

    // Head
    const guyHeadGroup = new THREE.Group()
    guyHeadGroup.position.y = 0.95
    guyHips.add(guyHeadGroup)

    const guyHeadGeo = new THREE.SphereGeometry(0.2, 24, 24)
    const guyHead = new THREE.Mesh(guyHeadGeo, guySkinMat)
    guyHead.castShadow = true
    guyHeadGroup.add(guyHead)

    // Black Bandana around head
    const bandanaGeo = new THREE.TorusGeometry(0.205, 0.038, 12, 28)
    const bandana = new THREE.Mesh(bandanaGeo, blackBandanaMat)
    bandana.rotation.x = Math.PI / 2
    bandana.position.y = 0.05
    guyHeadGroup.add(bandana)

    // Bandana knot tails in the back
    const knotGeo = new THREE.ConeGeometry(0.04, 0.16, 8)
    const knot = new THREE.Mesh(knotGeo, blackBandanaMat)
    knot.rotation.z = -Math.PI / 3
    knot.position.set(-0.16, 0.04, -0.15)
    guyHeadGroup.add(knot)

    // Guy Long Wavy Hair flowing down past shoulders
    const guyHairTop = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), wavyBrownHairMat)
    guyHairTop.position.set(0, 0.04, -0.04)
    guyHeadGroup.add(guyHairTop)

    const hairStrandGeo = new THREE.CylinderGeometry(0.06, 0.14, 0.44, 12)
    const guyHairLeft = new THREE.Mesh(hairStrandGeo, wavyBrownHairMat)
    guyHairLeft.position.set(-0.16, -0.16, -0.08)
    guyHairLeft.rotation.z = 0.15
    guyHeadGroup.add(guyHairLeft)

    const guyHairRight = new THREE.Mesh(hairStrandGeo, wavyBrownHairMat)
    guyHairRight.position.set(0.16, -0.16, -0.08)
    guyHairRight.rotation.z = -0.15
    guyHeadGroup.add(guyHairRight)

    // Guy Arms
    const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.46, 12)
    armGeo.translate(0, -0.23, 0)

    const guyLeftArm = new THREE.Group()
    guyLeftArm.position.set(-0.38, 0.66, 0)
    const guyLeftArmMesh = new THREE.Mesh(armGeo, shirtMat)
    guyLeftArm.add(guyLeftArmMesh)
    const guyLeftHand = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), guySkinMat)
    guyLeftHand.position.y = -0.48
    guyLeftArm.add(guyLeftHand)
    guyHips.add(guyLeftArm)

    const guyRightArm = new THREE.Group()
    guyRightArm.position.set(0.38, 0.66, 0)
    const guyRightArmMesh = new THREE.Mesh(armGeo, shirtMat)
    guyRightArm.add(guyRightArmMesh)
    const guyRightHand = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), guySkinMat)
    guyRightHand.position.y = -0.48
    guyRightArm.add(guyRightHand)
    guyHips.add(guyRightArm)

    // Guy Legs (Black baggy pants)
    const legGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.82, 12)
    legGeo.translate(0, -0.41, 0)

    const guyLeftLeg = new THREE.Group()
    guyLeftLeg.position.set(-0.18, 0, 0)
    const guyLeftLegMesh = new THREE.Mesh(legGeo, blackPantsMat)
    guyLeftLegMesh.castShadow = true
    guyLeftLeg.add(guyLeftLegMesh)
    const guyLeftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.09, 0.24), guyShoeMat)
    guyLeftFoot.position.set(0, -0.83, 0.04)
    guyLeftLeg.add(guyLeftFoot)
    guyHips.add(guyLeftLeg)

    const guyRightLeg = new THREE.Group()
    guyRightLeg.position.set(0.18, 0, 0)
    const guyRightLegMesh = new THREE.Mesh(legGeo, blackPantsMat)
    guyRightLegMesh.castShadow = true
    guyRightLeg.add(guyRightLegMesh)
    const guyRightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.09, 0.24), guyShoeMat)
    guyRightFoot.position.set(0, -0.83, 0.04)
    guyRightLeg.add(guyRightFoot)
    guyHips.add(guyRightLeg)

    scene.add(guyGroup)

    // -------------------------------------------------------------
    // BUILD GIRL CHARACTER (Right Side initially: x ~ +2.4)
    // -------------------------------------------------------------
    const girlGroup = new THREE.Group()

    const girlHips = new THREE.Group()
    girlHips.position.y = 0.92
    girlGroup.add(girlHips)

    // Yellow Bodice
    const girlTorsoGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.44, 16)
    const girlTorso = new THREE.Mesh(girlTorsoGeo, yellowDressMat)
    girlTorso.position.y = 0.3
    girlTorso.castShadow = true
    girlHips.add(girlTorso)

    // La La Land Flowing Yellow Flared Skirt
    const skirtGeo = new THREE.ConeGeometry(0.58, 0.65, 24, 1, true)
    skirtGeo.translate(0, -0.32, 0)
    const girlSkirt = new THREE.Mesh(skirtGeo, yellowDressMat)
    girlSkirt.position.y = 0.12
    girlSkirt.castShadow = true
    girlHips.add(girlSkirt)

    // Neck
    const girlNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.14), girlSkinMat)
    girlNeck.position.y = 0.58
    girlHips.add(girlNeck)

    // Head
    const girlHeadGroup = new THREE.Group()
    girlHeadGroup.position.y = 0.74
    girlHips.add(girlHeadGroup)

    const girlHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 24), girlSkinMat)
    girlHead.castShadow = true
    girlHeadGroup.add(girlHead)

    // Brown Long Hair with Bangs
    const girlHairTop = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), darkBrownHairMat)
    girlHairTop.position.set(0, 0.03, -0.03)
    girlHeadGroup.add(girlHairTop)

    // Front bangs
    const bangsGeo = new THREE.BoxGeometry(0.24, 0.08, 0.12)
    const girlBangs = new THREE.Mesh(bangsGeo, darkBrownHairMat)
    girlBangs.position.set(0, 0.09, 0.12)
    girlBangs.rotation.x = 0.2
    girlHeadGroup.add(girlBangs)

    // Long hair falling behind and to sides
    const girlHairLong = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 0.58, 14), darkBrownHairMat)
    girlHairLong.position.set(0, -0.22, -0.08)
    girlHeadGroup.add(girlHairLong)

    // Girl Arms
    const girlArmGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.44, 12)
    girlArmGeo.translate(0, -0.22, 0)

    const girlLeftArm = new THREE.Group()
    girlLeftArm.position.set(-0.25, 0.46, 0)
    const girlLeftArmMesh = new THREE.Mesh(girlArmGeo, girlSkinMat)
    girlLeftArm.add(girlLeftArmMesh)
    const girlLeftHand = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), girlSkinMat)
    girlLeftHand.position.y = -0.46
    girlLeftArm.add(girlLeftHand)
    girlHips.add(girlLeftArm)

    const girlRightArm = new THREE.Group()
    girlRightArm.position.set(0.25, 0.46, 0)
    const girlRightArmMesh = new THREE.Mesh(girlArmGeo, girlSkinMat)
    girlRightArm.add(girlRightArmMesh)
    const girlRightHand = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), girlSkinMat)
    girlRightHand.position.y = -0.46
    girlRightArm.add(girlRightHand)
    girlHips.add(girlRightArm)

    // Girl Legs & White Dancing Shoes
    const girlLegGeo = new THREE.CylinderGeometry(0.075, 0.06, 0.78, 12)
    girlLegGeo.translate(0, -0.39, 0)

    const girlLeftLeg = new THREE.Group()
    girlLeftLeg.position.set(-0.13, 0, 0)
    const girlLeftLegMesh = new THREE.Mesh(girlLegGeo, girlSkinMat)
    girlLeftLeg.add(girlLeftLegMesh)
    const girlLeftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.18), shoeMat)
    girlLeftShoe.position.set(0, -0.8, 0.03)
    girlLeftLeg.add(girlLeftShoe)
    girlHips.add(girlLeftLeg)

    const girlRightLeg = new THREE.Group()
    girlRightLeg.position.set(0.13, 0, 0)
    const girlRightLegMesh = new THREE.Mesh(girlLegGeo, girlSkinMat)
    girlRightLeg.add(girlRightLegMesh)
    const girlRightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.18), shoeMat)
    girlRightShoe.position.set(0, -0.8, 0.03)
    girlRightLeg.add(girlRightShoe)
    girlHips.add(girlRightLeg)

    scene.add(girlGroup)

    // Sparkle hearts particle cloud in 3D
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
      const h = container.clientHeight || 200
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

      // Smooth camera parallax
      camera.position.x += (mouseX * 0.45 - camera.position.x) * 0.05
      camera.position.y += (1.3 - mouseY * 0.25 - camera.position.y) * 0.05
      camera.lookAt(0, 0.95, 0)

      if (!isAccepted) {
        // -------------------------------------------------------------
        // WAITING STATE: Characters on sides, gesturing and swaying
        // -------------------------------------------------------------
        guyX += (targetGuyWaiting - guyX) * 0.08
        girlX += (targetGirlWaiting - girlX) * 0.08

        guyGroup.position.set(guyX, 0, 0)
        girlGroup.position.set(girlX, 0, 0)

        // Turn towards each other
        guyGroup.rotation.y = 0.65 + Math.sin(t * 1.5) * 0.08
        girlGroup.rotation.y = -0.65 - Math.sin(t * 1.5) * 0.08

        // Guy waiting gesture: inviting hand gesture
        guyHips.position.y = 0.95 + Math.sin(t * 2) * 0.02
        guyLeftArm.rotation.z = -0.25 + Math.sin(t * 1.8) * 0.08
        guyRightArm.rotation.z = 0.75 + Math.sin(t * 2.2) * 0.15
        guyRightArm.rotation.x = -0.45 + Math.sin(t * 2) * 0.1
        guyLeftLeg.rotation.x = Math.sin(t * 2) * 0.05
        guyRightLeg.rotation.x = -Math.sin(t * 2) * 0.05

        // Girl waiting gesture: hand on hip, playful foot tap
        girlHips.position.y = 0.92 + Math.cos(t * 2) * 0.02
        girlRightArm.rotation.z = 0.35 + Math.sin(t * 1.8) * 0.08
        girlLeftArm.rotation.z = -0.75 + Math.sin(t * 2.2) * 0.12
        girlLeftArm.rotation.x = -0.35
        girlSkirt.rotation.z = Math.sin(t * 2) * 0.05

        // Hide 3D floating hearts
        floatingHeartsList.forEach((h) => (h.mesh.visible = false))
      } else {
        // -------------------------------------------------------------
        // ACCEPTED STATE: Come together and perform romantic dance loop!
        // -------------------------------------------------------------
        guyX += (targetGuyDancing - guyX) * 0.05
        girlX += (targetGirlDancing - girlX) * 0.05

        guyGroup.position.set(guyX, 0, 0)
        girlGroup.position.set(girlX, 0, 0)

        // Couple faces towards each other & audience in a dance pose
        const danceSpeed = 3.2
        const dancePhase = t * danceSpeed

        // Rhythmic dance bounce & swaying
        const bounce = Math.abs(Math.sin(dancePhase)) * 0.08
        guyHips.position.y = 0.95 + bounce
        girlHips.position.y = 0.92 + bounce

        // Twirl and sway body angles
        guyGroup.rotation.y = 0.85 + Math.sin(dancePhase * 0.5) * 0.35
        girlGroup.rotation.y = -0.85 - Math.sin(dancePhase * 0.5) * 0.35

        // Guy Arms: One hand holding girl's hand, other hand guiding waist
        guyRightArm.rotation.z = 1.15 + Math.sin(dancePhase) * 0.2
        guyRightArm.rotation.x = -0.65 + Math.cos(dancePhase) * 0.2
        guyLeftArm.rotation.z = -0.65 - Math.sin(dancePhase) * 0.15
        guyLeftArm.rotation.x = 0.35

        // Girl Arms: One hand in guy's hand, other hand floating gracefully
        girlLeftArm.rotation.z = -1.15 - Math.sin(dancePhase) * 0.2
        girlLeftArm.rotation.x = -0.65 + Math.cos(dancePhase) * 0.2
        girlRightArm.rotation.z = 0.85 + Math.sin(dancePhase) * 0.25
        girlRightArm.rotation.x = 0.2

        // Flaring yellow skirt during dance twirls!
        girlSkirt.rotation.y = Math.sin(dancePhase * 2) * 0.3
        girlSkirt.scale.set(
          1 + Math.sin(dancePhase * 2) * 0.15,
          1,
          1 + Math.cos(dancePhase * 2) * 0.15
        )

        // Dancing Footwork (waltz step loop)
        guyLeftLeg.rotation.x = Math.sin(dancePhase) * 0.35
        guyRightLeg.rotation.x = -Math.sin(dancePhase) * 0.35
        girlLeftLeg.rotation.x = -Math.sin(dancePhase) * 0.32
        girlRightLeg.rotation.x = Math.sin(dancePhase) * 0.32

        // 3D Heart rain & sparkle float
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
