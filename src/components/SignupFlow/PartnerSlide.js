export default function PartnerSlide({logo, name}) {

  return (
      <div className="flex flex-col items-center bg-slides h-full border border-navy">
        <div className="partnerLogo mt-2" style={{ backgroundImage: 'url(' + logo + ')' }}></div>
        <div className="mt-1 text-white px-2 py-1 text-sm ">{ name }</div>
      </div>
  )
}

