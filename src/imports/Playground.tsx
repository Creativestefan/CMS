import svgPaths from "./svg-hg85l86bgo";
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

function DribbbleShot() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <video autoPlay className="absolute max-w-none object-cover size-full" controlsList="nodownload" loop playsInline>
        <source src="/_videos/v1/5a7aa956336286850d5b3414a6f563339a48e196" />
      </video>
    </div>
  );
}

function Frame() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot />
    </div>
  );
}

function DribbbleShot1() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot2} />
    </div>
  );
}

function Frame1() {
  return (
    <div className="[grid-area:1_/_2] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot1 />
    </div>
  );
}

function DribbbleShot2() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot3} />
    </div>
  );
}

function Frame2() {
  return (
    <div className="[grid-area:1_/_3] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot2 />
    </div>
  );
}

function DribbbleShot3() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot4} />
    </div>
  );
}

function Frame3() {
  return (
    <div className="[grid-area:1_/_4] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
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

function Frame4() {
  return (
    <div className="[grid-area:1_/_5] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
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

function Frame5() {
  return (
    <div className="[grid-area:1_/_6] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
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

function Frame6() {
  return (
    <div className="[grid-area:2_/_1] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot6 />
    </div>
  );
}

function DribbbleShot7() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot8} />
    </div>
  );
}

function Frame7() {
  return (
    <div className="[grid-area:2_/_2] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot7 />
    </div>
  );
}

function DribbbleShot8() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot9} />
    </div>
  );
}

function Frame8() {
  return (
    <div className="[grid-area:2_/_3] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot8 />
    </div>
  );
}

function DribbbleShot9() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot10} />
    </div>
  );
}

function Frame9() {
  return (
    <div className="[grid-area:2_/_4] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot9 />
    </div>
  );
}

function DribbbleShot10() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot11} />
    </div>
  );
}

function Frame10() {
  return (
    <div className="[grid-area:2_/_5] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot10 />
    </div>
  );
}

function DribbbleShot11() {
  return (
    <div className="aspect-[436/327] relative shrink-0 w-full" data-name="Dribbble shot - 2">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgDribbbleShot12} />
    </div>
  );
}

function Frame11() {
  return (
    <div className="[grid-area:2_/_6] content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
      <DribbbleShot11 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute gap-[24px] grid grid-cols-[repeat(6,_minmax(0px,_1fr))] grid-rows-[repeat(2,_fit-content(100%))] left-1/2 top-[100px] translate-x-[-50%] w-[1360px]">
      <Frame />
      <Frame1 />
      <Frame2 />
      <Frame3 />
      <Frame4 />
      <Frame5 />
      <Frame6 />
      <Frame7 />
      <Frame8 />
      <Frame9 />
      <Frame10 />
      <Frame11 />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex items-center justify-center px-[2px] py-0 relative shrink-0" data-name="Label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#111115] text-[14px] text-nowrap tracking-[-0.14px] whitespace-pre">S</p>
    </div>
  );
}

function ButtonGroupItems() {
  return (
    <div className="bg-[#9ac4fe] content-stretch flex gap-[4px] items-center justify-center min-h-[28px] px-[8px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Button Group Items">
      <Label />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex items-center justify-center px-[2px] py-0 relative shrink-0" data-name="Label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#111115] text-[14px] text-nowrap tracking-[-0.14px] whitespace-pre">M</p>
    </div>
  );
}

function ButtonGroupItems1() {
  return (
    <div className="bg-[rgba(39,39,42,0)] content-stretch flex gap-[4px] items-center justify-center min-h-[28px] px-[8px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Button Group Items">
      <Label1 />
      <div className="absolute bottom-0 left-0 top-0 w-0" data-name="Separator">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="Separator"></g>
        </svg>
      </div>
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex items-center justify-center px-[2px] py-0 relative shrink-0" data-name="Label">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#111115] text-[14px] text-nowrap tracking-[-0.14px] whitespace-pre">L</p>
    </div>
  );
}

function ButtonGroupItems2() {
  return (
    <div className="bg-[rgba(39,39,42,0)] content-stretch flex gap-[4px] items-center justify-center min-h-[28px] px-[8px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Button Group Items">
      <Label2 />
      <div className="absolute bottom-0 left-0 top-0 w-0" data-name="Separator">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="Separator"></g>
        </svg>
      </div>
    </div>
  );
}

function ButtonGroup() {
  return (
    <div className="absolute bg-zinc-100 left-[calc(50%-0.5px)] rounded-[9999px] top-[808px] translate-x-[-50%]" data-name="Button Group">
      <div className="content-stretch flex items-center overflow-clip p-[2px] relative rounded-[inherit]">
        <ButtonGroupItems />
        <ButtonGroupItems1 />
        <ButtonGroupItems2 />
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[0px_-1px_0px_0px_inset_rgba(0,0,0,0.1)]" />
      <div aria-hidden="true" className="absolute border border-[rgba(39,39,42,0.1)] border-solid inset-0 pointer-events-none rounded-[9999px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

export default function Playground() {
  return (
    <div className="bg-zinc-100 relative size-full" data-name="Playground">
      <div className="absolute flex flex-col font-['Season_Mix-TRIAL:Medium',sans-serif] justify-center leading-[0] left-[40px] not-italic text-[#111115] text-[16px] text-nowrap top-[33px] tracking-[-0.16px] translate-y-[-50%]">
        <p className="leading-[1.1] whitespace-pre">Stephen Jude</p>
      </div>
      <Button />
      <Frame12 />
      <ButtonGroup />
    </div>
  );
}