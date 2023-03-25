import Image from "next/image";
import SidebarLink from "./SidebarLink";
import {
  HomeIcon as homeSolid,
  InboxIcon as inboxSolid,
} from "@heroicons/react/solid";
import {
  HashtagIcon,
  HomeIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardListIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function Sidebar({ page }) {
  const { data: session } = useSession();
  const [so, setSo] = useState(false);
  const router = useRouter();
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [home, setHome] = useState(false);
  const [messages, setMessages] = useState(false);
  const [whichHome, setWhichHome] = useState(HomeIcon);
  const [whichInbox, setWhichInbox] = useState(InboxIcon);

  useEffect(() => {
    if (page === "home") {
      setHome(true);
      setWhichHome(homeSolid);
    } else if (page === "messages") {
      setMessages(true);
      setWhichInbox(inboxSolid);
    }
  }, []);

  function whichIcon(page) {}

  function logoutHandler(id) {
    let screenSize = window.innerWidth;
    if (id) {
      if (screenSize > 1280) {
        setIsLogOpen(!isLogOpen);
      } else {
        signOut();
      }
    } else {
      signOut();
    }
  }

  return (
    <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full">
      <div className="flex items-center justify-center w-14 h-14 hoverAnimation p-0 xl:ml-24">
        <a href="/">
          <Image
            src="https://img.icons8.com/ios-glyphs/480/ffffff/twitter--v1.png"
            width={30}
            alt=""
            height={30}
          />
        </a>
      </div>
      <div className="space-y-2.5 mt-4 mb-2.5 xl:ml-24">
        <a href="/">
          <SidebarLink text="Home" Icon={whichHome} active={home} on={true}/>
        </a>
        <SidebarLink text="Explore" Icon={HashtagIcon} />
        <SidebarLink text="Notifications" Icon={BellIcon} />
        <a href="/messages">
          <SidebarLink text="Messages" Icon={whichInbox} active={messages} on={true}/>
        </a>
        <SidebarLink text="Bookmarks" Icon={BookmarkIcon} />
        <SidebarLink text="Lists" Icon={ClipboardListIcon} />
        <SidebarLink text="Profile" Icon={UserIcon} />
        <SidebarLink text="More" Icon={DotsCircleHorizontalIcon} />
      </div>
      <button
        className="hidden xl:inline ml-auto mt-2 bg-[#1d9bf0] 
      rounded-full w-56 h-[52px] text-lg text-white font-bold
      shadow-md hover:bg-[#1a8cda] transition ease-out"
      >
        Tweet
      </button>
      <div
        className={`text-[#d9d9d9] flex items-center justify-center 
      mt-auto ${
        !isLogOpen ? "hoverAnimation" : "hoverAnimationNone"
      } xl:ml-auto xl:-mr-5 relative`}
        onClick={() => logoutHandler(1)}
      >
        {isLogOpen && (
          <div
            id="clickox"
            className=" hidden xl:flex absolute bottom-[105%] w-full px-3 py-4 rounded-xl 
          text-[#d9d9d9] font-bold items-center justify-start cursor-pointer hoverAnimation glow"
            onClick={() => logoutHandler()}
          >
            <h4>Log out @{session?.user.tag}</h4>
          </div>
        )}
        <img
          src={session?.user.image}
          alt=""
          className="h-10 w-10 rounded-full xl:mr-2.5 "
        />
        <div className="hidden xl:inline leading-5">
          <h4 className="font-bold">
            {session?.user.name.split(" ").slice(0, 2).join(" ")}
          </h4>
          <p className="text-[#6e767d]">@{session?.user.tag}</p>
        </div>
        <DotsHorizontalIcon className="h-5 hidden xl:inline ml-9" />
      </div>
    </div>
  );
}

export default Sidebar;
