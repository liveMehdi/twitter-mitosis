import { CogIcon, SparklesIcon } from "@heroicons/react/outline";
import DirectMessage from "./DirectMessage";
import UserMessage from "./UserMessage";
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
import { Fragment, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useSession } from "next-auth/react";
import { contactAccount, dmState, loadingState } from "@/atoms/modalAtom";

function MessageFeed() {
  const [contacts, setContacts] = useState();
  const [loading, setLoading] = useRecoilState(loadingState);
  const { data: session } = useSession();
  const [dmActive, setDmActive] = useRecoilState(dmState);
  const [contactInfo, setContactInfo] = useRecoilState(contactAccount);

  async function handleEffect() {
    const contactCollectionUidRef = await query(
      collection(db, "contacts"),
      where("uid1", "==", session.user?.uid)
    );
    const data = await getDocs(contactCollectionUidRef);
    const contact = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    const contactCollectionUidRefAlt = await query(
      collection(db, "contacts"),
      where("uid2", "==", session.user?.uid)
    );
    const dataAlt = await getDocs(contactCollectionUidRefAlt);
    const contactAlt = dataAlt.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const totalContacts = contact.concat(contactAlt);
    setContacts(totalContacts);
  }

  function handleClick(contact) {
    setDmActive(true);
    setContactInfo(contact);
  }

  useEffect(() => {
    setLoading(true);
    handleEffect();
  }, []);

  return (
    <div
      className={`w-full text-white flex-grow border-l border-r border-gray-700
    lg:max-w-[320px] sm:ml-[73px] xl:ml-[370px] overflow-y-scroll fixed h-full scrollbar-hide ${
      dmActive && "hidden lg:inline"
    }`}
    >
      <div
        className="text-[#d9d9d9] flex items-center justify-between 
        pt-2 pb-3 pl-[14px] pr-1 sticky top-0 z-50"
      >
        <h2 className="text-lg sm:text-xl font-bold">Messages</h2>
        <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 ml-auto">
          <CogIcon className="h-5 text-white" />
        </div>
      </div>

      {contacts?.map((contact) => (
        <div onClick={() => handleClick(contact)}>
          <UserMessage contact={contact} />
        </div>
      ))}
    </div>
  );
}

export default MessageFeed;
