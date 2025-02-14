import PolicyAPI, { Policy } from '@/lib/api/policyApi'

interface PageProps {
  params: {
    policyId: string
  }
}

export default async function PolicyDetailPage({ params }: PageProps) {
  const policy: Policy = await PolicyAPI.get(params.policyId)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Policy Details</h1>
      {/* Add your policy detail display components here */}
      <pre>{JSON.stringify(policy, null, 2)}</pre>
    </div>
  )
}