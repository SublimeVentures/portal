import {RoundButton} from "@/components/Button/RoundButton";
import {CitCapGlitchButton} from "@/components/Button/CitCapGlitchButton";
import {is3VC} from "@/lib/seoConfig";


export const ButtonTypes = {
    BASE: 0,
    CITCAP: 1,
    CITCAP_FULL: 2,
}



export function UniButton({
                              isLarge,
                              state,
                                type,
                              showParticles,
                               isWide, isWider,
                              is3d, isPrimary, size, zoom,  noBorder,
                              text, isWhite, isLoading, isDisabled, isLoadingWithIcon, icon, handler,
                                isActive
}) {

    const parse = () => {
            switch(type) {
                case ButtonTypes.BASE: {
                    if(is3VC) {
                        return <RoundButton text={text} is3d={is3d} isPrimary={isPrimary} icon={icon} handler={handler} isWider={isWider} zoom={zoom} size={size} isWide={isWide} isLoading={isLoading} isLoadingWithIcon={isLoadingWithIcon} isDisabled={isDisabled} showParticles={showParticles}/>
                    } else {
                        return <CitCapGlitchButton text={`_${text}`} isLarge={isLarge} isDisabled={isDisabled} isLoading={isLoading} state={state} handler={handler} isActive={isActive}/>
                    }
                }
            }
        }


    return parse()


}
