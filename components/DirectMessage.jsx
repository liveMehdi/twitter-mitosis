import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState, useEffect } from "react";
import { useRef } from "react";
import UserModal from "./UserModal";
import { contactAccount, userModalState } from "@/atoms/modalAtom";
import { useRecoilState } from "recoil";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  ArrowLeftIcon,
  EmojiHappyIcon,
  InformationCircleIcon,
  PaperAirplaneIcon,
  PhotographIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";

function DirectMessage({ dm }) {
  const [isOpen, setIsOpen] = useRecoilState(userModalState);
  const [contact, setContact] = useRecoilState(contactAccount);
  const [recipient, setRecipient] = useState();
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [messageArray, setMessageArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orig, setOrig] = useState([]);
  const [alt, setAlt] = useState([]);

  function addEmoji(e) {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
  }
  ////////////////////////////////////////////

  const scrollView = useRef();

  async function sendPost() {
    if (loading) {
      return;
    }
    setLoading(true);
    if (!input) {
      return;
    }
    const messageRelation = {
      senderName: session.user?.name,
      senderTag: session.user?.tag,
      senderUid: session.user?.uid,
      senderImg: session.user?.image,
      recipientName: recipient?.name,
      recipientTag: recipient?.tag,
      recipientUid: recipient?.uid,
      recipientImg: recipient?.img,
      messageText: input,
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, "messages"), messageRelation);

    setInput("");
    setLoading(false);
    setShowEmojis(false);
    handleEffect();
  }

  ////////////////////////////////////////////
  useEffect(() => {
    if (contact) {
      if (contact.uid1 === session?.user?.uid) {
        const recipientObject = {
          name: contact.name2,
          tag: contact.tag2,
          uid: contact.uid2,
          img: contact.img2,
        };
        setRecipient(recipientObject);
      } else if (contact.uid2 === session?.user?.uid) {
        const recipientObject = {
          name: contact.name1,
          tag: contact.tag1,
          uid: contact.uid1,
          img: contact.img1,
        };
        setRecipient(recipientObject);
      }
    }
  }, [contact]);

  async function handleEffect() {
    if (contact && recipient) {
      const userCollectionUidRef = await query(
        collection(db, "messages"),
        where("senderUid", "==", session.user?.uid),
        where("recipientUid", "==", recipient?.uid),
        orderBy("timestamp")
      );
      onSnapshot(userCollectionUidRef, (snapshot) => {
        let messageArrayUnordered = [];
        snapshot.docs.map((doc) => {
          messageArrayUnordered.push({ ...doc.data(), id: doc.id });
        });

        setOrig(messageArrayUnordered);
      });

      const userCollectionUidRefAlt = await query(
        collection(db, "messages"),
        where("senderUid", "==", recipient?.uid),
        where("recipientUid", "==", session.user?.uid),
        orderBy("timestamp")
      );
      onSnapshot(userCollectionUidRefAlt, (snapshot) => {
        let messageArrayUnorderedAlt = [];
        snapshot.docs.map((doc) => {
          messageArrayUnorderedAlt.push({ ...doc.data(), id: doc.id });
        });
        setAlt(messageArrayUnorderedAlt);
      });
    }
  }

  useEffect(() => {
    const messagesToSort = orig.concat(alt);
    const sortedMessages = messagesToSort.sort(
      (a, b) => a.timestamp - b.timestamp
    );
    setMessageArray(sortedMessages);
    scrollView.current?.scrollIntoView({ behaviour: "smooth" });
  }, [orig, alt]);

  useEffect(() => {
    handleEffect();
  }, [recipient]);

  if (dm) {
    return (
      <div
        className={`w-full sm:w-[90%] border-l sm:ml-[73px] lg:ml-[393px] lg:border-l-0 lg:w-[600px] 
      border-r border-gray-700 flex flex-col justify-between  
        xl:ml-[690px]`}
      >
        <div
          className="w-full sm:w-[89.9%] lg:w-[600px]
        z-50 bg-[rgb(21,32,43,0.9)] h-[53px] 
        flex items-center justify-between border-r border-gray-700
        lg:justify-end px-4 fixed"
        >
          <div className="hoverAnimation w-9 h-9 flex items-center justify-center lg:hidden">
            <ArrowLeftIcon
              className="h-5 text-white"
              onClick={() => window.location.reload()}
            />
          </div>
          <InformationCircleIcon
            className="text-[#f7f9f9] hoverAnimationSec w-5 h-5"
            onClick={() => console.log(messageArray)}
          />
        </div>

        <div className="h-full flex flex-col px-4 pt-[43px]">
          <div
            className="w-full h-[320px] flex flex-col items-center py-5 
          px-4 text-[#f7f9f9] text-[15px] relative hoverAnimationSec border-b border-gray-700"
          >
            <img
              src={recipient?.img}
              alt=""
              className="h-16 w-16 rounded-full"
            />
            <h2 className="font-bold mt-1">{recipient?.name}</h2>
            <h2 className="text-[#8b98a5]">@{recipient?.tag}</h2>
            <h2 className="mt-3">Try send me a message!</h2>
            <h3 className="my-3 text-[14px] text-[#8b98a5]">
              Joined March 2023 · 0 Followers
            </h3>
          </div>
          <div className="w-full h-full pt-4 flex flex-col text-white text-[15px]">
            {messageArray &&
              messageArray.map((mess, index) => {
                if (mess.senderUid === session.user?.uid) {
                  return (
                    <div key={index} className="w-full pb-3 flex flex-col items-end">
                      <div className="w-fit py-3 px-4 bg-[#1d9bf0] max-w-[340px] rounded-t-3xl rounded-bl-3xl">
                        {mess.messageText}
                      </div>
                    </div>
                  );
                } else if (mess.senderUid === recipient.uid) {
                  return (
                    <div key={index} className="w-full pb-3 flex flex-col">
                      <div className="w-fit py-3 px-4 bg-[#3d5466] max-w-[340px] rounded-t-3xl rounded-br-3xl mb-[5px]">
                        {mess.messageText}
                      </div>
                    </div>
                  );
                }
              })}

            <div className="h-10px w-full" ref={scrollView}></div>
          </div>
        </div>

        <div
          className="w-full sm:w-[89.9%] h-[57px] flex items-center justify-end px-[12px] pb-[5px] pt-[7px] 
        border-t border-gray-700 fixed bottom-0 lg:w-[600px] z-50 bg-[#15202b] border-r "
        >
          <div className="w-full h-full my-1 bg-[#273340] rounded-[17px] text-[#f7f9f9] flex items-center justify-between">
            <div className="flex items-center ml-1 relative">
              <div className="h-[33px] w-[33px] flex items-center justify-center mr-1 hoverAnimationSecRound">
                <PhotographIcon className="w-5 h-5  text-[#1d9bf0]" />
              </div>
              <div
                className="h-[33px] w-[33px] flex items-center justify-center mr-1 hoverAnimationSecRound"
                onClick={() => setShowEmojis(!showEmojis)}
              >
                <EmojiHappyIcon className="w-5 h-5 text-[#1d9bf0]" />
              </div>
              {showEmojis && (
                <div className="pickerStylesAlt">
                  <Picker data={data} onEmojiSelect={addEmoji} />
                </div>
              )}
            </div>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Start a new message"
              className="bg-transparent outline-none text-[#d9d9d9] 
              px-3 py-1 text-[15px]
            placeholder-gray-400 tracking-wide w-full min-h-[50px] "
            />
            <button
              className="h-[33px] w-[33px] flex items-center justify-center mr-2 hoverAnimationSecRound disabled:hover:bg-transparent 
              disabled:opacity-50 disabled:cursor-default transition duration-100 ease-out"
              disabled={false}
              onClick={sendPost}
            >
              <PaperAirplaneIcon className="w-[18px] h-[18px] text-[#1d9bf0] rotate-90 " />
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="hidden lg:flex w-[600px] lg:ml-[393px] items-center justify-center 
      border-r border-gray-700 xl:ml-[690px]"
      >
        <div className="translate-y-[-20%] max-w-xs">
          <div className="flex flex-col ">
            <h1 className="font-bold text-[31px] text-[#f7f9f9]">
              Select a message
            </h1>
            <p className="text-[15px] text-[#8B98a5] mt-[8px]">
              Choose from your existing conversations, start a new one, or just
              keep swimming.
            </p>
            <button
              className="mt-[28px] bg-[#1d9bf0] 
          rounded-full w-52 h-[52px] text-lg text-white font-bold
          shadow-md hover:bg-[#1a8cda] transition ease-out"
              onClick={() => setIsOpen(true)}
            >
              New message
            </button>
            <UserModal />
          </div>
        </div>
      </div>
    );
  }
}

export default DirectMessage;
