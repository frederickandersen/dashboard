import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/error-boundary'
import { Skeleton } from '@/components/ui/skeleton'
import { Dashboard } from '@/components/dashboard'
import { Providers } from '@/components/providers'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <ErrorBoundary fallback={<div>Something went wrong loading the dashboard</div>}>
        <Providers>
          <Suspense fallback={<Skeleton />}>
            <Dashboard />
          </Suspense>
        </Providers>
      </ErrorBoundary>
    </main>
  )
}