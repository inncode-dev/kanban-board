import type { Task } from '../types'

// A function (not a constant) so every reset gets a fresh array
// and the reducer can never mutate shared module state by accident.
export function createDemoTasks(): Task[] {
  return [
    {
      id: 'demo-1',
      title: 'Define the project scope',
      description: 'List the must-have features and what is out of scope.',
      priority: 'high',
      status: 'done',
    },
    {
      id: 'demo-2',
      title: 'Design the data model',
      description: 'A task has a title, a description, a priority and a column.',
      priority: 'medium',
      status: 'done',
    },
    {
      id: 'demo-3',
      title: 'Build the reducer',
      description: 'One pure function that handles every board action.',
      priority: 'high',
      status: 'in-progress',
    },
    {
      id: 'demo-4',
      title: 'Add drag and drop',
      description: 'Native HTML5 events, plus arrow buttons for keyboard users.',
      priority: 'medium',
      status: 'in-progress',
    },
    {
      id: 'demo-5',
      title: 'Write the README',
      description: '',
      priority: 'low',
      status: 'todo',
    },
    {
      id: 'demo-6',
      title: 'Deploy on Vercel',
      description: 'Push to GitHub, import the repo, done.',
      priority: 'low',
      status: 'todo',
    },
  ]
}
