'use client'

import { useCallback, useMemo, useState } from "react";
import { Button } from '@headlessui/react'
import { intlFormat } from "date-fns";

import PolicyAPI, { Policy } from "@/lib/api/policyApi"
import AddPolicyForm from '@/app/components/policy/AddPolicyForm'

type PolicyListProps = {
  initialData: any[]
}

export default function PolicyList({ initialData }: PolicyListProps) {
  const initialPolicies = useMemo(() => initialData.map(rawData => new Policy(rawData)), [initialData])
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies)
  const [openForm, setOpenForm] = useState(false)
  const queryPolicies = useCallback(async () => {
    const response = await PolicyAPI.list()
    setPolicies(response)
  }, [])
  const onPolicyFormClose = useCallback(async (isCreated: boolean) => {
    if (isCreated) {
      await queryPolicies()
    }
    setOpenForm(false)
  }, [])

  return <div className='mx-auto grid w-full max-w-2xl grid-cols-1 gap-10 xl:max-w-5xl xl:grid-cols-[minmax(0,1fr)_var(--container-2xs)]'>
    <div className='flex justify-between items-center'>
      <h1 className='text-4xl'>Policy</h1>
      <div className="flex-none">
        <Button className='rounded bg-gray-700 py-2 px-4 text-sm text-white data-[hover]:bg-black data-[hover]:data-[active]:bg-black' onClick={() => setOpenForm(true)}>Create</Button>
        <AddPolicyForm isOpen={openForm} onClose={onPolicyFormClose} />
      </div>
    </div>
    <table className="table-fixed row-span-2">
      <thead>
        <tr>
          <th>Name</th>
          <th>Body</th>
          <th>Versions</th>
          <th>Last created</th>
          <th>Last updated</th>
        </tr>
      </thead>
      <tbody>
        {policies.map(policy => <tr key={policy.id} className="cursor-pointer hover:bg-gray-100">
          <td>{policy.name}</td>
          <td>{policy.body[0].text}</td>
          <td>{policy.version}</td>
          <td>{intlFormat(policy.created_at)}</td>
          <td>{intlFormat(policy.updated_at.toDateString())}</td>
        </tr>)}
      </tbody>
    </table>
  </div>
}