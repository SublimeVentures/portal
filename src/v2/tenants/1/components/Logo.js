import Logo from "@tenant/assets/svg/logo.svg";

const BasedVCLogo = () => {
    return (
        <>
            <Logo className="size-17 text-white" />
            <div className="flex flex-col">
                <h1 className="text-lg md:text-2xl text-white">based.vc</h1>
                <p className="text-base font-light text-white">VC for all</p>
            </div>
        </>
    );
};

export default BasedVCLogo;
