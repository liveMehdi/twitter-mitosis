import { DotsHorizontalIcon } from "@heroicons/react/outline";
import Image from "next/image";

function Trending({ result }) {
  return (
    <div
      className="hover:bg-white hover:bg-opacity-[0.03] px-4
    py-3 transition duration-200 ease-out flex cursor-pointer
     items-center justify-between"
    >
      <div className="space-y-[1.5px]">
        <p className="text-[#8B98A5] text-[13px] font-medium">
          {result.heading}
        </p>
        <h6 className="font-bold max-w-[250px] text-[15px]">
          {result.description}
        </h6>
        {result.tags ? (
          <p className="text-[#8B98A5] text-[13px] font-medium max-w-[250px]">
            <span>{result.tags}</span>
          </p>
        ) : (
          <p className="text-[#8B98A5] text-[13px] font-medium max-w-[250px]">
            <span>{result.tweets} {result.tweets && "Tweets"}</span>
          </p>
        )}
      </div>
      {result.img ? (
        <Image
          src={result.img}
          width={70}
          height={70}
          className="rounded-2xl object-cover"
        />
      ) : (
        <div className="icon group">
          <DotsHorizontalIcon className="h-5 text-[#8B98A5] group-hover:text-[#1d9bf0]" />
        </div>
      )}
    </div>
  );
}

export default Trending;
