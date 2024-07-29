import DynamicIcon from "@/components/Icon";

const BasedVCLogo = () => {
    return (
        <>
            <DynamicIcon name="logo_1" style="size-17 text-white" />
            <div className="flex flex-col">
                <h1 className="text-8xl font-semibold text-foreground">based.vc</h1>
                <p className="text-md font-light text-foreground">VC for all</p>
            </div>
        </>
    );
};

export default BasedVCLogo;
