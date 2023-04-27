import {Fragment, useState} from "react";
import { Dialog, Transition } from '@headlessui/react'
import {ButtonIconSize} from "@/components/Button/RoundButton";
import CancelIcon from "@/assets/svg/Cancel.svg";
export default function LoginModal({isOpen, closeModal, title, content, persistent, noClose }) {
    const [isShake, setShake] = useState(false)

    const closeModalOnBg = () => {
        if(!persistent) closeModal()
        else {
            setShake(true)
            setTimeout(function () {
                setShake(false)
            }, 1000);
        }
    }

  return (
       <Transition appear show={isOpen} as={Fragment}>
              <Dialog as="div" className="relative z-10 " onClose={()=>closeModalOnBg()}>
                  <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                  >
                      <div className="fixed inset-0 blurred3 bg-opacity-5" />
                  </Transition.Child>

                  <div className="fixed inset-0 overflow-y-auto">
                      <div className="flex min-h-full items-center justify-center sm:p-4 text-center ">
                          <Transition.Child
                              as={Fragment}
                              enter="ease-out duration-300"
                              enterFrom="opacity-0 scale-95"
                              enterTo="opacity-100 scale-100"
                              leave="ease-in duration-200"
                              leaveFrom="opacity-100 scale-100"
                              leaveTo="opacity-0 scale-95"
                          >
                              <Dialog.Panel className={`flex flex-col min-h-screen glareBg w-full sm:min-h-min sm:max-w-md transform overflow-hidden  glareBg text-white p-10 md:rounded-xl bg-navy2 text-start transition-all ${isShake ? 'shake' : ''}`}>
                                  <Dialog.Title
                                      as="h3"
                                      className="text-3xl font-bold pb-5 pt-5"
                                  >
                                      {title}
                                      {!noClose && <div className={`absolute top-[20px] right-[0px] cursor-pointer`} onClick={closeModal}>
                                          <CancelIcon className={ButtonIconSize.hero}/>
                                      </div>}
                                  </Dialog.Title>
                                  {content}

                              </Dialog.Panel>
                          </Transition.Child>
                      </div>
                  </div>
              </Dialog>
          </Transition>
  )
}

