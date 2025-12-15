export default function Loading() {
  return (
    <div className="bg-zinc-900 relative size-full" data-name="loading">
      <div className="absolute flex flex-col font-['Season_Mix-TRIAL:Medium',sans-serif] justify-center leading-[0] left-[calc(50%+536px)] not-italic text-[96px] text-black text-nowrap top-[calc(50%+364.5px)] tracking-[-0.96px] translate-y-[-50%]">
        <p className="leading-[1.2] whitespace-pre">0%</p>
      </div>
    </div>
  );
}