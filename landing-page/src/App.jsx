import { lazy, Suspense, useRef, useState } from 'react'
import './index.css'

const Spline = lazy(() => import('@splinetool/react-spline')) // import Spline from '@splinetool/react-spline'

export default function App() {

  // 화면 size 가져오기
  // const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  // const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  const splineMain = useRef();

  const [buttonDisable, setButtonDisable] = useState(true)

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
        document.getElementById('cv').style.display = 'block'

        displayFadeIn('main')
          .then(() => displayFadeIn('hello'))
          .then(() => displayFadeIn('name'))
          .then(() => displayFadeIn('buttons'))
          .then(() => displayFadeIn('blog'))
          .then(() => displayFadeIn('github'))
          .then(() => displayFadeIn('cv'))

      }, 9500)

    }

  }

  return (
    <>
      <div className="introduce" id="hello" style={{display : 'none', opacity : 0}}>안녕하세요,</div>
      <div className="introduce" id="name" style={{display : 'none', opacity : 0}}><span style={{ background : "linear-gradient(to right, #00ff7a, #0030ff)", backgroundClip : "text", WebkitTextFillColor : "transparent"}}>김태수</span> 입니다!</div>
      <div className="buttons" id="buttons" style={{display : 'none', opacity : 0}}>
        <button disabled={buttonDisable} className="o-button" id="blog" style={{display : 'none', opacity : 0}} onClick={() => window.open('https://blog.wzero.dev')}>Blog</button>
        <button disabled={buttonDisable} className="o-button" id="github" style={{display : 'none', opacity : 0}} onClick={() => window.open('https://github.com/0w0i0n0g0')}>Github</button>
        <button disabled={buttonDisable} className="o-button" id="cv" style={{display : 'none', opacity : 0}} onClick={() => window.open('https://0w0i0n0g0.notion.site/6f20e7e61d8242a98c7ec7057d782faf')}>Notion<br></br>CV</button>
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