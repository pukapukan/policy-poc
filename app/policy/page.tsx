import PolicyList from "@/app/components/policy/PolicyList"

export default async function PolicyPage() {
  const responsne = await fetch('http://0.0.0.0:8000/policies')
  const initialData = await responsne.json()
  return <PolicyList initialData={initialData} />
}
