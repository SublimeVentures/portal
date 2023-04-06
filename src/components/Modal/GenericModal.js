import {Fragment, useState} from "react";
import { Dialog, Transition } from '@headlessui/react'
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import WalletIcon from "@/svg/Wallet.svg";
import CancelIcon from "@/svg/Cancel.svg";
import Image from "next/image";
export default function LoginModal({isOpen, closeModal, title, content }) {

  return (
       <Transition appear show={isOpen} as={Fragment}>
              <Dialog as="div" className="relative z-10 " onClose={closeModal}>
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
                      <div className="flex min-h-full items-center justify-center p-4 text-center ">
                          <Transition.Child
                              as={Fragment}
                              enter="ease-out duration-300"
                              enterFrom="opacity-0 scale-95"
                              enterTo="opacity-100 scale-100"
                              leave="ease-in duration-200"
                              leaveFrom="opacity-100 scale-100"
                              leaveTo="opacity-0 scale-95"
                          >
                              <Dialog.Panel className="w-full glareBg max-w-md transform overflow-hidden  glareBg text-white p-10 md:rounded-xl bg-navy2 text-start transition-all">
                                  <Dialog.Title
                                      as="h3"
                                      className="text-3xl font-bold pb-5 pt-5"
                                  >
                                      {title}
                                      <div className={`absolute top-[20px] right-[0px] cursor-pointer`} onClick={closeModal}>
                                          <CancelIcon className={ButtonIconSize.hero}/>
                                      </div>
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

