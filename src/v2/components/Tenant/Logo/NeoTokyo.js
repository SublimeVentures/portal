import DynamicIcon from "@/components/Icon";

const NeoTokyoLogo = () => {
    return (
      <>
          <DynamicIcon name={`logo_${process.env.NEXT_PUBLIC_TENANT}`} style="w-17 text-white" />{" "}
          <div className="font-accent text-sm ml-3">{getCopy("NAME")}</div>
      </>
    )
}

export default NeoTokyoLogo;
