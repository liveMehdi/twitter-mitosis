import Head from "next/head";
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
import Image from "next/image";
import { Inter } from "next/font/google";
import Sidebar from "../components/Sidebar";
import Feed from "@/components/Feed";
import { getProviders, getSession, useSession } from "next-auth/react";
import Login from "@/components/Login";
import Modal from "@/components/Modal";
import { useRecoilState } from "recoil";
import { modalState } from "@/atoms/modalAtom";
import Widgets from "@/components/Widgets";
import { useEffect } from "react";
import { db } from "@/firebase";

export default function Home({ trendingResults, followResults, providers }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  if (!session) return <Login providers={providers} />;

  async function effectHandler() {
    const userCollectionUidRef = await query(
      collection(db, "users"),
      where("uid", "==", session.user?.uid)
    );
    const data = await getDocs(userCollectionUidRef);
    if (data.docs.length > 0) {
      return;
    } else {
      const user = {
        name: session?.user?.name,
        img: session?.user?.image,
        tag: session?.user?.tag,
        uid: session?.user?.uid,
      };
      addDoc(collection(db, "users"), user);
    }
  }

  useEffect(() => {
    effectHandler()
  }, []);

  return (
    <div className="">
      <Head>
        <title>Twitter</title>
        <link rel="icon" href="./favicon.ico" />
      </Head>

      <main className="bg-[#15202B] min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar page={"home"} />
        <Feed />
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />

        {isOpen && <Modal />}
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const trendingResults = await fetch(
    "https://json.extendsclass.com/bin/a7f0da22fb6c"
  ).then((res) => res.json());
  const followResults = await fetch(
    "https://json.extendsclass.com/bin/0ca32fec7765"
  ).then((res) => res.json());
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      trendingResults,
      followResults,
      providers,
      session,
    },
  };
}
