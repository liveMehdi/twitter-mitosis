import { Dialog, Transition } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/outline'
import { Fragment, useState } from 'react'

export default function DialogModal() {
  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <div className="absolute top-[100px] inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-full hover:bg-[#154667] transition duration-200 ease-in-out p-1 text-sm font-medium text-white bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          <InformationCircleIcon className='w-6 h-6'/>
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#1c1b1b] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg  leading-6 text-gray-100  pb-2 font-bold"
                  >
                    Twitter Mitosis by <span className='text-[#1d9bf0]'>Mehdi</span>
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-[#c8e6f2] space-y-2">
                      
                      <p><span className='text-gray-100 font-semibold'>You can:</span> Post text/emoji/images/gifs, like/comment on posts, message other registered users, log-in via google.</p>
                      <p>• Utilises <span className='text-white'>Firebase V9</span> for fully functional<b> posting, commenting, liking, and messaging.</b></p>
                      <p>• Utilises <span className='text-white'>NextAuth</span> for <b>Google Authentication.</b></p>
                      <p>• Utilises <span className='text-white'>NextJS & TailwindCSS</span> for <b>fully responsive, accurate design</b>.</p>
                      <p>• Utilises <span className='text-white'>Recoil</span> for robust <b>state management</b>.</p>
                      <p>• Utilises libraries <span className='text-white'>MaterialUI, Emoji Mart, and skeleton loading states</span> for <b>user-friendly UI</b> etc.</p>
                      <p>• Mocks a API serverside render for <b>widgets.</b></p>
                     <p></p>
                    </p>
                    
                  </div>

                  <div className="mt-5">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#00abeec0] px-4 py-2 text-sm font-medium transition text-white hover:bg-gray-200 hover:text-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Alright!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
