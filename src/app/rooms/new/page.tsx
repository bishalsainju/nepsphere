import { RoomForm } from '@/components/rooms/RoomForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewRoomPage() {
  return (
    <div className="np-subpage-sm">
      <Link href="/rooms" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 20 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to Rooms
      </Link>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, color: 'var(--fg-1)', marginBottom: 6 }}>
          Post a room
        </h1>
        <p style={{ color: 'var(--fg-3)', fontSize: 15, margin: 0 }}>
          List your room free. Verified hosts get a badge and 3× more replies.
        </p>
      </div>

      <div className="np-card np-card-body">
        <RoomForm />
      </div>
    </div>
  )
}
