'use client'
import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { UpgradeModal } from './UpgradeModal'

export function MessageButton({ isPremium, color }: { isPremium: boolean; color: string }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      {showModal && <UpgradeModal reason="message" onClose={() => setShowModal(false)} />}
      <button
        onClick={() => {
          if (!isPremium) { setShowModal(true); return }
          // TODO: open message composer
          alert('Messaging coming soon!')
        }}
        className="np-btn np-btn-primary lg"
        style={{ background: color, borderColor: color, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 32px' }}
      >
        <MessageCircle size={16} strokeWidth={1.5} />
        {isPremium ? 'Send message' : 'Send message'}
      </button>
    </>
  )
}
