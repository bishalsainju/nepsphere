import 'dotenv/config'
import { PrismaClient, PostCategory, RoomType, GenderPref, ConnectIntent, JobType, GroupRole } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'

function resolveConnectionString(dbUrl: string): string {
  if (!dbUrl.startsWith('prisma+postgres://')) return dbUrl
  try {
    const apiKey = new URL(dbUrl).searchParams.get('api_key') ?? ''
    const decoded = JSON.parse(Buffer.from(apiKey, 'base64').toString('utf8'))
    return decoded.databaseUrl ?? dbUrl
  } catch {
    return dbUrl
  }
}

const connectionString = resolveConnectionString(process.env.DATABASE_URL ?? '')
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  // ─── Users ────────────────────────────────────────────────────────
  const userData = [
    { id: 'user_001', name: 'Bishal Sainju',   email: 'bishal@nepsphere.dev',  country: 'USA', state: 'Texas',      city: 'Dallas',   bio: `Software engineer, DFW since 2019.` },
    { id: 'user_002', name: 'Sita Thapa',      email: 'sita@nepsphere.dev',    country: 'USA', state: 'Texas',      city: 'Dallas',   bio: `Nurse practitioner. Loves hiking and momos.` },
    { id: 'user_003', name: 'Roshan Shrestha', email: 'roshan@nepsphere.dev',  country: 'USA', state: 'California', city: 'San Jose', bio: `Product manager at a Bay Area startup.` },
    { id: 'user_004', name: 'Anita Gurung',    email: 'anita@nepsphere.dev',   country: 'USA', state: 'New York',   city: 'New York', bio: `PhD student in biochemistry at NYU.` },
    { id: 'user_005', name: 'Dipesh Rai',      email: 'dipesh@nepsphere.dev',  country: 'USA', state: 'Texas',      city: 'Austin',   bio: `Civil engineer. Austin transplant from Nepal in 2021.` },
    { id: 'user_006', name: 'Priya Karki',     email: 'priya@nepsphere.dev',   country: 'USA', state: 'Washington', city: 'Seattle',  bio: `ML engineer. Tea addict.` },
    { id: 'user_007', name: 'Nabin Tamang',    email: 'nabin@nepsphere.dev',   country: 'USA', state: 'Texas',      city: 'Dallas',   bio: `Restaurant owner, DFW Nepali food scene.` },
    { id: 'user_008', name: 'Sunita Bhandari', email: 'sunita@nepsphere.dev',  country: 'USA', state: 'Texas',      city: 'Dallas',   bio: `F1 student at UT Dallas. CS major.` },
    { id: 'user_009', name: 'Arun Basnet',     email: 'arun@nepsphere.dev',    country: 'USA', state: 'Illinois',   city: 'Chicago',  bio: `Accountant. Chicago since 2017.` },
    { id: 'user_010', name: 'Manisha Pokhrel', email: 'manisha@nepsphere.dev', country: 'USA', state: 'Texas',      city: 'Dallas',   bio: `Yoga instructor and community organizer.` },
    { id: 'user_011', name: 'Ramesh Adhikari', email: 'ramesh@nepsphere.dev',  country: 'USA', state: 'Georgia',    city: 'Atlanta',  bio: `DevOps engineer. Atlanta Nepali community lead.` },
    { id: 'user_012', name: 'Kabita Dhakal',   email: 'kabita@nepsphere.dev',  country: 'USA', state: 'Texas',      city: 'Dallas',   bio: `OPT holder looking for full-time roles in UX.` },
  ]

  for (const u of userData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, image: null, isVerified: true, verifiedAt: new Date('2024-01-15') },
    })
  }
  console.log('Seeded 12 users.')

  // ─── Community Groups ─────────────────────────────────────────────
  const groups = [
    { id: 'grp_001', name: 'F1 Students Dallas',           slug: 'f1-students-dallas',           emoji: '🎓', city: 'Dallas',   state: 'Texas',      country: 'USA', membersCount: 412,  description: `Visa, SEVIS, OPT, CPT and student life for Nepali F1s in DFW.` },
    { id: 'grp_002', name: 'Aamaa Group DFW',              slug: 'aamaa-group-dfw',              emoji: '🌸', city: 'Dallas',   state: 'Texas',      country: 'USA', membersCount: 193,  description: `A warm space for Nepali mothers in Dallas-Fort Worth.` },
    { id: 'grp_003', name: 'Foodies DFW',                  slug: 'foodies-dfw',                  emoji: '🍜', city: 'Dallas',   state: 'Texas',      country: 'USA', membersCount: 287,  description: `Restaurant recs, home cooking, momos, dal bhat, and everything in between.` },
    { id: 'grp_004', name: 'DFW Nepali Community',         slug: 'dfw-nepali-community',         emoji: '🇳🇵', city: 'Dallas',  state: 'Texas',      country: 'USA', membersCount: 1284, description: `General Dallas-Fort Worth Nepali community group.` },
    { id: 'grp_005', name: 'Working Professionals Dallas', slug: 'working-professionals-dallas', emoji: '💼', city: 'Dallas',   state: 'Texas',      country: 'USA', membersCount: 328,  description: `H1B, green card, career transitions, and professional growth.` },
    { id: 'grp_006', name: 'Nepali NYC',                   slug: 'nepali-nyc',                   emoji: '🗽', city: 'New York', state: 'New York',   country: 'USA', membersCount: 876,  description: `The largest Nepali community group in New York City.` },
    { id: 'grp_007', name: 'Bay Area Nepalis',             slug: 'bay-area-nepalis',             emoji: '🌉', city: 'San Jose', state: 'California', country: 'USA', membersCount: 654,  description: `Silicon Valley and Bay Area Nepali professionals and students.` },
    { id: 'grp_008', name: 'Seattle Nepali Circle',        slug: 'seattle-nepali-circle',        emoji: '☁️', city: 'Seattle',  state: 'Washington', country: 'USA', membersCount: 321,  description: `PNW Nepalis - hiking, tech jobs, and community events.` },
    { id: 'grp_009', name: 'Chicago Sangha',               slug: 'chicago-sangha',               emoji: '🌬️', city: 'Chicago',  state: 'Illinois',   country: 'USA', membersCount: 209,  description: `Nepali community in Chicagoland area.` },
    { id: 'grp_010', name: 'Atlanta Nepalis',              slug: 'atlanta-nepalis',              emoji: '🍑', city: 'Atlanta',  state: 'Georgia',    country: 'USA', membersCount: 187,  description: `Nepali community across metro Atlanta and Georgia.` },
  ]

  for (const g of groups) {
    const { slug, ...rest } = g
    await prisma.communityGroup.upsert({
      where: { slug },
      update: rest,
      create: g,
    })
  }
  console.log('Seeded 10 community groups.')

  // ─── Group Memberships ─────────────────────────────────────────────
  const memberships = [
    { id: 'mem_001', userId: 'user_001', groupId: 'grp_001', role: GroupRole.ADMIN },
    { id: 'mem_002', userId: 'user_001', groupId: 'grp_004', role: GroupRole.MEMBER },
    { id: 'mem_003', userId: 'user_002', groupId: 'grp_002', role: GroupRole.ADMIN },
    { id: 'mem_004', userId: 'user_002', groupId: 'grp_004', role: GroupRole.MEMBER },
    { id: 'mem_005', userId: 'user_007', groupId: 'grp_003', role: GroupRole.ADMIN },
    { id: 'mem_006', userId: 'user_007', groupId: 'grp_004', role: GroupRole.MEMBER },
    { id: 'mem_007', userId: 'user_008', groupId: 'grp_001', role: GroupRole.MEMBER },
    { id: 'mem_008', userId: 'user_010', groupId: 'grp_002', role: GroupRole.MEMBER },
    { id: 'mem_009', userId: 'user_010', groupId: 'grp_004', role: GroupRole.MODERATOR },
    { id: 'mem_010', userId: 'user_005', groupId: 'grp_005', role: GroupRole.MEMBER },
    { id: 'mem_011', userId: 'user_003', groupId: 'grp_007', role: GroupRole.ADMIN },
    { id: 'mem_012', userId: 'user_004', groupId: 'grp_006', role: GroupRole.ADMIN },
    { id: 'mem_013', userId: 'user_006', groupId: 'grp_008', role: GroupRole.ADMIN },
    { id: 'mem_014', userId: 'user_009', groupId: 'grp_009', role: GroupRole.ADMIN },
    { id: 'mem_015', userId: 'user_011', groupId: 'grp_010', role: GroupRole.ADMIN },
  ]

  for (const m of memberships) {
    await prisma.groupMembership.upsert({
      where: { userId_groupId: { userId: m.userId, groupId: m.groupId } },
      update: {},
      create: m,
    })
  }
  console.log('Seeded 15 group memberships.')

  // ─── Group Posts ──────────────────────────────────────────────────
  const groupPosts = [
    {
      id: 'gp_001', groupId: 'grp_001', authorId: 'user_001',
      title: `OPT extension timeline 2025 - anyone got approval?`,
      body: `Applied for OPT STEM extension in March. USCIS website says 3-5 months. Anyone else waiting? My current OPT expires in July and I am getting nervous. My employer already filed the I-983 on time.`,
    },
    {
      id: 'gp_002', groupId: 'grp_001', authorId: 'user_008',
      title: `CPT at UT Dallas - which advisor to contact?`,
      body: `I need CPT authorization for a summer internship starting June 1. Does anyone know which DSO at UTD handles this the fastest? The main office seems swamped.`,
    },
    {
      id: 'gp_003', groupId: 'grp_003', authorId: 'user_007',
      title: `Best momo spots in DFW - 2025 edition`,
      body: `I have been on a mission to find the best momos in the metroplex. Current top three: Namaste Palace (Garland), Yak and Yeti (Irving), and my personal kitchen every Saturday. Drop your recommendations!`,
    },
    {
      id: 'gp_004', groupId: 'grp_003', authorId: 'user_002',
      title: `Anyone tried making sel roti in an air fryer?`,
      body: `Tried making sel roti in the air fryer last week. It came out decent but not as crispy as frying. The dough ratio matters a lot. Share your tricks if you have cracked it!`,
    },
    {
      id: 'gp_005', groupId: 'grp_004', authorId: 'user_010',
      title: `Teej celebration this year - planning committee needs help!`,
      body: `We are organizing the annual Teej event at the Dallas convention center. Need 10 more volunteers for decorations, food, and registration. DM me if interested. Event is August 30th.`,
    },
    {
      id: 'gp_006', groupId: 'grp_005', authorId: 'user_001',
      title: `H1B cap-exempt jobs - what companies qualify?`,
      body: `Many people do not know that universities, nonprofits, and government research labs are cap-exempt for H1B. This means you can start almost immediately without the lottery. Worth exploring if you are stuck in the cap queue.`,
    },
    {
      id: 'gp_007', groupId: 'grp_007', authorId: 'user_003',
      title: `Layoffs at big tech - visa holders need a plan B`,
      body: `With the recent rounds at Meta and Google, several Nepali friends lost jobs and had 60 days to find new ones on H1B. Make sure you have your I-94, last pay stubs, and offer letters organized. Also look into grace periods for EAD and OPT holders.`,
    },
    {
      id: 'gp_008', groupId: 'grp_006', authorId: 'user_004',
      title: `Dashain potluck - Jackson Heights Oct 12`,
      body: `Annual Dashain potluck is happening at my place in Jackson Heights. Bring one dish (savory preferred). We will have tikka ceremony at 4 PM. RSVP by Oct 8.`,
    },
  ]

  for (const gp of groupPosts) {
    await prisma.groupPost.upsert({
      where: { id: gp.id },
      update: {},
      create: gp,
    })
  }
  console.log('Seeded 8 group posts.')

  // ─── Community Posts ──────────────────────────────────────────────
  const posts = [
    {
      id: 'post_001', authorId: 'user_001', category: PostCategory.VISA,
      city: 'Dallas', state: 'Texas', country: 'USA', likes: 34, pinned: false,
      title: `H1B transfer timeline - how long did yours take?`,
      body: `Just filed an H1B transfer with a new employer. Premium processing. USCIS receipt says 15 business days but I have heard it can be faster. Anyone done this recently from Texas? My current employer knows and it is smooth so far.`,
    },
    {
      id: 'post_002', authorId: 'user_008', category: PostCategory.STUDENT,
      city: 'Dallas', state: 'Texas', country: 'USA', likes: 18, pinned: false,
      title: `UT Dallas vs UT Arlington - which is better for CS OPT jobs?`,
      body: `Admitted to both UTD and UTA for MS CS. UTD has a stronger reputation in DFW tech, but UTA costs less. Looking mainly at post-graduation job placement and OPT-to-H1B conversion rates. Anyone from either school share their experience?`,
    },
    {
      id: 'post_003', authorId: 'user_002', category: PostCategory.LIFE_ABROAD,
      city: 'Dallas', state: 'Texas', country: 'USA', likes: 45, pinned: false,
      title: `Sending money to Nepal - remittance comparison 2025`,
      body: `Tested Remitly, Wise, and IME Pay this month for sending $1000 to Nepal. IME Pay gave the best rate (133.2 NPR per dollar) but took 2 days. Wise was 131.8 but instant. Remitly was worst at 130.4. Worth checking each time since rates shift weekly.`,
    },
    {
      id: 'post_004', authorId: 'user_007', category: PostCategory.FOOD_CULTURE,
      city: 'Dallas', state: 'Texas', country: 'USA', likes: 67, pinned: false,
      title: `Making gundruk at home in the US - ingredient sourcing guide`,
      body: `After years of trying, finally got the fermentation right. Key: use mustard greens from the Asian grocery (HMart has them), dry them in the sun for 2 days, then ferment in a covered jar for 5-7 days at room temperature. Works great in Dallas winters.`,
    },
    {
      id: 'post_005', authorId: 'user_005', category: PostCategory.JOBS,
      city: 'Austin', state: 'Texas', country: 'USA', likes: 29, pinned: false,
      title: `Civil engineering PE license - experience with Texas board?`,
      body: `Passed my FE exam last year and now working on PE application in Texas. The experience requirement is 4 years under a licensed PE. Anyone here gone through the TBPE process? Specifically curious about how they verify overseas work experience from Nepal.`,
    },
    {
      id: 'post_006', authorId: 'user_004', category: PostCategory.STUDENT,
      city: 'New York', state: 'New York', country: 'USA', likes: 22, pinned: false,
      title: `Stipend survival guide - NYC on a PhD fellowship`,
      body: `NYU PhD stipend is $36k per year. NYC rent alone is $1800 minimum for a studio. Here is how I manage: shared apartment in Astoria with two roommates ($850 per month), meal prep on Sundays, use subway monthly pass, and take every free museum day. It is doable but requires planning.`,
    },
    {
      id: 'post_007', authorId: 'user_006', category: PostCategory.VISA,
      city: 'Seattle', state: 'Washington', country: 'USA', likes: 41, pinned: false,
      title: `EB2-NIW self-petition - is it worth it for engineers?`,
      body: `Filed EB2-NIW self-petition 8 months ago. My work is in ML for climate applications so the national interest angle was strong. Used a lawyer who specializes in tech NIWs. Total cost around $4k including attorney fees. India-born colleagues face decades of wait but for Nepal-born the priority date is current right now!`,
    },
    {
      id: 'post_008', authorId: 'user_009', category: PostCategory.LIFE_ABROAD,
      city: 'Chicago', state: 'Illinois', country: 'USA', likes: 53, pinned: false,
      title: `Chicago winters vs Kathmandu winters - honest comparison`,
      body: `Five years in Chicago and I still dread November through March. Kathmandu winters feel mild in comparison. Invest in a proper down jacket (Canada Goose or similar), wool socks, and heated parking if your budget allows. Also: CTA is heated underground but bus stops are brutal. Plan accordingly.`,
    },
    {
      id: 'post_009', authorId: 'user_003', category: PostCategory.JOBS,
      city: 'San Jose', state: 'California', country: 'USA', likes: 38, pinned: false,
      title: `Negotiating salary on H1B - what I learned the hard way`,
      body: `Companies use H1B prevailing wage as an excuse not to negotiate. That is not how it works. The prevailing wage is a FLOOR, not a ceiling. You can and should negotiate above it. I got $25k more by simply asking. Also, always negotiate RSUs and signing bonus - those are not on LCA.`,
    },
    {
      id: 'post_010', authorId: 'user_010', category: PostCategory.GENERAL,
      city: 'Dallas', state: 'Texas', country: 'USA', likes: 89, pinned: true,
      title: `Nepali community in DFW is growing fast - here is the data`,
      body: `Based on 2020 census and community estimates, there are now over 25,000 Nepalis in the DFW metro area. Richardson and Garland have the highest concentration. There are now 3 Nepali grocery stores, 2 Nepali restaurants, and a Nepali community center in the works. Proud moment.`,
    },
    {
      id: 'post_011', authorId: 'user_011', category: PostCategory.FOOD_CULTURE,
      city: 'Atlanta', state: 'Georgia', country: 'USA', likes: 44, pinned: false,
      title: `Found wo (newari bean crepe) ingredients in Atlanta!`,
      body: `For anyone in Atlanta craving Newari food - found black-eyed peas at Buford Highway Farmers Market. With the right spices from the Desi grocery on Roswell Road, you can make decent wo at home. Took me 3 attempts to get the batter consistency right.`,
    },
    {
      id: 'post_012', authorId: 'user_012', category: PostCategory.VISA,
      city: 'Dallas', state: 'Texas', country: 'USA', likes: 16, pinned: false,
      title: `Day 1 CPT - risk vs reward honestly discussed`,
      body: `Got admitted to a university with Day 1 CPT and the tuition is suspiciously low. Talked to an immigration attorney and the risks are real: USCIS has flagged many of these programs and people have had OPT denied and H1B rejected later. For anyone considering this, please consult a proper attorney first.`,
    },
  ]

  for (const p of posts) {
    await prisma.post.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    })
  }
  console.log('Seeded 12 community posts.')

  // ─── Replies ──────────────────────────────────────────────────────
  const replies = [
    { id: 'reply_001', postId: 'post_001', authorId: 'user_003', body: `Mine took 9 business days with PP last December. Make sure your new employer attorney sends the receipt notice ASAP so you can keep working.` },
    { id: 'reply_002', postId: 'post_001', authorId: 'user_011', body: `Premium processing has been reliable. The 60-day grace period if things go sideways gives some buffer. Good luck!` },
    { id: 'reply_003', postId: 'post_002', authorId: 'user_001', body: `UTD hands down for DFW job market. Especially if you are targeting Texas Instruments, AT&T, or the many healthcare tech companies here. The alumni network is strong.` },
    { id: 'reply_004', postId: 'post_002', authorId: 'user_005', body: `UTA is cheaper and the engineering faculty is solid. For CS specifically, UTD has an edge in industry connections.` },
    { id: 'reply_005', postId: 'post_003', authorId: 'user_007', body: `IME Pay also has a mobile app now that makes tracking easier. The rates are genuinely the best I have seen for Nepal.` },
    { id: 'reply_006', postId: 'post_004', authorId: 'user_002', body: `I had no idea you could make gundruk in the US! Do you use any special container or just a regular mason jar?` },
    { id: 'reply_007', postId: 'post_004', authorId: 'user_007', body: `Wide-mouth mason jar works perfectly. Make sure there is no standing water - just moisture from the leaves. Cover loosely so gas can escape.` },
    { id: 'reply_008', postId: 'post_007', authorId: 'user_001', body: `This is huge for Nepali-born applicants. The priority date situation is totally different from India/China. Definitely worth pursuing if your work has national interest implications.` },
    { id: 'reply_009', postId: 'post_009', authorId: 'user_006', body: `Completely agree. I have seen companies try to lowball H1B holders using the LCA as justification. Level 2 prevailing wage is typically below market - know your worth.` },
    { id: 'reply_010', postId: 'post_010', authorId: 'user_002', body: `The Nepali grocery store in Garland is a lifesaver. They even stock dhindo flour and gundruk packages now!` },
    { id: 'reply_011', postId: 'post_010', authorId: 'user_008', body: `DFW is honestly the best city for Nepalis outside of New York. The community is incredibly welcoming.` },
    { id: 'reply_012', postId: 'post_012', authorId: 'user_003', body: `This needs to be pinned. Day 1 CPT mills have ruined careers. Always verify a school on the SEVP certification list.` },
  ]

  for (const r of replies) {
    await prisma.reply.upsert({
      where: { id: r.id },
      update: {},
      create: r,
    })
  }
  console.log('Seeded 12 replies.')

  // ─── Rooms ────────────────────────────────────────────────────────
  const rooms = [
    {
      id: 'room_001', hostId: 'user_001',
      title: `Private room in 3BR apt - Richardson, TX`,
      description: `Furnished private room in a clean 3-bedroom apartment in Richardson. 5 minutes from UTD. All utilities included. Laundry in unit. Two other Nepali roommates (male, professionals). Quiet building.`,
      price: 750, type: RoomType.PRIVATE, genderPref: GenderPref.ANY,
      city: 'Dallas', state: 'Texas', country: 'USA', area: 'Richardson',
      availableFrom: new Date('2025-06-01'), photos: [],
      isVerifiedHost: true, isFeatured: true, isAvailable: true,
    },
    {
      id: 'room_002', hostId: 'user_002',
      title: `Cozy studio - Garland, TX (near Nepali stores)`,
      description: `Small but well-maintained studio in Garland, walking distance to the Nepali grocery store and a few Desi restaurants. Updated kitchen, good natural light. No smoking, no pets. Parking included.`,
      price: 950, type: RoomType.STUDIO, genderPref: GenderPref.FEMALE,
      city: 'Dallas', state: 'Texas', country: 'USA', area: 'Garland',
      availableFrom: new Date('2025-07-01'), photos: [],
      isVerifiedHost: true, isFeatured: false, isAvailable: true,
    },
    {
      id: 'room_003', hostId: 'user_007',
      title: `Shared room - 2 beds, North Dallas, Plano area`,
      description: `Large room with two twin beds shared between two people. Shared bathroom with one other tenant. Close to DART rail. Utilities split equally. Ideal for two friends looking to save on rent.`,
      price: 450, type: RoomType.SHARED, genderPref: GenderPref.MALE,
      city: 'Dallas', state: 'Texas', country: 'USA', area: 'Plano',
      availableFrom: new Date('2025-05-15'), photos: [],
      isVerifiedHost: false, isFeatured: false, isAvailable: true,
    },
    {
      id: 'room_004', hostId: 'user_003',
      title: `Entire 2BR apartment - Sunnyvale, CA`,
      description: `Entire 2-bedroom apartment available for sublease June through September. 10 min drive to Apple/Google campuses. In-unit W/D, parking, fast WiFi. Furnished. Suitable for two people or one person who wants space.`,
      price: 3200, type: RoomType.ENTIRE_APT, genderPref: GenderPref.ANY,
      city: 'San Jose', state: 'California', country: 'USA', area: 'Sunnyvale',
      availableFrom: new Date('2025-06-15'), photos: [],
      isVerifiedHost: true, isFeatured: true, isAvailable: true,
    },
    {
      id: 'room_005', hostId: 'user_004',
      title: `Private room - Astoria, Queens, NYC`,
      description: `Private furnished room in a 3-person apartment in Astoria. 20 min to Midtown by N/W train. Other roommates are grad students, very respectful and clean. Utilities included. No broker fee.`,
      price: 1350, type: RoomType.PRIVATE, genderPref: GenderPref.FEMALE,
      city: 'New York', state: 'New York', country: 'USA', area: 'Astoria, Queens',
      availableFrom: new Date('2025-08-01'), photos: [],
      isVerifiedHost: false, isFeatured: false, isAvailable: true,
    },
    {
      id: 'room_006', hostId: 'user_006',
      title: `Private room - Bellevue, WA (quiet, fast internet)`,
      description: `Furnished private room in Bellevue. Perfect for tech workers. Dedicated desk, blackout curtains, gigabit internet. 2 other housemates (both engineers). Close to Microsoft and Amazon shuttles.`,
      price: 1100, type: RoomType.PRIVATE, genderPref: GenderPref.ANY,
      city: 'Seattle', state: 'Washington', country: 'USA', area: 'Bellevue',
      availableFrom: new Date('2025-06-01'), photos: [],
      isVerifiedHost: true, isFeatured: true, isAvailable: true,
    },
    {
      id: 'room_007', hostId: 'user_009',
      title: `Shared 2BR - Rogers Park, Chicago`,
      description: `One private bedroom available in a 2BR apartment in Rogers Park. CTA Red Line access. South Asian friendly household, vegetarian-preferred kitchen. Utilities not included. Month-to-month lease possible.`,
      price: 850, type: RoomType.PRIVATE, genderPref: GenderPref.ANY,
      city: 'Chicago', state: 'Illinois', country: 'USA', area: 'Rogers Park',
      availableFrom: new Date('2025-07-01'), photos: [],
      isVerifiedHost: false, isFeatured: false, isAvailable: true,
    },
    {
      id: 'room_008', hostId: 'user_005',
      title: `Studio apartment - South Austin, TX`,
      description: `Modern studio in South Austin. Walking distance to coffee shops and restaurants on South Congress. Parking included. Pet-friendly (small dogs ok). Great for a single professional.`,
      price: 1250, type: RoomType.STUDIO, genderPref: GenderPref.ANY,
      city: 'Austin', state: 'Texas', country: 'USA', area: 'South Austin',
      availableFrom: new Date('2025-06-01'), photos: [],
      isVerifiedHost: false, isFeatured: false, isAvailable: true,
    },
    {
      id: 'room_009', hostId: 'user_010',
      title: `Private room in 4BR house - Irving, TX`,
      description: `Large private room in a 4-bedroom house in Irving. Nepali household, home-cooked daal bhat available on weekends. Very close to DFW airport. Great for flight attendants or frequent travelers.`,
      price: 700, type: RoomType.PRIVATE, genderPref: GenderPref.FEMALE,
      city: 'Dallas', state: 'Texas', country: 'USA', area: 'Irving',
      availableFrom: new Date('2025-05-20'), photos: [],
      isVerifiedHost: true, isFeatured: false, isAvailable: true,
    },
    {
      id: 'room_010', hostId: 'user_011',
      title: `Furnished room - Decatur, GA (near Emory/CDC)`,
      description: `Furnished room in a quiet Decatur neighborhood. Ideal for Emory students, CDC fellows, or professionals. Easy access to MARTA. Two other professional roommates. Utilities included.`,
      price: 825, type: RoomType.PRIVATE, genderPref: GenderPref.ANY,
      city: 'Atlanta', state: 'Georgia', country: 'USA', area: 'Decatur',
      availableFrom: new Date('2025-06-15'), photos: [],
      isVerifiedHost: false, isFeatured: false, isAvailable: true,
    },
  ]

  for (const r of rooms) {
    const { id, hostId, ...rest } = r
    await prisma.room.upsert({
      where: { id },
      update: rest,
      create: r,
    })
  }
  console.log('Seeded 10 rooms.')

  // ─── Jobs ─────────────────────────────────────────────────────────
  const jobs = [
    {
      id: 'job_001', postedById: 'user_001',
      title: `Senior Software Engineer - React/Node`,
      company: `TechBridge Solutions`, type: JobType.FULL_TIME,
      location: `Dallas, TX (Hybrid)`, city: 'Dallas', state: 'Texas', country: 'USA',
      salary: `$130,000 - $160,000`, sponsorship: true,
      description: `TechBridge is hiring a senior SWE for our product team. You will work on our core platform used by 200k+ users. Stack: React 19, Node.js, PostgreSQL, AWS. 5+ years experience required. H1B and green card sponsorship available for exceptional candidates.`,
      expiresAt: new Date('2025-07-31'),
    },
    {
      id: 'job_002', postedById: 'user_003',
      title: `Product Manager - B2B SaaS`,
      company: `Clearwave Inc.`, type: JobType.FULL_TIME,
      location: `San Jose, CA (Remote OK)`, city: 'San Jose', state: 'California', country: 'USA',
      salary: `$140,000 - $175,000`, sponsorship: false,
      description: `Looking for a product manager with B2B SaaS experience to own our analytics product roadmap. You will work closely with engineering, sales, and customer success. Must have 3+ years of PM experience. No visa sponsorship currently but OPT/EAD welcome.`,
      expiresAt: new Date('2025-06-30'),
    },
    {
      id: 'job_003', postedById: 'user_006',
      title: `ML Engineer - NLP`,
      company: `DeepInsight AI`, type: JobType.FULL_TIME,
      location: `Seattle, WA (Hybrid)`, city: 'Seattle', state: 'Washington', country: 'USA',
      salary: `$150,000 - $190,000`, sponsorship: true,
      description: `Join our core ML team building next-gen NLP models for enterprise document processing. You will train LLMs, build eval pipelines, and deploy to production. PyTorch required, Hugging Face experience a plus. OPT, H1B, and green card sponsorship available.`,
      expiresAt: new Date('2025-08-15'),
    },
    {
      id: 'job_004', postedById: 'user_005',
      title: `Civil Engineer EIT - Transportation`,
      company: `Austin Metro Infrastructure`, type: JobType.FULL_TIME,
      location: `Austin, TX (On-site)`, city: 'Austin', state: 'Texas', country: 'USA',
      salary: `$72,000 - $88,000`, sponsorship: false,
      description: `Entry to mid-level civil engineer position for transportation projects including highway design and traffic analysis. FE certification required. PE preferred but not required. We support PE exam prep. Valid US work authorization required.`,
      expiresAt: new Date('2025-06-15'),
    },
    {
      id: 'job_005', postedById: 'user_009',
      title: `Senior Accountant - CPA Preferred`,
      company: `Midwest Financial Group`, type: JobType.FULL_TIME,
      location: `Chicago, IL (Hybrid)`, city: 'Chicago', state: 'Illinois', country: 'USA',
      salary: `$90,000 - $110,000`, sponsorship: false,
      description: `Seeking a senior accountant with 4+ years of experience in financial reporting, tax preparation, and audit support. CPA or CPA-track required. Experience with QuickBooks, NetSuite, or similar. EAD/GC/USC only - no H1B sponsorship.`,
      expiresAt: new Date('2025-07-01'),
    },
    {
      id: 'job_006', postedById: 'user_012',
      title: `UX Designer - Mobile App`,
      company: `HealthFirst Digital`, type: JobType.FULL_TIME,
      location: `Dallas, TX (Remote)`, city: 'Dallas', state: 'Texas', country: 'USA',
      salary: `$85,000 - $105,000`, sponsorship: true,
      description: `HealthFirst is looking for a UX designer to lead design for our iOS/Android patient app. You will conduct user research, create wireframes, and ship high-fidelity designs in Figma. 3+ years UX experience with healthcare or consumer apps preferred. H1B sponsorship considered.`,
      expiresAt: new Date('2025-06-30'),
    },
    {
      id: 'job_007', postedById: 'user_002',
      title: `Registered Nurse (RN) - ICU`,
      company: `Texas Health Resources`, type: JobType.FULL_TIME,
      location: `Dallas, TX (On-site)`, city: 'Dallas', state: 'Texas', country: 'USA',
      salary: `$75,000 - $95,000`, sponsorship: true,
      description: `Texas Health Presbyterian Hospital is hiring ICU RNs. BSN required, MSN preferred. 2+ years of ICU experience. EB-3 green card sponsorship available for international nurses. Strong Nepali nurse community at this hospital.`,
      expiresAt: new Date('2025-09-01'),
    },
    {
      id: 'job_008', postedById: 'user_001',
      title: `DevOps / Cloud Engineer - AWS`,
      company: `NovaBuild Systems`, type: JobType.CONTRACT,
      location: `Dallas, TX (Remote)`, city: 'Dallas', state: 'Texas', country: 'USA',
      salary: `$65 - $85/hr`, sponsorship: false,
      description: `6-month contract (possible extension) for a DevOps engineer with strong AWS skills. Terraform, EKS, CI/CD pipelines, and monitoring required. Corp-to-corp or W2 through agency. Must be authorized to work in the US.`,
      expiresAt: new Date('2025-06-01'),
    },
    {
      id: 'job_009', postedById: 'user_011',
      title: `Data Analyst Intern - Summer 2025`,
      company: `PeachState Analytics`, type: JobType.INTERNSHIP,
      location: `Atlanta, GA (Hybrid)`, city: 'Atlanta', state: 'Georgia', country: 'USA',
      salary: `$22 - $26/hr`, sponsorship: false,
      description: `Summer 2025 internship for current students. You will work on marketing analytics dashboards using Python, SQL, and Tableau. CPT/OPT eligible. Must be enrolled in a degree program. Applications close May 20.`,
      expiresAt: new Date('2025-05-20'),
    },
    {
      id: 'job_010', postedById: 'user_007',
      title: `Restaurant Manager - Nepali/South Asian cuisine`,
      company: `Namaste Palace DFW`, type: JobType.FULL_TIME,
      location: `Garland, TX (On-site)`, city: 'Dallas', state: 'Texas', country: 'USA',
      salary: `$55,000 - $65,000`, sponsorship: false,
      description: `Experienced restaurant manager needed for a busy Nepali restaurant in Garland. Must have 3+ years of restaurant management experience. Nepali language skills strongly preferred. Flexible hours including evenings and weekends. Work authorization required.`,
      expiresAt: new Date('2025-06-30'),
    },
    {
      id: 'job_011', postedById: 'user_004',
      title: `Research Assistant - Biochemistry Lab`,
      company: `New York University`, type: JobType.PART_TIME,
      location: `New York, NY (On-site)`, city: 'New York', state: 'New York', country: 'USA',
      salary: `$20 - $24/hr`, sponsorship: false,
      description: `Part-time RA position in Dr. Chen biochemistry lab at NYU. Up to 20 hours per week. Ideal for current PhD or master students. Experience with gel electrophoresis and cell culture preferred. F1 students eligible.`,
      expiresAt: new Date('2025-05-30'),
    },
    {
      id: 'job_012', postedById: 'user_003',
      title: `Technical Recruiter - Engineering focus`,
      company: `TalentLoop`, type: JobType.FULL_TIME,
      location: `San Francisco, CA (Remote)`, city: 'San Jose', state: 'California', country: 'USA',
      salary: `$80,000 - $100,000 + commission`, sponsorship: false,
      description: `TalentLoop is a boutique tech recruiting firm. We need a technical recruiter who understands software engineering roles. Fluency in engineering concepts, strong sourcing skills, and 2+ years of recruiting experience required. EAD/GC/USC preferred.`,
      expiresAt: new Date('2025-07-15'),
    },
  ]

  for (const j of jobs) {
    const { id, postedById, ...rest } = j
    await prisma.job.upsert({
      where: { id },
      update: rest,
      create: j,
    })
  }
  console.log('Seeded 12 jobs.')

  // ─── Connect Profiles ─────────────────────────────────────────────
  const connectProfiles = [
    { id: 'cp_001', userId: 'user_001', intent: ConnectIntent.FRIENDSHIP, bio: `Software engineer from Kathmandu, been in DFW for 5 years. Looking to meet other Nepali professionals in tech. Enjoy hiking, cricket, and cooking on weekends.`,         photos: [], age: 29, gender: 'MALE',   height: `5'9"`,  language: ['Nepali', 'English', 'Hindi'], caste: null,      religion: 'Hindu',    hometown: 'Kathmandu',         occupation: 'Software Engineer', education: "Master's", drinking: 'Socially',  smoking: 'Never',       dietary: 'Non-vegetarian', isVisible: true, city: 'Dallas',   state: 'Texas',      country: 'USA', lookingFor: ['Everyone'] },
    { id: 'cp_002', userId: 'user_002', intent: ConnectIntent.FRIENDSHIP, bio: `Nurse practitioner and community person. Love organizing cultural events. Looking for genuine friendships - especially other Nepali women in healthcare or similar professions.`, photos: [], age: 31, gender: 'FEMALE', height: `5'5"`,  language: ['Nepali', 'English'],           caste: null,      religion: 'Hindu',    hometown: 'Pokhara',           occupation: 'Nurse Practitioner', education: "Master's", drinking: 'Never',    smoking: 'Never',       dietary: 'Vegetarian',     isVisible: true, city: 'Dallas',   state: 'Texas',      country: 'USA', lookingFor: ['Women'] },
    { id: 'cp_003', userId: 'user_003', intent: ConnectIntent.MARRIAGE,   bio: `Product manager in the Bay Area. Family-oriented, Newari background. Looking for a life partner who values career, culture, and family equally. Open to long-distance initially.`, photos: [], age: 34, gender: 'MALE',   height: `5'10"`, language: ['Nepali', 'Newari', 'English'], caste: 'Newar',   religion: 'Buddhist', hometown: 'Lalitpur (Patan)',   occupation: 'Product Manager',   education: "Master's", drinking: 'Socially',  smoking: 'Never',       dietary: 'Non-vegetarian', isVisible: true, city: 'San Jose', state: 'California', country: 'USA', lookingFor: ['Women'] },
    { id: 'cp_004', userId: 'user_004', intent: ConnectIntent.DATING,     bio: `PhD student, scientist by training, curious about everything. Looking for someone who can keep up with long conversations, weekend museum trips, and occasional hiking.`,             photos: [], age: 27, gender: 'FEMALE', height: `5'4"`,  language: ['Nepali', 'English'],           caste: null,      religion: 'Secular',  hometown: 'Lalitpur (Patan)',   occupation: 'PhD Student',        education: 'PhD',      drinking: 'Never',    smoking: 'Never',       dietary: 'Vegetarian',     isVisible: true, city: 'New York', state: 'New York',   country: 'USA', lookingFor: ['Men'] },
    { id: 'cp_005', userId: 'user_005', intent: ConnectIntent.FRIENDSHIP, bio: `Civil engineer in Austin. New to the city and looking to build a social circle. Into football, live music (Austin has plenty), and cooking Nepali food on Sundays.`,                 photos: [], age: 28, gender: 'MALE',   height: `5'8"`,  language: ['Nepali', 'English'],           caste: null,      religion: 'Hindu',    hometown: 'Biratnagar',        occupation: 'Civil Engineer',     education: "Bachelor's", drinking: 'Socially', smoking: 'Never',       dietary: 'Non-vegetarian', isVisible: true, city: 'Austin',   state: 'Texas',      country: 'USA', lookingFor: ['Everyone'] },
    { id: 'cp_006', userId: 'user_006', intent: ConnectIntent.DATING,     bio: `ML engineer in Seattle. Passionate about climate tech and outdoor adventures. Looking for someone thoughtful and driven. Big plus if you love the PNW outdoors.`,                      photos: [], age: 28, gender: 'FEMALE', height: `5'6"`,  language: ['Nepali', 'English', 'Hindi'],  caste: null,      religion: 'Hindu',    hometown: 'Chitwan',           occupation: 'ML Engineer',        education: "Master's", drinking: 'Never',    smoking: 'Never',       dietary: 'Vegetarian',     isVisible: true, city: 'Seattle',  state: 'Washington', country: 'USA', lookingFor: ['Men'] },
    { id: 'cp_007', userId: 'user_007', intent: ConnectIntent.FRIENDSHIP, bio: `Restaurant owner who loves connecting people over food. If you are new to DFW and want authentic dal bhat and good company, come find me.`,                                          photos: [], age: 37, gender: 'MALE',   height: `5'7"`,  language: ['Nepali', 'English', 'Tamang'], caste: 'Tamang',  religion: 'Buddhist', hometown: 'Kathmandu',         occupation: 'Restaurant Owner',  education: 'High School', drinking: 'Socially', smoking: 'Occasionally', dietary: 'Non-vegetarian', isVisible: true, city: 'Dallas',   state: 'Texas',      country: 'USA', lookingFor: ['Everyone'] },
    { id: 'cp_008', userId: 'user_008', intent: ConnectIntent.FRIENDSHIP, bio: `CS student at UTD. Originally from Pokhara. Looking for study partners and friends who are also navigating student life in the US for the first time.`,                               photos: [], age: 23, gender: 'FEMALE', height: `5'3"`,  language: ['Nepali', 'English'],           caste: null,      religion: 'Hindu',    hometown: 'Pokhara',           occupation: 'Student',            education: "Bachelor's", drinking: 'Never',   smoking: 'Never',       dietary: 'Non-vegetarian', isVisible: true, city: 'Dallas',   state: 'Texas',      country: 'USA', lookingFor: ['Everyone'] },
    { id: 'cp_009', userId: 'user_009', intent: ConnectIntent.MARRIAGE,   bio: `CPA in Chicago. Brahmin background, family values important to me. Looking for someone equally career-focused who also respects culture and tradition.`,                               photos: [], age: 33, gender: 'MALE',   height: `5'8"`,  language: ['Nepali', 'English', 'Hindi'],  caste: 'Brahmin', religion: 'Hindu',    hometown: 'Kathmandu',         occupation: 'CPA',                education: "Bachelor's", drinking: 'Socially', smoking: 'Never',      dietary: 'Vegetarian',     isVisible: true, city: 'Chicago',  state: 'Illinois',   country: 'USA', lookingFor: ['Women'] },
    { id: 'cp_010', userId: 'user_010', intent: ConnectIntent.FRIENDSHIP, bio: `Yoga instructor and community organizer. DFW is my home. I run the annual Teej event and love bringing Nepali women together. Always looking for new friends and collaborators.`,     photos: [], age: 35, gender: 'FEMALE', height: `5'4"`,  language: ['Nepali', 'English'],           caste: null,      religion: 'Hindu',    hometown: 'Kathmandu',         occupation: 'Yoga Instructor',   education: "Bachelor's", drinking: 'Never',   smoking: 'Never',       dietary: 'Vegetarian',     isVisible: true, city: 'Dallas',   state: 'Texas',      country: 'USA', lookingFor: ['Women'] },
    { id: 'cp_011', userId: 'user_011', intent: ConnectIntent.DATING,     bio: `DevOps engineer and community leader in Atlanta. Love the Atlanta food scene and music. Looking for someone who enjoys weekend getaways and spontaneous plans.`,                       photos: [], age: 30, gender: 'MALE',   height: `5'10"`, language: ['Nepali', 'English'],           caste: null,      religion: 'Kirat',    hometown: 'Dharan',            occupation: 'DevOps Engineer',   education: "Bachelor's", drinking: 'Socially', smoking: 'Never',       dietary: 'Non-vegetarian', isVisible: true, city: 'Atlanta',  state: 'Georgia',    country: 'USA', lookingFor: ['Women'] },
    { id: 'cp_012', userId: 'user_012', intent: ConnectIntent.DATING,     bio: `UX designer on OPT in Dallas. Creative, ambitious, and trying to figure out life in the US. Looking for someone genuine who does not take themselves too seriously.`,                  photos: [], age: 26, gender: 'FEMALE', height: `5'2"`,  language: ['Nepali', 'English'],           caste: null,      religion: 'Hindu',    hometown: 'Lalitpur (Patan)',   occupation: 'UX Designer',        education: "Bachelor's", drinking: 'Never',   smoking: 'Never',       dietary: 'Non-vegetarian', isVisible: true, city: 'Dallas',   state: 'Texas',      country: 'USA', lookingFor: ['Men'] },
  ]

  for (const cp of connectProfiles) {
    const { id, userId, ...rest } = cp
    await prisma.connectProfile.upsert({
      where: { id },
      update: rest,
      create: cp,
    })
  }
  console.log('Seeded 12 connect profiles.')

  console.log('\nAll seed data inserted successfully.')
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); prisma.$disconnect(); process.exit(1) })
