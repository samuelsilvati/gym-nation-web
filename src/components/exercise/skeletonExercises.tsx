import { Skeleton } from '../ui/skeleton'

function SkeletonExercises() {
  return (
    <div className="container mt-16 max-w-4xl px-2 md:px-8">
      <div className="flex w-full items-center justify-center py-2">
        <div className="w-full pt-10">
          <div className="mb-3 flex justify-between px-5">
            <div className="w-full flex-grow">
              <div className="flex h-16 items-center py-3 pl-2">
                <div className="flex flex-grow flex-col items-start gap-2 ">
                  <Skeleton className="h-5 w-56"></Skeleton>
                  <Skeleton className="h-5 w-48"></Skeleton>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Skeleton className="h-8 w-6"></Skeleton>
            </div>
          </div>
          <div className="mb-3 flex justify-between px-5">
            <div className="w-full flex-grow">
              <div className="flex h-16 items-center py-3 pl-2">
                <div className="flex flex-grow flex-col items-start gap-2 ">
                  <Skeleton className="h-5 w-56"></Skeleton>
                  <Skeleton className="h-5 w-48"></Skeleton>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Skeleton className="h-8 w-6"></Skeleton>
            </div>
          </div>
          <div className="mb-3 flex justify-between px-5">
            <div className="w-full flex-grow">
              <div className="flex h-16 items-center py-3 pl-2">
                <div className="flex flex-grow flex-col items-start gap-2 ">
                  <Skeleton className="h-5 w-56"></Skeleton>
                  <Skeleton className="h-5 w-48"></Skeleton>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Skeleton className="h-8 w-6"></Skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonExercises
