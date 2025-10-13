import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import './index.css'

const Spline = lazy(() => import('@splinetool/react-spline')) // import Spline from '@splinetool/react-spline'

export default function App() {

  // 화면 size 가져오기
  // const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  // const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  const splineMain = useRef();

  const [buttonDisable, setButtonDisable] = useState(true)
  const [displayName, setDisplayName] = useState('0w0i0n0g0')
  const [cvUrl, setCvUrl] = useState(null)
  const canShowCvRef = useRef(false)

  // 암호화된 페이로드
  const ENC = {
    name: {
      salt_b64: "49nVLCPFSjDxKAorg1hZug==",
      iv_b64: "omrFdvM2SUUItSPO",
      ct_b64: "d/fs5Ex5heC3r2GIQHlBc/fO1hDKmChEVg=="
    },
    cv: {
      salt_b64: "LXwYOkook184FlSXRndLeg==",
      iv_b64: "O/pjBiYuHE32+rK+",
      ct_b64: "R37UyoXUrKBtjNTNa9nHW5tb69sq8d0DlVOaLoH2+Vrg/MDraSdXQ8JIdJis+yYhBhIR2MXW7Ul9Sc/oUfvhwBlea2ZrAoWm9q8w/nCJ"
    },
    paramNames: ['ref']
  }

  function b64ToBytes(b64) {
    if (!b64) return null
    return Uint8Array.from(atob(b64), c => c.charCodeAt(0))
  }

  async function deriveAesKeyFromCode(code, saltBytes) {
    const enc = new TextEncoder()
    const baseKey = await crypto.subtle.importKey(
      'raw',
      enc.encode(code),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    )
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: 120000,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    )
  }

  async function decryptText(ct_b64, iv_b64, salt_b64, code) {
    try {
      const salt = b64ToBytes(salt_b64)
      const iv = b64ToBytes(iv_b64)
      const ct = b64ToBytes(ct_b64)
      if (!salt || !iv || !ct) return null
      const key = await deriveAesKeyFromCode(code, salt)
      const ptBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct)
      return new TextDecoder().decode(ptBuf)
    } catch {
      return null
    }
  }

  function getReferralCode() {
    try {
      const url = new URL(window.location.href)
      const params = url.searchParams
      for (const p of ENC.paramNames) {
        const v = params.get(p)
        if (v) return v
      }
      return null
    } catch {
      return null
    }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const code = getReferralCode()
      if (!code) return
      const decName = await decryptText(ENC.name.ct_b64, ENC.name.iv_b64, ENC.name.salt_b64, code)
      const decCv = await decryptText(ENC.cv.ct_b64, ENC.cv.iv_b64, ENC.cv.salt_b64, code)
      if (cancelled) return
      if (decName) setDisplayName(decName)
      if (decCv) {
        setCvUrl(decCv)
        canShowCvRef.current = true
      }
    })()
    return () => { cancelled = true }
  }, [])

  // id에 해당하는 요소를 서서히 나타내는 애니메이션 함수
  async function displayFadeIn(id) {
    return new Promise((resolve) => {
      const animation = setInterval(async () => {
        const opacity = parseFloat(document.getElementById(id).style.opacity) + 0.1;
        document.getElementById(id).style.opacity = opacity;
        if (opacity >= 1) {
          clearInterval(animation);
          resolve();
        }
      }, 50);
      if (document.getElementById(id).tagName === 'BUTTON') {
        setButtonDisable(false)
      }
    });
  }

  function onLoadMain(spline) {
    splineMain.current = spline;
  }

  // intro 로딩 후 실행
  function onLoadIntro(spline) {

    // 로딩 완료 감지
    if(spline.findObjectByName('0W')){

      // 로딩 화면 삭제
      document.getElementById('loading').remove() // 로딩 화면은 index.html에 있어서 로딩 중에 가장 먼저 보여짐.

      // intro 출력
      displayFadeIn('intro')

      // intro 끝난 후 (9.5초)
      setTimeout(() => {

        // intro 삭제
        document.getElementById('intro').remove()

        // main 출력
        document.getElementById('main').style.display = 'block'
        splineMain.current.emitEvent("start", "0W")

        // 순차적으로 서서히 나타나는 애니메이션
        document.getElementById('hello').style.display = 'block'
        document.getElementById('name').style.display = 'block'
        document.getElementById('buttons').style.display = 'flex'
        document.getElementById('blog').style.display = 'block'
        document.getElementById('github').style.display = 'block'
        if (canShowCvRef.current) {
          document.getElementById('cv').style.display = 'block'
        }

        displayFadeIn('main')
          .then(() => displayFadeIn('hello'))
          .then(() => displayFadeIn('name'))
          .then(() => displayFadeIn('buttons'))
          .then(() => displayFadeIn('blog'))
          .then(() => displayFadeIn('github'))
          .then(() => canShowCvRef.current ? displayFadeIn('cv') : Promise.resolve())

      }, 9500)

    }

  }

  return (
    <>
      <div className="introduce" id="hello" style={{display : 'none', opacity : 0}}>안녕하세요,</div>
      <div className="introduce" id="name" style={{display : 'none', opacity : 0}}><span style={{ background : "linear-gradient(to right, #00ff7a, #0030ff)", backgroundClip : "text", WebkitTextFillColor : "transparent"}}>{displayName}</span> 입니다!</div>
      <div className={`buttons ${canShowCvRef.current ? 'buttons-with-cv' : 'buttons-without-cv'}`} id="buttons" style={{display : 'none', opacity : 0}}>
        <button disabled={buttonDisable} className="o-button" id="blog" style={{display : 'none', opacity : 0}} onClick={() => window.open('https://blog.wzero.dev')}>Blog</button>
        <button disabled={buttonDisable} className="o-button" id="github" style={{display : 'none', opacity : 0}} onClick={() => window.open('https://github.com/0w0i0n0g0')}>Github</button>
        <button disabled={buttonDisable} className="o-button" id="cv" style={{display : 'none', opacity : 0}} onClick={() => cvUrl && window.open(cvUrl)}>Notion<br></br>CV</button>
      </div>
      <div className='spline-wrapper'>
        <Suspense fallback={<div id='intro'></div>}>
          <Spline id="intro" scene="/3d-models/intro.splinecode" onLoad={onLoadIntro} style={{opacity : 0}} />
        </Suspense>
      </div>
      <div className='spline-wrapper'>
        <Spline id="main" scene="/3d-models/main.splinecode" onLoad={onLoadMain} style={{display : 'none', opacity : 0}} />
      </div>
      
    </>
  )
}