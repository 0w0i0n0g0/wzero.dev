// @splinetool/viewer로 동작하는 페이지. 현재는 @splinetool/react-spline로 직접 spline runtime으로 구동한다.

// import { useEffect } from 'react'
// import { SplineViewer } from '@splinetool/viewer'
// import './index.css'

// export default function App_viewer() {
//   // 화면 size 가져오기
//   const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
//   const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

//   useEffect(() => {
//     // spline-viewer logo 삭제 함수
//     function removeSplineViewerLogo() {
//       const logo = document.querySelector('spline-viewer').shadowRoot.querySelector('#logo')
//       if (logo) {
//         logo.remove()
//       }
//     }

//     // 소개 텍스트 서서히 나타내는 함수
//     function displayFadeIn(id) {
//       const animation = setInterval(() => {
//         const opacity = parseFloat(document.getElementById(id).style.opacity) + 0.1
//         document.getElementById(id).style.opacity = opacity
//         if (opacity >= 1) {
//           clearInterval(animation)
//         }
//       }, 50)
//     }

//     // 시작 시 소개 텍스트 숨기기
//     document.getElementById('hello').style.opacity = 0
//     document.getElementById('name').style.opacity = 0
    
//     // 시작 시 로고 삭제, main 숨기기
//     removeSplineViewerLogo()
//     document.getElementById('main').style.display = 'none'

//     // 애니메이션 끝난 후
//     setTimeout(() => {
      
//       // intro 삭제
//       document.getElementById('intro').remove()

//       // main 출력, 로고 삭제
//       document.getElementById('main').style.display = 'block'
//       removeSplineViewerLogo()

//       // main 서서히 나타나는 애니메이션
//       document.getElementById('main').style.opacity = 0
//       const mainanimation = setInterval(() => {
//         const mainopacity = parseFloat(document.getElementById('main').style.opacity) + 0.05
//         document.getElementById('main').style.opacity = mainopacity
//         if (mainopacity >= 1) {
//           clearInterval(mainanimation)
//           displayFadeIn('hello')
//           displayFadeIn('name')
//         }
//       }, 50)
//     }, 10700)
//   }, [])

//   return (
//     <>
//       <div className="introduce" id="hello">안녕하세요,</div>
//       <div className="introduce" id="name"><span style={{ background : "linear-gradient(to right, #00ff7a, #0030ff)", backgroundClip : "text", WebkitTextFillColor : "transparent"}}>김태수</span> 입니다!</div>
//       <button className="o-button" id="github">Github</button>
//       <button className="o-button" id="cv">CV</button>
//       <spline-viewer id="intro" width={width} height={height} url="/3d-models/intro.splinecode"></spline-viewer>
//       <spline-viewer id="main" width={width} height={height} url="/3d-models/main.splinecode"></spline-viewer>
//     </>
//   )
// }