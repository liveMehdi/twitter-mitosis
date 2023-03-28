import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import Sidebar from "../components/Sidebar";
import Feed from "@/components/Feed";
import { getProviders, getSession, useSession } from "next-auth/react";
import Login from "@/components/Login";
import { useRecoilState } from "recoil";
import MessageFeed from "@/components/MessageFeed";
import DirectMessage from "@/components/DirectMessage";
import { dmState } from "@/atoms/modalAtom";

function Messages({ providers }) {
  const { data: session } = useSession();
  const [dm, setDm] = useRecoilState(dmState)
  if (!session) return <Login providers={providers} />;

  return (
    <div>
      <Head>
        <title>Twitter</title>
        <link rel="icon" href="./favicon.ico" />
      </Head>

      <main
        className="bg-[#15202B] min-h-screen 
        flex max-w-[1500px] mx-auto
        overflow-x-hidden  scroll-smooth"
      >
        <Sidebar page={"messages"} />
        <MessageFeed />
        <DirectMessage dm={dm}/>
      </main>
    </div>
  );
}

export default Messages;

export async function getServerSideProps(context) {
  const providers = await getProviders();
  const session = await getSession(context);

  return {
    props: {
      providers,
      session,
    },
  };
}
