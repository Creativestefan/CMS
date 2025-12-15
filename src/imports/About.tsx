import svgPaths from "./svg-stlvka59f2";
import imgStefangene1 from "figma:asset/5ca95468fef17cafe7845ee9ce73841ba9f52d3f.png";
import imgImage12 from "figma:asset/4adc0e114f9d010b09d3a0f8e814ef45fe28c5a3.png";
import imgImage14 from "figma:asset/05dc248841d3e5412a3dc447cce69f58c5c6ee13.png";
import imgImage15 from "figma:asset/8d3aaf1c07398706eb83e9b88086ef1bba91ff75.png";

function LeadIcon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="lead-icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="lead-icon">
          <path d={svgPaths.p12653880} fill="var(--fill-0, #4E4E55)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[rgba(39,39,42,0.06)] content-stretch flex items-center justify-center left-[calc(91.67%+52px)] min-h-[28px] min-w-[28px] overflow-clip rounded-[9999px] top-[24px]" data-name="Button">
      <LeadIcon />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[23px] items-start leading-[0] not-italic relative shrink-0 text-[#111115] text-[14px] tracking-[-0.28px] w-full">
      <div className="flex flex-col justify-center relative shrink-0 w-full">
        <p className="leading-[1.4]">My journey into product design started in 2018 as a graphic designer, where I built websites using Blogger and WordPress. That early exposure to layout, structure, and the web shaped how I think about design today. In 2020, I transitioned fully into Product Design, moving from static visuals to solving product problems through research, flows, and scalable interface systems.</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 w-full">
        <p className="leading-[1.4]">Today, I design products, build with LLM support, and develop websites using Framer. I’m also actively learning Rive for interactive motion and deepening my focus on AI and automation to support more dynamic, adaptive product experiences.</p>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <div className="relative shrink-0 size-[101px]" data-name="stefangene 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgStefangene1} />
      </div>
      <Frame9 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[100px]">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6f6f77] text-[14px] text-nowrap tracking-[-0.14px]">
        <p className="leading-[1.2] whitespace-pre">2025</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Frame 131">
          <path d={svgPaths.p3e15cf00} fill="var(--fill-0, #111C7A)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#111115] text-[14px] text-nowrap tracking-[-0.14px]">
        <p className="leading-[1.2] whitespace-pre">{`Product Designer at `}</p>
      </div>
      <Frame />
      <div className="flex flex-col font-['Season_Mix-TRIAL:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#111115] text-[14px] text-nowrap tracking-[-0.14px]">
        <p className="leading-[1.2] whitespace-pre">Utopia</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[40px] items-center relative shrink-0 w-full">
      <Frame5 />
      <Frame1 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex h-[20px] items-center p-[4px] relative shrink-0">
      <div className="h-[20px] relative shrink-0 w-[26px]" data-name="image 12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[130.3%] left-0 max-w-none top-[-15.15%] w-full" src={imgImage12} />
        </div>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#111115] text-[14px] text-nowrap tracking-[-0.14px]">
        <p className="leading-[1.2] whitespace-pre">{`Product Designer at `}</p>
      </div>
      <Frame12 />
      <div className="flex flex-col font-['Season_Mix-TRIAL:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#111115] text-[14px] text-nowrap tracking-[-0.14px]">
        <p className="leading-[1.2] whitespace-pre">Clouddley</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[40px] items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6f6f77] text-[14px] tracking-[-0.14px] w-[100px]">
        <p className="leading-[1.2]">2024 - 2025</p>
      </div>
      <Frame13 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[100px]">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6f6f77] text-[14px] text-nowrap tracking-[-0.14px]">
        <p className="leading-[1.2] whitespace-pre">2023 - 2024</p>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex h-[20px] items-center p-[4px] relative shrink-0">
      <div className="relative shrink-0 size-[20px]" data-name="image 14">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage14} />
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#111115] text-[14px] text-nowrap tracking-[-0.14px]">
        <p className="leading-[1.2] whitespace-pre">{`Product Designer at `}</p>
      </div>
      <Frame14 />
      <div className="flex flex-col font-['Season_Mix-TRIAL:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#111115] text-[14px] text-nowrap tracking-[-0.14px]">
        <p className="leading-[1.2] whitespace-pre">Askyourpdf</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[40px] items-center relative shrink-0 w-full">
      <Frame6 />
      <Frame15 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[100px]">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6f6f77] text-[14px] text-nowrap tracking-[-0.14px]">
        <p className="leading-[1.2] whitespace-pre">2021 - 2022</p>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex h-[20px] items-center p-[4px] relative shrink-0">
      <div className="h-[20px] relative shrink-0 w-[24px]" data-name="image 15">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage15} />
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#111115] text-[14px] text-nowrap tracking-[-0.14px]">
        <p className="leading-[1.2] whitespace-pre">{`Product Designer at `}</p>
      </div>
      <Frame17 />
      <div className="flex flex-col font-['Season_Mix-TRIAL:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#111115] text-[14px] text-nowrap tracking-[-0.14px]">
        <p className="leading-[1.2] whitespace-pre">Genius on Demand</p>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[40px] items-center relative shrink-0 w-full">
      <Frame16 />
      <Frame18 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame2 />
      <Frame3 />
      <Frame4 />
      <Frame19 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black tracking-[0.48px] uppercase w-full">
        <p className="leading-[1.2]">Work Experience</p>
      </div>
      <Frame7 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[40px] items-start left-[40px] max-w-[436px] top-[100px] w-[436px]">
      <Frame10 />
      <Frame8 />
    </div>
  );
}

export default function About() {
  return (
    <div className="bg-zinc-100 relative size-full" data-name="about">
      <div className="absolute flex flex-col font-['Season_Mix-TRIAL:Medium',sans-serif] justify-center leading-[0] left-[40px] not-italic text-[#111115] text-[16px] top-[43px] tracking-[-0.16px] translate-y-[-50%] w-[437px]">
        <p className="leading-[1.1]">Stephen Jude</p>
      </div>
      <Button />
      <Frame11 />
    </div>
  );
}