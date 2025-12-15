import svgPaths from "./svg-n6bnaq92hu";
import imgDribbbleShot2 from "figma:asset/42d29160a997d6d2e37fc0523c34b945daefb2b9.png";
import imgDribbbleShot3 from "figma:asset/f98901dc3765d686209974d0b1e00e7205ec582f.png";
import imgDribbbleShot4 from "figma:asset/82b8de0815763f0c500c9d93e006c8b4d4f6a7b4.png";
import imgDribbbleShot5 from "figma:asset/272f1a12735ad257a1edc21b0dddea353e20652d.png";
import imgDribbbleShot6 from "figma:asset/acae12eedc42665a37fa52d3dd6aedd6c8ef352b.png";
import imgDribbbleShot7 from "figma:asset/0efb3529592f0be6b1759dd829b200fcb7669472.png";
import imgDribbbleShot8 from "figma:asset/bf02510e8547166b84ca4039ae75787ba3db960c.png";
import imgDribbbleShot9 from "figma:asset/aa8a17f1a0929edaf382875747500f7c74e87769.png";
import imgDribbbleShot10 from "figma:asset/2b0d670a1e82f313ac734769cf4f489226d14417.png";
import imgDribbbleShot11 from "figma:asset/a0ac68164702e5c8fe9ae9b630ede96b8c9fee07.png";
import imgDribbbleShot12 from "figma:asset/3f412cdd8b09bbfbbe0df6bf5e304fbe4460d4b0.png";

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['Season_Mix-TRIAL:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#111115] text-[16px] tracking-[-0.16px] w-full">
        <p className="leading-[1.1]">Stephen Jude</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[16px] top-[24px] w-[370px]">
      <Frame />
    </div>
  );
}

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
    <div className="absolute bg-[rgba(39,39,42,0.06)] content-stretch flex items-center justify-center left-[373px] min-h-[28px] min-w-[28px] overflow-clip rounded-[9999px] top-[24px]" data-name="Button">
      <LeadIcon />
    </div>
  );
}

function DribbbleShot() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot2} />
    </div>
  );
}

function Frame3() {
  return (
    <div className="[grid-area:1_/_2] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot />
    </div>
  );
}

function DribbbleShot1() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot3} />
    </div>
  );
}

function Frame4() {
  return (
    <div className="[grid-area:1_/_3] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot1 />
    </div>
  );
}

function DribbbleShot2() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot4} />
    </div>
  );
}

function Frame5() {
  return (
    <div className="[grid-area:1_/_4] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot2 />
    </div>
  );
}

function DribbbleShot3() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot5} />
    </div>
  );
}

function Frame6() {
  return (
    <div className="[grid-area:1_/_5] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot3 />
    </div>
  );
}

function DribbbleShot4() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot5} />
    </div>
  );
}

function Frame19() {
  return (
    <div className="[grid-area:1_/_6] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot4 />
    </div>
  );
}

function DribbbleShot5() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot6} />
    </div>
  );
}

function Frame7() {
  return (
    <div className="[grid-area:2_/_1] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot5 />
    </div>
  );
}

function DribbbleShot6() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot7} />
    </div>
  );
}

function Frame8() {
  return (
    <div className="[grid-area:2_/_2] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot6 />
    </div>
  );
}

function DribbbleShot7() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot7} />
    </div>
  );
}

function Frame14() {
  return (
    <div className="[grid-area:2_/_3] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot7 />
    </div>
  );
}

function DribbbleShot8() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot8} />
    </div>
  );
}

function Frame9() {
  return (
    <div className="[grid-area:2_/_4] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot8 />
    </div>
  );
}

function DribbbleShot9() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot8} />
    </div>
  );
}

function Frame15() {
  return (
    <div className="[grid-area:2_/_5] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot9 />
    </div>
  );
}

function DribbbleShot10() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot8} />
    </div>
  );
}

function Frame16() {
  return (
    <div className="[grid-area:2_/_6] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot10 />
    </div>
  );
}

function DribbbleShot11() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot8} />
    </div>
  );
}

function Frame18() {
  return (
    <div className="[grid-area:3_/_1] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot11 />
    </div>
  );
}

function DribbbleShot12() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot9} />
    </div>
  );
}

function Frame10() {
  return (
    <div className="[grid-area:3_/_2] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot12 />
    </div>
  );
}

function DribbbleShot13() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot9} />
    </div>
  );
}

function Frame17() {
  return (
    <div className="[grid-area:3_/_3] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot13 />
    </div>
  );
}

function DribbbleShot14() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot10} />
    </div>
  );
}

function Frame11() {
  return (
    <div className="[grid-area:3_/_4] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot14 />
    </div>
  );
}

function DribbbleShot15() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot11} />
    </div>
  );
}

function Frame12() {
  return (
    <div className="[grid-area:3_/_5] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot15 />
    </div>
  );
}

function DribbbleShot16() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot12} />
    </div>
  );
}

function Frame13() {
  return (
    <div className="[grid-area:3_/_6] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot16 />
    </div>
  );
}

function DribbbleShot17() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <video autoPlay className="absolute max-w-none object-cover size-full" controlsList="nodownload" loop playsInline>
        <source src="/_videos/v1/5a7aa956336286850d5b3414a6f563339a48e196" />
      </video>
    </div>
  );
}

function Frame2() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot17 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="absolute gap-[24px] grid grid-cols-[repeat(6,_minmax(0px,_1fr))] grid-rows-[fit-content(100%)_fit-content(100%)_minmax(0px,_1fr)] h-[595.5px] left-[16px] top-[90px] w-[1360px]">
      <Frame3 />
      <Frame4 />
      <Frame5 />
      <Frame6 />
      <Frame19 />
      <Frame7 />
      <Frame8 />
      <Frame14 />
      <Frame9 />
      <Frame15 />
      <Frame16 />
      <Frame18 />
      <Frame10 />
      <Frame17 />
      <Frame11 />
      <Frame12 />
      <Frame13 />
      <Frame2 />
    </div>
  );
}

export default function Playground() {
  return (
    <div className="bg-zinc-100 relative size-full" data-name="playground">
      <Frame1 />
      <Button />
      <Frame20 />
    </div>
  );
}