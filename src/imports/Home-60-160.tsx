import imgDribbbleShot3 from "figma:asset/9f6e4be523824ae77abae0903c3aee71f8f221a8.png";

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start leading-[0] not-italic relative shrink-0 text-[#111115] w-full">
      <div className="flex flex-col font-['Season_Mix-TRIAL:Medium',sans-serif] justify-center relative shrink-0 text-[16px] tracking-[-0.16px] w-full">
        <p className="leading-[1.1]">Stephen Jude</p>
      </div>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[14px] tracking-[-0.28px] w-full">
        <p className="leading-[1.4]">
          {`Senior Product Designer with engineering depth. `}
          <br aria-hidden="true" />I design consumer and enterprise digital products, with a focus on AI and system-level UX
        </p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6f6f77] text-[14px] text-nowrap tracking-[-0.28px]">
        <p className="leading-[1.2] whitespace-pre">X (Twitter)</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6f6f77] text-[14px] text-nowrap tracking-[-0.28px]">
        <p className="leading-[1.2] whitespace-pre">LinkedIn</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6f6f77] text-[14px] text-nowrap tracking-[-0.28px]">
        <p className="leading-[1.2] whitespace-pre">Github</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6f6f77] text-[14px] text-nowrap tracking-[-0.28px]">
        <p className="leading-[1.2] whitespace-pre">Dribbble</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame5 />
      <Frame4 />
      <Frame3 />
      <Frame2 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame1 />
      <Frame6 />
    </div>
  );
}

function DribbbleShot() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 1">
      <video autoPlay className="absolute max-w-none object-cover size-full" controlsList="nodownload" playsInline>
        <source src="/_videos/v1/3f55f08c1d612f1bd517f9f5b4660e6f01d8f844" />
      </video>
    </div>
  );
}

function DribbbleShot1() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <video autoPlay className="absolute max-w-none object-cover size-full" controlsList="nodownload" playsInline>
        <source src="/_videos/v1/5a7aa956336286850d5b3414a6f563339a48e196" />
      </video>
    </div>
  );
}

function DribbbleShot2() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 3">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot3} />
    </div>
  );
}

function ScollingVisual() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] h-[333px] items-start overflow-x-clip overflow-y-auto pb-0 pt-[24px] px-0 relative shrink-0 w-full" data-name="scolling visual">
      <DribbbleShot />
      <DribbbleShot1 />
      <DribbbleShot2 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[7px] items-start leading-[0] not-italic relative shrink-0 text-[#6f6f77] text-[14px] tracking-[-0.28px] w-[131px]">
      <div className="flex flex-col justify-center relative shrink-0 w-full">
        <p className="leading-[1.2]">Cloudy, 27° in Lagos</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 w-full">
        <p className="leading-[1.2]">6:25 PM</p>
      </div>
    </div>
  );
}

function NavItems() {
  return (
    <div className="content-stretch flex items-center px-[12px] py-0 relative rounded-[999px] shrink-0" data-name="Nav items">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#111115] text-[14px] text-center text-nowrap">
        <p className="leading-[1.1] whitespace-pre">Works</p>
      </div>
    </div>
  );
}

function NavItems1() {
  return (
    <div className="content-stretch flex items-center px-[12px] py-0 relative rounded-[999px] shrink-0" data-name="Nav items">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#111115] text-[14px] text-center text-nowrap">
        <p className="leading-[1.1] whitespace-pre">About</p>
      </div>
    </div>
  );
}

function NavItems2() {
  return (
    <div className="content-stretch flex items-center px-[12px] py-0 relative rounded-[999px] shrink-0" data-name="Nav items">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#111115] text-[14px] text-center text-nowrap">
        <p className="leading-[1.1] whitespace-pre">Playground</p>
      </div>
    </div>
  );
}

function NavItems3() {
  return (
    <div className="content-stretch flex items-center px-[12px] py-0 relative rounded-[999px] shrink-0" data-name="Nav items">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#111115] text-[14px] text-center text-nowrap">
        <p className="leading-[1.1] whitespace-pre">Let’s Talk</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <NavItems />
      <NavItems1 />
      <NavItems2 />
      <NavItems3 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full">
      <Frame7 />
      <Frame />
    </div>
  );
}

function Frame10() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-full items-start justify-between min-h-px min-w-px relative shrink-0">
      <Frame8 />
      <ScollingVisual />
      <Frame9 />
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-zinc-100 relative size-full" data-name="home">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] py-[24px] relative size-full">
          <Frame10 />
        </div>
      </div>
    </div>
  );
}