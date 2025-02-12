import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useCallback } from 'react'
import PolicyAPI from '@/lib/api/policyApi'
import {v4 as uuid} from 'uuid'

type AddPolicyForm = {
  isOpen: boolean;
  onClose: (isCreated: boolean) => void;
}

export default function AddPolicyForm({isOpen, onClose}: AddPolicyForm) {
  const createPolicy = useCallback(async (formData: FormData) => {
    const name = formData.get('name') as string || ''
    const body = formData.get('body') as string || ''
    await PolicyAPI.create(
      uuid(),
      {
        name,
        body: [{
          type: 'text',
          text: body
        }]
      }
    )
    onClose(true)
  }, [PolicyAPI, onClose])

  return <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center items-center p-0">
          <DialogPanel
            transition
            className="relative text-sm transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in my-8 w-full max-w-lg data-closed:translate-y-0 data-closed:scale-95"
          >
            <form className="bg-white px-4 pt-5 pb-4 p-6 pb-4 m-4" action={createPolicy}>
              <div className="flex items-start">
                <div className="text-left">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                    Create a new policy
                  </DialogTitle>
                  <div className="mt-2 mb-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to deactivate your account? All of your data will be permanently removed.
                      This action cannot be undone.
                    </p>
                  </div>
                  <div className='mt-2'>
                    <label className="text-xs block text-gray-500 font-bold mb-1 mb-0 pr-4" htmlFor="policy-name">
                      Name
                    </label>
                    <input required className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full p-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="name" type="text" />
                  </div>
                  <div className='mt-2'>
                    <label className="text-xs block text-gray-500 font-bold mb-1 mb-0 pr-4" htmlFor="policy-body">
                      Body
                    </label>
                    <input required className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full p-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="body" type="text" />
                  </div>
                </div>
              </div>
              <div className="py-3 flex flex-row-reverse">
                <button
                  type="submit"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-black ml-3 w-auto"
                >
                  Submit
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => onClose(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 mt-0 w-auto"
                >
                  Cancel
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>  
    </Dialog>
}