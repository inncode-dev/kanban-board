import { BoardProvider } from './state/BoardProvider'
import { Header } from './components/Header'
import { ProgressBar } from './components/ProgressBar'
import { TaskForm } from './components/TaskForm'
import { Board } from './components/Board'

export default function App() {
  return (
    <BoardProvider>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
        <Header />
        <main className="flex flex-col gap-6">
          <ProgressBar />
          <TaskForm />
          <Board />
        </main>
      </div>
    </BoardProvider>
  )
}
