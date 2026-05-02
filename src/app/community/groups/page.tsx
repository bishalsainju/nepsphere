import { prisma } from '@/lib/prisma'
import { GroupCard } from '@/components/community/GroupCard'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'

export default async function GroupsPage() {
  let groups: any[] = []
  try {
    groups = await prisma.communityGroup.findMany({
      include: { _count: { select: { members: true } } },
      orderBy: { membersCount: 'desc' },
    })
  } catch {
    // DB not connected — show seed groups as mock
    groups = [
      { id: '1', name: 'F1 Students Dallas', slug: 'f1-students-dallas', emoji: '🎓', city: 'Dallas', description: 'Visa, SEVIS, OPT, CPT and student life for Nepali F1s in DFW.', membersCount: 412, _count: { members: 412 } },
      { id: '2', name: 'Aamaa Group DFW', slug: 'aamaa-group-dfw', emoji: '🌸', city: 'Dallas', description: 'A warm space for Nepali mothers in Dallas-Fort Worth.', membersCount: 193, _count: { members: 193 } },
      { id: '3', name: 'Foodies DFW', slug: 'foodies-dfw', emoji: '🍜', city: 'Dallas', description: 'Restaurant recs, home cooking, momos, dal bhat, and everything in between.', membersCount: 287, _count: { members: 287 } },
      { id: '4', name: 'DFW Nepali Community', slug: 'dfw-nepali-community', emoji: '🇳🇵', city: 'Dallas', description: 'General Dallas-Fort Worth Nepali community group.', membersCount: 1284, _count: { members: 1284 } },
      { id: '5', name: 'Working Professionals Dallas', slug: 'working-professionals-dallas', emoji: '💼', city: 'Dallas', description: 'H1B, green card, career transitions, and professional growth.', membersCount: 328, _count: { members: 328 } },
    ]
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Link href="/community" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--fg-3)', textDecoration: 'none', marginBottom: 20 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Back to Community
      </Link>

      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--fg-1)', marginBottom: 8 }}>
            Groups
          </h1>
          <p style={{ color: 'var(--fg-3)', fontSize: 16, margin: 0 }}>
            Find your people. Join groups built around shared interests, backgrounds, and life stages.
          </p>
        </div>
        <Link
          href="/community/groups/new"
          className="np-btn np-btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
        >
          <Plus size={15} strokeWidth={2} /> New group
        </Link>
      </div>

      {groups.length === 0 ? (
        <div className="np-card np-empty">
          <h3>No groups yet.</h3>
          <p>Groups will appear here once the community gets started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {groups.map((group: any) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  )
}
