
import React from 'react';
import { Course } from './types';

export const COLORS = {
  primary: '#8b5cf6', // Violet 500
  secondary: '#ede9fe', // Violet 100
  background: '#f7f6fe',
  text: '#1f2937',
  white: '#ffffff',
};

export const LUMINA_STUDENT_ROSTER = [
  "Mahalingan M", "Manasa M", "Manosh kailas S G", "MAYAKRISHNA.M", "Mehanath M",
  "Melfina A", "Mithunalakshmi N", "Mohamed Milfer M", "Mohan Raj C", "Monisha K",
  "Mouleeswaran.V", "Naveen G", "Nikesh s", "Pallavi C", "Paramesh",
  "Pavan Robin Singh R", "Pooja shree S", "Pranitha B", "PRIYADHARSHAN R", "RAKSHITHA M",
  "Rangan Kesavan", "Rithika S", "Roobini N", "M.rubeshravan", "Rushiath S N",
  "R sai kshitij", "Sanjay.s", "Saranya S", "Sasikumar R", "Semsto C Simion",
  "Shanmuga Priya C", "Shree Dharshan B S", "Sivajothi A", "Sivasangkari k", "Sonali D",
  "M Sri Nahul", "SRI SUDHAN KS", "Sri Sugisha K", "Sridhar B", "Subakarthikeyan",
  "Vishwa S", "Yakdthesh KA", "YOGESH S", "YUKESH B", "Ramkumar M",
  "RAVIPRASATH K", "Sanjay Kumar s", "Santhosh kumar D", "Suresh Kumar R"
];

const DEFAULT_LESSONS = [
  { id: 'l1', title: 'Absolute Basics & Terminology', duration: '30m', isCompleted: false },
  { id: 'l2', title: 'Historical Context & Fundamentals', duration: '45m', isCompleted: false },
  { id: 'l3', title: 'Core Mechanics Deep Dive', duration: '1h 15m', isCompleted: false },
  { id: 'l4', title: 'Intermediate Application & Tools', duration: '1h 45m', isCompleted: false },
  { id: 'l5', title: 'Advanced Optimization Techniques', duration: '2h 10m', isCompleted: false },
  { id: 'l6', title: 'Industry Best Practices', duration: '1h 30m', isCompleted: false },
  { id: 'l7', title: 'Real-world Capstone Project', duration: '4h 00m', isCompleted: false },
];

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Advanced React Architecture',
    description: 'Master the patterns used in enterprise-scale React apps including Compound Components and Render Props.',
    instructorId: 'i1',
    instructorName: 'Tutor 1',
    progress: 0,
    category: 'Engineering',
    image: 'https://picsum.photos/seed/react/400/250',
    enrolled: false,
    lessons: [
      { id: 'l1', title: 'React Fundamentals Refresher', duration: '45m', isCompleted: false },
      { id: 'l2', title: 'Component Lifecycle & Essential Hooks', duration: '30m', isCompleted: false },
      { id: 'l3', title: 'Advanced State Management', duration: '55m', isCompleted: false },
      { id: 'l4', title: 'Compound Component Pattern', duration: '1h 15m', isCompleted: false },
      { id: 'l5', title: 'Render Props & HOCs', duration: '1h', isCompleted: false },
      { id: 'l6', title: 'Server Components Mastery', duration: '2h', isCompleted: false },
      { id: 'l7', title: 'Performance Profiling & Optimization', duration: '1h 30m', isCompleted: false },
    ]
  },
  {
    id: '2',
    title: 'UI/UX Design Systems',
    description: 'Building scalable design tokens and accessible components for modern web platforms.',
    instructorId: 'i2',
    instructorName: 'Tutor 2',
    progress: 0,
    category: 'Design',
    image: 'https://picsum.photos/seed/design/400/250',
    enrolled: false,
    lessons: [
      { id: 'd1', title: 'Intro to Design Thinking', duration: '40m', isCompleted: false },
      { id: 'd2', title: 'Color Theory & Accessibility Fundamentals', duration: '50m', isCompleted: false },
      { id: 'd3', title: 'Typography Systems from Scratch', duration: '1h', isCompleted: false },
      { id: 'd4', title: 'Grid Systems & Layout Logic', duration: '45m', isCompleted: false },
      { id: 'd5', title: 'Atomic Design Principles', duration: '1h 15m', isCompleted: false },
      { id: 'd6', title: 'Documentation with Storybook', duration: '2h', isCompleted: false },
    ]
  },
  {
    id: '3',
    title: 'Cloud Native Development',
    description: 'Kubernetes, Docker, and AWS fundamentals for the modern infrastructure engineer.',
    instructorId: 'i3',
    instructorName: 'Tutor 3',
    progress: 0,
    category: 'Cloud',
    image: 'https://picsum.photos/seed/cloud/400/250',
    enrolled: false,
    lessons: [...DEFAULT_LESSONS]
  },
  {
    id: '4',
    title: 'Machine Learning Essentials',
    description: 'A mathematical introduction to supervised and unsupervised learning algorithms.',
    instructorId: 'i4',
    instructorName: 'Tutor 4',
    progress: 0,
    category: 'AI',
    image: 'https://picsum.photos/seed/ml/400/250',
    enrolled: false,
    lessons: [...DEFAULT_LESSONS]
  },
  {
    id: '5',
    title: 'Product Management 101',
    description: 'From ideation to launch: how to manage a modern software product lifecycle.',
    instructorId: 'i5',
    instructorName: 'Tutor 5',
    progress: 0,
    category: 'Business',
    image: 'https://picsum.photos/seed/business/400/250',
    enrolled: false,
    lessons: [...DEFAULT_LESSONS]
  },
  {
    id: '6',
    title: 'Digital Illustration Mastery',
    description: 'Learn professional techniques for digital art using industry standard tools.',
    instructorId: 'i6',
    instructorName: 'Tutor 6',
    progress: 0,
    category: 'Design',
    image: 'https://picsum.photos/seed/art/400/250',
    enrolled: false,
    lessons: [...DEFAULT_LESSONS]
  },
  {
    id: '7',
    title: 'Cybersecurity Fundamentals',
    description: 'Protecting digital assets through network security and ethical hacking basics.',
    instructorId: 'i7',
    instructorName: 'Tutor 7',
    progress: 0,
    category: 'Security',
    image: 'https://picsum.photos/seed/sec/400/250',
    enrolled: false,
    lessons: [...DEFAULT_LESSONS]
  },
  {
    id: '8',
    title: 'DevOps CI/CD Pipelines',
    description: 'Automating the software delivery process with GitHub Actions and Jenkins.',
    instructorId: 'i8',
    instructorName: 'Tutor 8',
    progress: 0,
    category: 'Cloud',
    image: 'https://picsum.photos/seed/devops/400/250',
    enrolled: false,
    lessons: [...DEFAULT_LESSONS]
  },
  {
    id: '9',
    title: 'Digital Marketing Strategy',
    description: 'Growth hacking and performance marketing for digital-first companies.',
    instructorId: 'i9',
    instructorName: 'Tutor 9',
    progress: 0,
    category: 'Business',
    image: 'https://picsum.photos/seed/marketing/400/250',
    enrolled: false,
    lessons: [...DEFAULT_LESSONS]
  },
  {
    id: '10',
    title: 'Blockchain Architecture',
    description: 'Deep dive into decentralized consensus mechanisms and smart contract logic.',
    instructorId: 'i10',
    instructorName: 'Tutor 10',
    progress: 0,
    category: 'Engineering',
    image: 'https://picsum.photos/seed/blockchain/400/250',
    enrolled: false,
    lessons: [...DEFAULT_LESSONS]
  }
];

export const ICONS = {
  Dashboard: ({ className }: { className?: string } = {}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  ),
  Course: ({ className }: { className?: string } = {}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
  ),
  Assessment: ({ className }: { className?: string } = {}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
  ),
  Analytics: ({ className }: { className?: string } = {}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  ),
  Settings: ({ className }: { className?: string } = {}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  ),
  Certificate: ({ className }: { className?: string } = {}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  ),
  User: ({ className }: { className?: string } = {}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  ),
  Attendance: ({ className }: { className?: string } = {}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ),
};
