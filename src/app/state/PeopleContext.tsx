import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import type { Person } from './types';

const SEED_PEOPLE: Person[] = [
  // Authors
  {
    id: 'author-jasper-okedi',
    type: 'author',
    name: 'Jasper Okedi',
    title: 'Poet & Founder',
    recognition: '7-Time Published Author',
    bio: 'Jasper Okedi is the "Writer Of This Generation." His relationship with his pen is a very honest one that he wears on his sleeve — for him, the pen is not merely a tool for writing words, but a companion, a confidante, and a source of both purposeful burden and beautiful fruit. His writing offers more than entertainment; it is a long-form conversation on healthy family values, masculinity, femininity, ambition, discipline and self-discovery.',
    image: '/team/jasper-okedi.jpg',
  },
  {
    id: 'author-hood-lubowa',
    type: 'author',
    name: 'Hood Lubowa',
    title: 'Author & Human Rights Advocate',
    recognition: '',
    bio: 'Hood Lubowa is a Ugandan lawyer, author, and human rights advocate who serves as the Civic Engagement and Digital Rights Lead for Oxfam in Uganda. In his novel Out of Dust, he explores themes of loss, violence, and intolerance through the character Suru. He holds a Bachelor of Laws (LLB) from Uganda Christian University and has been cited as a source on legal matters related to intellectual property.',
    image: '/team/hood-lubowa.jpg',
  },
  // Team
  {
    id: 'team-jasper-okedi',
    type: 'team',
    name: 'Jasper Okedi',
    title: 'Founder & CEO',
    recognition: '',
    bio: 'Founder of Procura Publishing and its guiding literary voice — his catalogue and long-form writing on identity, family, and self-discovery shape the house\'s editorial direction.',
    image: '/team/jasper-okedi.jpg',
  },
  {
    id: 'team-hood-lubowa',
    type: 'team',
    name: 'Hood Lubowa',
    title: 'Senior Director & Head of Legal Affairs',
    recognition: '',
    bio: 'Hood Lubowa is a Ugandan lawyer, author, and human rights advocate who serves as the Civic Engagement and Digital Rights Lead for Oxfam in Uganda. Since January 2023, he has been actively involved in discussions and initiatives concerning digital rights, particularly in the Ugandan context, and has been a panelist at events on the subject. He holds a Bachelor of Laws (LLB) from Uganda Christian University and has been cited as a source on legal matters related to intellectual property.',
    image: '/team/hood-lubowa.jpg',
  },
  {
    id: 'team-kizito-vianney-sydney',
    type: 'team',
    name: 'Kizito Vianney Sydney',
    title: 'Senior Director & Board Chairman',
    recognition: '',
    bio: '',
    image: '/team/kizito-vianney-sydney.jpg',
  },
  {
    id: 'team-anne-mbabazi',
    type: 'team',
    name: 'Anne Mbabazi',
    title: 'Director of Writing & Publishing',
    recognition: '',
    bio: '',
    image: '/team/anne-mbabazi.jpg',
  },
  {
    id: 'team-bolton-malik',
    type: 'team',
    name: 'Bolton Malik',
    title: 'Director of Productions',
    recognition: '',
    bio: '',
    image: '/team/bolton-malik.jpg',
  },
  {
    id: 'team-emmit-christopher',
    type: 'team',
    name: 'Emmit Christopher',
    title: 'Senior Creative Director & Web Developer',
    recognition: '',
    bio: '',
    image: '/team/emmit-christopher.jpg',
  },
  {
    id: 'team-nansubuga-sherlie-miriam',
    type: 'team',
    name: 'Nansubuga Sherlie Miriam',
    title: 'Head of Sales & Marketing',
    recognition: '',
    bio: '',
    image: '/team/nansubuga-sherlie-miriam.jpg',
  },
  {
    id: 'team-genius',
    type: 'team',
    name: 'Genius',
    title: 'Head of Film & Movie Productions',
    recognition: '',
    bio: '',
    image: '/team/genius.jpg',
  },
  {
    id: 'team-caleb-kimara',
    type: 'team',
    name: 'Caleb Kimara',
    title: 'Chief of Operations',
    recognition: '',
    bio: '',
    image: '/team/caleb-kimara.jpg',
  },
];

interface PeopleContextValue {
  people: Person[];
  authors: Person[];
  team: Person[];
  addPerson: (person: Person) => void;
  updatePerson: (id: string, patch: Partial<Person>) => void;
  deletePerson: (id: string) => void;
}

const PeopleContext = createContext<PeopleContextValue | null>(null);

export function PeopleProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useLocalStorageState<Person[]>('procura_people', SEED_PEOPLE);

  const value = useMemo<PeopleContextValue>(() => ({
    people,
    authors: people.filter((p) => p.type === 'author'),
    team: people.filter((p) => p.type === 'team'),
    addPerson: (person) => setPeople([...people, person]),
    updatePerson: (id, patch) => setPeople(people.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    deletePerson: (id) => setPeople(people.filter((p) => p.id !== id)),
  }), [people, setPeople]);

  return <PeopleContext.Provider value={value}>{children}</PeopleContext.Provider>;
}

export function usePeople() {
  const ctx = useContext(PeopleContext);
  if (!ctx) throw new Error('usePeople must be used within PeopleProvider');
  return ctx;
}
