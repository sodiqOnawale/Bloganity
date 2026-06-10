import { BlogPost } from '../types';
import { jamesOkoye, mayaChen, sofiaAlvarez } from './defaultAuthors';

const publicImage = (filename: string) => `${process.env.PUBLIC_URL}/images/${filename}`;

export const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'seed-post-1',
    title: 'Why Every Developer Should Write',
    excerpt: 'Writing sharpens how you think about code, teams, and the problems you are trying to solve.',
    content: `
      <p>Most developers treat writing as something separate from building. That is a mistake.</p>
      <p>A short post forces you to explain a decision, document a tradeoff, or teach a concept without hiding behind jargon. The clarity you gain shows up in pull requests, design docs, and the way you mentor others.</p>
      <p>Start small: one lesson learned per week. Your future self (and your teammates) will thank you.</p>
    `,
    author: mayaChen,
    category: 'Technology',
    tags: ['writing', 'career', 'developer'],
    imageUrl: publicImage('seed-developer-writing.jpg'),
    published: true,
    createdAt: '2025-04-12T09:00:00.000Z',
    updatedAt: '2025-04-12T09:00:00.000Z',
    views: 284,
    likes: 42,
    likedBy: [],
    readingTime: 3,
  },
  {
    id: 'seed-post-2',
    title: 'Morning Routines That Actually Stick',
    excerpt: 'Forget the 5 a.m. miracle schedule. Small, repeatable habits beat dramatic overhauls every time.',
    content: `
      <p>The best morning routine is the one you can repeat on a Tuesday when you slept badly and have meetings at nine.</p>
      <p>Try anchoring three actions: hydrate, move for ten minutes, and write one sentence about what matters today. That is enough to create momentum without turning your morning into a second job.</p>
      <p>Consistency compounds. Perfection does not.</p>
    `,
    author: jamesOkoye,
    category: 'Lifestyle',
    tags: ['habits', 'wellness', 'productivity'],
    imageUrl: publicImage('seed-morning-routine.jpg'),
    published: true,
    createdAt: '2025-04-08T14:30:00.000Z',
    updatedAt: '2025-04-08T14:30:00.000Z',
    views: 512,
    likes: 67,
    likedBy: [],
    readingTime: 2,
  },
  {
    id: 'seed-post-3',
    title: '48 Hours in Lisbon',
    excerpt: 'Tile-lined alleys, ocean air, and the kind of meals that make you forget your return flight.',
    content: `
      <p>Lisbon rewards walkers. Start in Alfama before the crowds arrive, follow the tram bells uphill, and let yourself get lost on purpose.</p>
      <p>Save one long afternoon for Belém, but skip the checklist mentality. The city is better when you leave room for a spontaneous pastel de nata and a viewpoint you did not plan.</p>
      <p>Travel note: wear comfortable shoes and keep your camera in your pocket for the first hour. Look up instead.</p>
    `,
    author: sofiaAlvarez,
    category: 'Travel',
    tags: ['lisbon', 'europe', 'city-guide'],
    imageUrl: publicImage('seed-lisbon.jpg'),
    published: true,
    createdAt: '2025-03-28T11:15:00.000Z',
    updatedAt: '2025-03-28T11:15:00.000Z',
    views: 891,
    likes: 124,
    likedBy: [],
    readingTime: 4,
  },
  {
    id: 'seed-post-4',
    title: 'React State in 2025: What Changed',
    excerpt: 'Context still matters, but the way we compose state across features has gotten more intentional.',
    content: `
      <p>React applications in 2025 are less about finding the one perfect state library and more about drawing clear boundaries.</p>
      <p>Keep server state separate from UI state. Reach for context for cross-cutting concerns, but do not turn it into a second database. Colocate state with the feature that owns it.</p>
      <p>The teams shipping fastest are not chasing novelty. They are reducing accidental complexity.</p>
    `,
    author: mayaChen,
    category: 'Technology',
    tags: ['react', 'frontend', 'architecture'],
    imageUrl: publicImage('seed-react.jpg'),
    published: true,
    createdAt: '2025-03-15T08:45:00.000Z',
    updatedAt: '2025-03-15T08:45:00.000Z',
    views: 1204,
    likes: 198,
    likedBy: [],
    readingTime: 4,
  },
  {
    id: 'seed-post-5',
    title: 'Finding Your Writing Voice',
    excerpt: 'Your voice is not a performance. It is what is left when you stop trying to sound impressive.',
    content: `
      <p>New writers often imitate their favorite newsletters or essayists. That is useful practice, but imitation is training wheels—not a destination.</p>
      <p>Pay attention to the phrases you use when explaining something to a friend. Read your drafts out loud. Cut the sentences that sound like a press release.</p>
      <p>Voice emerges when you write often and edit honestly.</p>
    `,
    author: jamesOkoye,
    category: 'Creativity',
    tags: ['writing', 'creativity', 'craft'],
    imageUrl: publicImage('seed-writing-voice.jpg'),
    published: true,
    createdAt: '2025-02-22T16:00:00.000Z',
    updatedAt: '2025-02-22T16:00:00.000Z',
    views: 367,
    likes: 51,
    likedBy: [],
    readingTime: 3,
  },
  {
    id: 'seed-post-6',
    title: 'The Case for Slow Cooking',
    excerpt: 'A simmering pot teaches patience—and makes weeknight dinners feel less like a chore.',
    content: `
      <p>Fast meals have their place, but slow cooking gives you something rare: a meal that improves while you do other things.</p>
      <p>Start with a simple base—onion, garlic, herbs, and a protein you trust. Let time do the work. The result is deeper flavor and a kitchen that smells like you have your life together, even if you do not.</p>
      <p>Invite someone over. Share the pot. That is the whole point.</p>
    `,
    author: sofiaAlvarez,
    category: 'Food',
    tags: ['cooking', 'recipes', 'home'],
    imageUrl: publicImage('seed-slow-cooking.jpg'),
    published: true,
    createdAt: '2025-02-10T18:20:00.000Z',
    updatedAt: '2025-02-10T18:20:00.000Z',
    views: 445,
    likes: 73,
    likedBy: [],
    readingTime: 3,
  },
];

export const DEFAULT_PUBLISHED_POST_COUNT = DEFAULT_POSTS.filter((post) => post.published).length;
