
import { useState } from 'react'

function Messages() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  function sendMessage(event) {
    event.preventDefault()

    if (newMessage.trim() === '') {
      return
    }

    setMessages([...messages, newMessage])
    setNewMessage('')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>💬 Messages</h2>
      <p>Send messages and connect with others!</p>

      <div style={{
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '15px',
        minHeight: '250px',
        marginBottom: '15px'
      }}>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((message, index) => (
            <p
              key={index}
              style={{
                backgroundColor: '#eee6ff',
                padding: '10px',
                borderRadius: '8px'
              }}
            >
              {message}
            </p>
          ))
        )}
      </div>

      <form
        onSubmit={sendMessage}
        style={{ display: 'flex', gap: '10px' }}
      >
        <input
          type="text"
          placeholder="Type a message..."
          aria-label="Type a message"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}
        />

        <button type="submit">
          Send
        </button>
      </form>
    </div>
  )
}

export default Messages
