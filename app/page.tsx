import Stage from '@/components/Stage'
import ScrollProvider from '@/components/Scroll/ScrollProvider'

export default function Home() {
  return (
    <ScrollProvider>
      <main className="relative w-full">
        <div className="sticky top-0 h-screen w-full">
          <Stage />
        </div>
        <div className="h-[800vh] w-full" aria-hidden />
      </main>
    </ScrollProvider>
  )
}
