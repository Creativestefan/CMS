import svgPaths from "./svg-1gdwp4on4h";

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

export default function Button() {
  return (
    <div className="bg-[rgba(39,39,42,0.06)] content-stretch flex items-center justify-center overflow-clip relative rounded-[9999px] size-full" data-name="Button">
      <LeadIcon />
    </div>
  );
}