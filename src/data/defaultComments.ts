import { Comment } from '../types';
import { jamesOkoye, mayaChen, sofiaAlvarez } from './defaultAuthors';

export const DEFAULT_COMMENTS: Comment[] = [
  {
    id: 'seed-comment-1',
    postId: 'seed-post-1',
    author: jamesOkoye,
    content: '<p>This convinced me to start a dev journal. Three weeks in and my standup updates are already clearer.</p>',
    createdAt: '2025-04-13T10:30:00.000Z',
    likes: 5,
  },
  {
    id: 'seed-comment-2',
    postId: 'seed-post-1',
    author: sofiaAlvarez,
    content: '<p>Writing and travel blogging share the same lesson: capture the idea while it is still fresh.</p>',
    createdAt: '2025-04-14T08:15:00.000Z',
    likes: 2,
  },
  {
    id: 'seed-comment-3',
    postId: 'seed-post-3',
    author: mayaChen,
    content: '<p>Alfama at sunrise is unbeatable. Great reminder to leave space in the itinerary.</p>',
    createdAt: '2025-03-29T19:00:00.000Z',
    likes: 8,
  },
  {
    id: 'seed-comment-4',
    postId: 'seed-post-4',
    author: jamesOkoye,
    content: '<p>Colocating state by feature saved our team so much debugging time. Solid take.</p>',
    createdAt: '2025-03-16T12:45:00.000Z',
    likes: 11,
  },
];
