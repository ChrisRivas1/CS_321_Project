import { useState } from 'react'

import './App.css'
import Profile from './components/Profile'
import Match from './components/Match'
import Messages from './components/Messages'
import CreateProfile from './components/CreateProfile';
import SignIn from './components/SignIn';
import Events from './components/Events';



function App() {
  const [tab, setTab] = useState('profile')       /* set current state to know which tab we're on */

  const [userid, setUserid] = useState(null);
  if(userid === null){
    return (<SignIn onSave={(newUserid) => {setUserid(newUserid)}}/>);
  }

  const tabs = [
    { id: 'match',  icon: '👥', label: 'Match' },
    { id: 'events',   icon: '🎉', label: 'Events' },
    { id: 'messages', icon: '💬', label: 'Messages' },
    { id: 'profile',  icon: '👤', label: 'Profile' }
  ];

  return (
    <div className='app'>
      <div className='appHeader'>
        <h1>✨ App Name</h1>
      </div>
      <div className='appBody'>
        <div className="tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? 'active' : ''}
              onClick={() => setTab(t.id)}
            >
              <span className="tabIcon">{t.icon}</span>
              <span className="tabLabel">{t.label}</span>
            </button>
          ))}
        </div>
        <div className='selectedContent'>
          {tab === 'match' && <Match />}
          {tab === 'events' && <Events />}
          {tab === 'messages' && <Messages />}
          {tab === 'profile' && <Profile userid={userid}/>}
        </div>
      </div>
    </div>
  );
}

export default App