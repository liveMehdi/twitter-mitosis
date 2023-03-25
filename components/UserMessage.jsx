import { contactAccount, loadingState } from "@/atoms/modalAtom";
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
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useRecoilState, useRecoilValue } from "recoil";
import { db } from "../firebase";

function UserMessage({ contact }) {
  const { data: session } = useSession();
  const [contactUser, setContactUser] = useState();
  const [loading, setLoading] = useRecoilState(loadingState);
  const router = useRouter();
  const contactInfo = useRecoilValue(contactAccount)
  const [isContact, setIsContact] = useState(false)


  function effectHandler() {
    if (contact.uid1 === session.user?.uid) {
      const theContact = {
        name: contact.name2,
        uid: contact.uid2,
        tag: contact.tag2,
        img: contact.img2,
      };
      setContactUser(theContact);
    } else {
      const theContact = {
        name: contact.name1,
        uid: contact.uid1,
        tag: contact.tag1,
        img: contact.img1,
      };
      setContactUser(theContact);
    }
    setLoading(false);
  }



  useEffect(() => {
    effectHandler();
  }, []);

  return (
    <div className={` ${isContact && "bg-[#73340]"} p-3 flex cursor-pointer space-x-3 items-start w-full text-[15px] text-[#f7f9f9] font-bold hoverAnimationSec`}>
      <img src={contactUser?.img} alt="" className="h-11 w-11 rounded-full" />
      <div className="space-y-[-3px]">
        <div className="flex space-x-1">
          <h4>{contactUser?.name}</h4>
          <h4 className="font-normal text-[#8b98a5] ">@{contactUser?.tag}</h4>
        </div>
        <div className="font-normal text-[#8b98a5] ">Message me!</div>
      </div>
    </div>
  );
}

export default UserMessage;
