import ShowExercises from '@/components/exercise/showExercises'
import { Toaster } from '@/components/ui/toaster'

async function page({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params

  return (
    <div className="mb-28 flex min-h-screen md:mb-0">
      <Toaster />
      <ShowExercises slug={slug} id={id} />
    </div>
  )
}

export default page
