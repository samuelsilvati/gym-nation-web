import ShowExercises from '@/components/exercise/showExercises'

function page({ params }: { params: { slug: string; id: string } }) {
  return (
    <div className="mb-28 flex min-h-screen md:mb-0">
      <ShowExercises slug={params.slug} id={params.id} />
    </div>
  )
}

export default page
