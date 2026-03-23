import { UserProfile, Event, Book, Schedule, AboutSection } from './types';

export const initialAboutSections: AboutSection[] = [
  {
    id: '1',
    titleKey: 'history',
    iconName: 'History',
    contentKey: "historyContent",
    color: "from-blue-500/20 to-transparent"
  },
  {
    id: '2',
    titleKey: 'mission',
    iconName: 'Target',
    contentKey: "missionContent",
    color: "from-emerald-500/20 to-transparent"
  },
  {
    id: '3',
    titleKey: 'vision',
    iconName: 'Eye',
    contentKey: "visionContent",
    color: "from-purple-500/20 to-transparent"
  },
  {
    id: '4',
    titleKey: 'achievements',
    iconName: 'Award',
    contentKey: "achievementsContent",
    color: "from-amber-500/20 to-transparent"
  }
];

export const initialStudents: UserProfile[] = [
  {
    uid: '1',
    name: 'Abebe Kebede',
    email: 'abebe@example.com',
    role: 'user',
    gender: 'Male',
    age: 22,
    dateOfBirth: '2004-03-23',
    class: 3,
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    uid: '2',
    name: 'Marta Hailu',
    email: 'marta@example.com',
    role: 'user',
    gender: 'Female',
    age: 19,
    dateOfBirth: '2007-03-23',
    class: 3,
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    uid: 'admin-1',
    name: 'Admin User',
    email: 'admin@sabbath.com',
    role: 'admin',
    gender: 'Male',
    age: 35,
    dateOfBirth: '1991-03-23',
    status: 'approved',
    createdAt: new Date().toISOString()
  }
];

export const initialEvents: Event[] = [
  {
    id: 'e1',
    titleKey: 'event1Title',
    descriptionKey: 'event1Desc',
    date: new Date(Date.now() + 86400000 * 7).toISOString(),
    createdBy: 'admin-1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'e2',
    titleKey: 'event2Title',
    descriptionKey: 'event2Desc',
    date: new Date(Date.now() + 86400000 * 14).toISOString(),
    createdBy: 'admin-1',
    createdAt: new Date().toISOString()
  }
];

export const initialBooks: Book[] = [
  {
    id: 'b1',
    titleKey: 'book1Title',
    fileURL: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'admin-1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'b2',
    titleKey: 'book2Title',
    fileURL: '#',
    uploadedBy: 'admin-1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'b3',
    titleKey: 'book3Title',
    fileURL: '#',
    uploadedBy: 'admin-1',
    createdAt: new Date().toISOString()
  }
];

export const initialSchedules: Schedule[] = [
  { id: 's1', class: 1, course: 'Bible Stories', weekend: 'March 28-29' },
  { id: 's2', class: 2, course: 'Life of Jesus', weekend: 'March 28-29' },
  { id: 's3', class: 3, course: 'Prophecy Study', weekend: 'March 28-29' },
  { id: 's4', class: 4, course: 'Advanced Theology', weekend: 'March 28-29' }
];
