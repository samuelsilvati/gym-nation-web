import ShowExercises from '@/components/exercise/showExercises'

function page({ params }: { params: { slug: string; id: string } }) {
  return (
    <div className="mb-20 flex min-h-screen">
      <ShowExercises slug={params.slug} id={params.id} />
    </div>
  )
}

export default page
