import { useState } from 'react'
//import heroImg from './assets/hero.png'
//import reactLogo from './assets/react.svg'
//import viteLogo from './assets/vite.svg'
import './App.css'
import Profile from './components/Profile'
import Explore from './components/Explore'
import Messages from './components/Messages'
//import CreateProfile from './components/CreateProfile';
import SignIn from './components/SignIn';
import Events from './components/Events';


/*
 * This is the basic template when creating a directory I left it in here to reference
 *
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
*/

function App() {
  const [tab, setTab] = useState('profile')       /* set current state to know which tab we're on */

  const [userid, setUserid] = useState(null);
  if(userid === null){
    return (<SignIn onSave={(newUserid) => {setUserid(newUserid)}}/>);
  }

  return (
    <div className='app'>
      <div className='appHeader'>
        <h1>✨ App Name</h1>
      </div>
      <div className='appBody'>
        <div className="tabs">
          <button
            className={tab === 'explore' ? 'active' : ''}
            onClick={() => setTab('explore')}
          >
            👥
          </button>
          <button
            className={tab === 'events' ? 'active' : ''}
            onClick={() => setTab('events')}
          >
            🎉
          </button>
          <button
            className={tab === 'messages' ? 'active' : ''}
            onClick={() => setTab('messages')}
          >
            💬
          </button>
          <button
            className={tab === 'profile' ? 'active' : ''}
            onClick={() => setTab('profile')}
          >
            👤
          </button>
        </div>
        <div className='selectedContent'>
          {tab === 'explore' && <Explore />}
          {tab === 'events' && <Events />}
          {tab === 'messages' && <Messages />}
          {tab === 'profile' && <Profile userid={userid}/>}
        </div>
      </div>
    </div>
  );
}

export default App