'use client'

import { useCallback, useMemo, useState } from "react";
import { Button } from '@headlessui/react'
import { intlFormat } from "date-fns";
import { useRouter } from "next/navigation"
import { faSquare, faTrash, faPen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import PolicyAPI, { Policy } from "@/lib/api/policyApi"
import PolicyForm from '@/app/components/policy/PolicyForm'

type PolicyListProps = {
  initialData: any[]
}

export default function PolicyList({ initialData }: PolicyListProps) {
  const router = useRouter()
  const initialPolicies = useMemo(() => initialData.map(rawData => new Policy(rawData)), [initialData])
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies)
  const [openForm, setOpenForm] = useState(false)
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | undefined>()

  const queryPolicies = useCallback(async () => {
    const response = await PolicyAPI.list()
    setPolicies(response)
  }, [])

  const onPolicyFormClose = useCallback(async (isUpdated: boolean) => {
    if (isUpdated) {
      await queryPolicies()
    }
    setOpenForm(false)
    setSelectedPolicy(undefined)
  }, [queryPolicies])

  const handlePolicyClick = useCallback((policyId: string) => () => {
    router.push(`/policy/${policyId}`)
  }, [router])

  const handleEditClick = useCallback((policy: Policy) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedPolicy(policy)
    setOpenForm(true)
  }, [])

  const handleDeleteClick = useCallback((policy: Policy) => async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete policy "${policy.name}"?`)) {
      await PolicyAPI.delete(policy.id)
      await queryPolicies()
    }
  }, [queryPolicies])

  return <div className='mx-auto grid w-full max-w-2xl grid-cols-1 gap-10 xl:max-w-5xl xl:grid-cols-[minmax(0,1fr)_var(--container-2xs)]'>
    <div className='flex justify-between items-center'>
      <h1 className='text-4xl'>Policy</h1>
      <div className="flex-none">
        <Button className='rounded bg-gray-700 py-2 px-4 text-sm text-white data-[hover]:bg-black data-[hover]:data-[active]:bg-black' onClick={() => setOpenForm(true)}>Create</Button>
      </div>
    </div>
    <table className="table-auto row-span-2">
      <thead>
        <tr>
          <th>Name</th>
          <th>Body</th>
          <th>Versions</th>
          <th>Last created</th>
          <th>Last updated</th>
          <th>{/* Actions */}</th>
        </tr>
      </thead>
      <tbody>
        {policies.map(policy => <tr 
          key={`${policy.id}-${policy.version}`} 
          className="cursor-pointer hover:bg-gray-100"
          onClick={handlePolicyClick(policy.id)}
        >
          <td>{policy.name}</td>
          <td>{policy.body[0].text}</td>
          <td>{policy.version}</td>
          <td>{intlFormat(policy.created_at)}</td>
          <td>{intlFormat(policy.updated_at.toDateString())}</td>
          <td>
            <div className="flex gap-0 text-xs">
              <div className="fa-stack" onClick={handleEditClick(policy)}>
                <FontAwesomeIcon icon={faSquare} className="fa-stack-2x text-gray-700 hover:text-black" />
                <FontAwesomeIcon icon={faPen} className="fa-stack-1x text-white" />
              </div>
              <div className="fa-stack" onClick={handleDeleteClick(policy)}>
                <FontAwesomeIcon icon={faSquare} className="fa-stack-2x text-gray-700 hover:text-black" />
                <FontAwesomeIcon icon={faTrash} className="fa-stack-1x text-white" />
              </div>
            </div>
          </td>
        </tr>)}
      </tbody>
    </table>
    <PolicyForm 
      isOpen={openForm} 
      onClose={onPolicyFormClose}
      policy={selectedPolicy}
    />
  </div>
}