import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from './Messages.module.css'

export default function Messages() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [replyText, setReplyText] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && open) {
      fetchMessages()
    }
  }, [user, open])

  async function fetchMessages() {
    setLoading(true)
    try {
      const res = await fetch('/api/messages', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setMessages(Array.isArray(data) ? data : [])
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleReply(id) {
    if (!replyText[id]?.trim()) return
    const res = await fetch(`/api/messages/${id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ reply_text: replyText[id] }),
    })
    if (res.ok) {
      setReplyText(prev => ({ ...prev, [id]: '' }))
      fetchMessages()
    }
  }

  function formatDate(d) {
    return new Date(d).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }

  if (!user) return null

  return (
    <>
      <button
        className={styles.fab}
        onClick={() => setOpen(true)}
        title="Сообщения"
        aria-label="Открыть сообщения"
      >
        ✉
      </button>

      {open && (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {user.role === 'admin' ? 'Входящие сообщения' : 'Мои сообщения'}
              </h3>
              <button className={styles.close} onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className={styles.messageList}>
              {loading ? (
                <p className={styles.empty}>Загрузка...</p>
              ) : messages.length === 0 ? (
                <p className={styles.empty}>Сообщений нет</p>
              ) : messages.map(msg => (
                <div key={msg.id} className={styles.message}>
                  <div className={styles.msgMeta}>
                    {user.role === 'admin' && msg.sender_name && (
                      <span className={styles.sender}>{msg.sender_name}</span>
                    )}
                    <span className={styles.subject}>{msg.subject}</span>
                    <span className={styles.date}>{formatDate(msg.created_at)}</span>
                  </div>
                  <p className={styles.msgBody}>{msg.body}</p>

                  {msg.reply && (
                    <div className={styles.replyBlock}>
                      <span className={styles.replyLabel}>Ответ администратора:</span>
                      <p className={styles.replyText}>{msg.reply}</p>
                    </div>
                  )}

                  {user.role === 'admin' && !msg.reply && (
                    <div className={styles.replyForm}>
                      <textarea
                        className={styles.replyInput}
                        placeholder="Напишите ответ..."
                        value={replyText[msg.id] || ''}
                        onChange={e => setReplyText(prev => ({ ...prev, [msg.id]: e.target.value }))}
                        rows={2}
                      />
                      <button
                        className={styles.replyBtn}
                        onClick={() => handleReply(msg.id)}
                        disabled={!replyText[msg.id]?.trim()}
                      >
                        Ответить
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
