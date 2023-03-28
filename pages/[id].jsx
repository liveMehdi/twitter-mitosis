import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import { getProviders, getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../atoms/modalAtom";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import { db } from "../firebase";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import Head from "next/head";
import { ArrowSmLeftIcon } from "@heroicons/react/outline";
import Comment from "@/components/Comment";
import Widgets from "@/components/Widgets";
import fetch1 from "@/fetch1";
import fetch2 from "@/fetch2";
import Login from "@/components/Login";


function PostPage({ trendingResults, followResults, providers }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  if (!session) return <Login providers={providers} />;

  useEffect(
    () =>
      onSnapshot(doc(db, "posts", id), (snapshot) => {
        setPost(snapshot.data());
      }),
    [db]
  );

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );

  return (
    <div className="">
      <Head>
        <title>
          {post?.username} on Twitter: {post?.text}
        </title>
        <link rel="icon" href="./favicon.ico" />
      </Head>

      <main className=" min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />

        <div
          className="flex-grow border-l border-r border-gray-700
        max-w-2xl sm:ml-[73px] xl:ml-[370px]"
        >
          <div
            className="flex items-center px-1.5 py-2 border-b border-gray-700
             text-[#d9d9d9] font-semibold text-xl gap-=x-4 sticky top-0 z-50
             "
          >
            <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0">
              <ArrowLeftIcon
                className="h-5 text-white"
                onClick={() => router.push("/")}
              />
            </div>
            Tweet
          </div>
          <Post id={id} post={post} postPage />
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              id={comment.id}
              comment={comment.data()}
            />
          ))}
        </div>
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />

        {isOpen && <Modal />}
      </main>
    </div>
  );
}

export default PostPage;

export async function getServerSideProps(context) {
  const trendingResults = fetch1
  const followResults = fetch2
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
