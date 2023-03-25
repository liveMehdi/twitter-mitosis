import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { contacts, userModalState } from "@/atoms/modalAtom";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  addDoc,
  getDocs,
  where,
} from "@firebase/firestore";
import { db } from "@/firebase";
import { useRecoilState } from "recoil";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Moment from "react-moment";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "#15202B",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function UserModal() {
  const [isOpen, setIsOpen] = useRecoilState(userModalState);
  const [theContacts, setTheContacts] = useRecoilState(contacts);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);

  async function contactHandler(user) {
    ///////////
    const userCollectionUidRef = await query(
      collection(db, "contacts"),
      where("uid1", "==", session.user?.uid),
      where("uid2", "==", user.uid)
    );
    const data = await getDocs(userCollectionUidRef);
    const userCollectionUidRefAlt = await query(
      collection(db, "contacts"),
      where("uid2", "==", session.user?.uid),
      where("uid1", "==", user.uid)
    );
    const dataAlt = await getDocs(userCollectionUidRefAlt);
    ///////////
    if (data.docs.length > 0 || dataAlt.docs.length > 0) {
      setIsOpen(false)
      return;
    } else {
      const relation = {
        name1: session?.user?.name,
        img1: session?.user?.image,
        tag1: session?.user?.tag,
        uid1: session?.user?.uid,
        name2: user.name,
        img2: user.img,
        tag2: user.tag,
        uid2: user.uid,
      };
      addDoc(collection(db, "contacts"), relation);
      
      setTimeout(() => {
        window.location.reload()
      }, 1000);
      

    }
  }

  async function effectHandler() {
    const userCollectionUidRef = await query(
      collection(db, "users"),
      where("uid", "!=", session.user?.uid)
    );
    const data = await getDocs(userCollectionUidRef);
    const users = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setUsers(users);
  }

  useEffect(() => {
    effectHandler();
  }, []);

  return (
    <div>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-50 inset-0 pt-8"
          onClose={setIsOpen}
        >
          <div className="flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-[#15202B] rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                <div className="flex items-center px-1.5 py-2 border-b border-gray-800">
                  <div
                    className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <XIcon className="h-[22px] text-white" />
                  </div>
                </div>
                <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
                  <div className="w-full">
                    {users.map((user) => (
                      <div key={user.id}
                        className="w-full hoverAnimationSec py-[16px] px-[12px] mb-[8px]"
                        onClick={() => contactHandler(user)}
                      >
                        <div className="flex text-[#f7f9f9] font-bold text-[15px] space-x-4 items-center">
                          <img
                            src={user.img}
                            alt=""
                            className="h-11 w-11 rounded-full"
                          />
                          <div>
                            <h4>{user.name}</h4>
                            <h4 className="font-normal text-[#8b98a5] ">
                              @{user.tag}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
