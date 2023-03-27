import { SparklesIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import Input from "./Input";
import { onSnapshot, collection, query, orderBy } from "@firebase/firestore";
import { db } from "../firebase";
import Post from "./Post";
import { useSession } from "next-auth/react";

function Feed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
          setLoading(false);
        }
      ),

    [db]
  );

  return (
    <div
      className="text-white flex-grow border-l border-r border-gray-700
    max-w-2xl sm:ml-[73px] xl:ml-[370px]"
    >
      <div
        className="text-[#d9d9d9] flex items-center justify-between 
        py-2 px-3 sticky top-0 z-50 bg-[#15202B] border-gray-800 border-b"
      >
        <h2 className="text-lg sm:text-xl font-bold">Home</h2>
        <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 ml-auto">
          <SparklesIcon className="h-5 text-white" />
        </div>
      </div>

      <Input />

      <div className="pb-72">
        {!loading &&
          posts.map((post) => (
            <Post key={post.id} id={post.id} post={post.data()} />
          ))}
        {loading && new Array(4).fill(0).map((item) => (
          <div className="p-3 flex pr-12 pb-8">
            <div className="h-11 w-11 bg-[#8b98a554] rounded-full"></div>
            <div className="pl-5 pt-1 flex flex-col space-y-4 w-full">
              <div className="w-52 h-4 bg-[#8b98a554]"></div>
              <div className="w-[80%] h-4 bg-[#8b98a554]"></div>
              <div className="w-[90%] bg-[#8b98a533] h-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;
