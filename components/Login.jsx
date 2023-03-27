import { signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import DialogModal from "./Dialog";

function Login({ providers }) {
  return (
    <div>
      <Head>
        <title>Twitter</title>
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <div className="flex flex-col items-center space-y-20 pt-44">
        <Image
        alt=""
          className="object-contain"
          src="https://img.icons8.com/ios-glyphs/480/ffffff/twitter--v1.png"
          width={150}
          height={150}
          priority
        />
        <div className="relative">
          {Object.values(providers).map((provider) => (
            <div
              key={provider.name}
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            >
              <button className="afterStylesLogin relative items-center shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 justify-start inline-block px-5 py-3 overflow-hidden font-medium transition-all bg-[#1d9bf0] rounded-[1rem] hover:bg-white group">
                <span className="absolute inset-0 border-0 group-hover:border-[25px] ease-linear duration-100 transition-all border-white rounded-full"></span>
                <span className="relative w-full text-left text-white transition-colors duration-300 ease-in-out group-hover:text-blue-600">
                  Log in with Google
                </span>
              </button>
            </div>
          ))}
          <div className=" ">
            <DialogModal />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
