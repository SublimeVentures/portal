import {forwardRef} from "react";
import moment from 'moment'
import {useEffect, useRef} from "react";
import HTMLFlipBook from "react-pageflip";
import Image from "next/image";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconDownload from "@/assets/svg/Download.svg";
import IconFullscreen from "@/assets/svg/Fullscreen.svg";
import IconZoomIn from "@/assets/svg/ZoomIn.svg";
import IconZoomOut from "@/assets/svg/ZoomOut.svg";
import {Viewer, Worker, SpecialZoomLevel, ProgressBar} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { fullScreenPlugin } from '@react-pdf-viewer/full-screen';
import '@react-pdf-viewer/full-screen/lib/styles/index.css';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import {getFilePlugin} from '@react-pdf-viewer/get-file';


const Page = forwardRef((props, ref) => {
    return (
        <div className="page" ref={ref}>
            <div className="page-content">
                <div className="page-image">{props.children}</div>
            </div>
        </div>
    );
});

export default function OfferDetailsFlipbook({}) {
    const fullScreenPluginInstance = fullScreenPlugin();
    const zoomPluginInstance = zoomPlugin();
    const { ZoomIn, ZoomOut  } = zoomPluginInstance;
    const {  EnterFullScreen } = fullScreenPluginInstance;
    const getFilePluginInstance = getFilePlugin();
    const { Download } = getFilePluginInstance;
    // const pages = [
    //     "https://basedvc.s3.amazonaws.com/rr_test/0001.jpg",
    //     "https://basedvc.s3.amazonaws.com/rr_test/0002.jpg",
    //     "https://basedvc.s3.amazonaws.com/rr_test/0003.jpg",
    //     "https://basedvc.s3.amazonaws.com/rr_test/0004.jpg",
    //     "https://basedvc.s3.amazonaws.com/rr_test/0005.jpg",
    //     "https://basedvc.s3.amazonaws.com/rr_test/0006.jpg",
    //     "https://basedvc.s3.amazonaws.com/rr_test/0007.jpg",
    //     "https://basedvc.s3.amazonaws.com/rr_test/0008.jpg",
    //     "https://basedvc.s3.amazonaws.com/rr_test/0009.jpg",
    // ]

    return (
        <>
            <div className="px-10 py-8 mb-10 rounded-xl bg-navy-accent relative">
                <div className="text-2xl font-bold">About project</div>
                {/*<div className="absolute right-10 top-4">*/}
                {/*    <div className="hidden sm:flex">*/}
                {/*        <RoundButton text={'PDF'} isLoading={false} isDisabled={false} is3d={true} isWide={true}*/}
                {/*                     isPrimary={false} showParticles={true} zoom={1.1} size={'text-sm sm'}*/}
                {/*                     icon={<IconDownload className={ButtonIconSize.hero}/>}/>*/}

                {/*    </div>*/}
                {/*    <div className="flex sm:hidden">*/}
                {/*        <RoundButton text={''} isLoading={false} isDisabled={false} is3d={true} isWide={true}*/}
                {/*                     isPrimary={false} showParticles={true} zoom={1.1} size={'text-sm icon'}*/}
                {/*                     icon={<IconDownload className={ButtonIconSize.small}/>}/>*/}
                {/*    </div>*/}

                {/*</div>*/}
            </div>
            <div className=" fliper -mx-10 sm:mx-0">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <div
                        style={{
                            alignItems: 'center',
                            backgroundColor: '#0e1118',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '10px',
                            gap: '10px',
                            zIndex:90,
                            position:'sticky',
                            top:'0px'
                        }}
                    >
                        <EnterFullScreen>
                            {
                                (props) => (
                                    <RoundButton text={''} handler={props.onClick} is3d={true} isWide={true} zoom={1.05} size={'text-sm icon'} icon={<IconFullscreen className={ButtonIconSize.clicks}/>}/>
                                )
                            }
                        </EnterFullScreen>


                        <ZoomOut>
                            {
                                (props) => (
                                    <RoundButton text={''} handler={props.onClick} is3d={true} isWide={true} zoom={1.05} size={'text-sm icon'} icon={<IconZoomOut className={ButtonIconSize.clicks}/>}/>

                                )
                            }
                        </ZoomOut>

                        <ZoomIn>
                            {
                                (props) => (
                                    <RoundButton text={''} handler={props.onClick} is3d={true} isWide={true} zoom={1.05} size={'text-sm icon'} icon={<IconZoomIn className={ButtonIconSize.clicks}/>}/>

                                )
                            }
                        </ZoomIn>
                        <Download>
                            {
                                (props) => (
                                    <RoundButton text={''} handler={props.onClick} is3d={true} isWide={true} zoom={1.05} size={'text-sm icon'} icon={<IconDownload className={ButtonIconSize.clicks}/>}/>
                                )
                            }
                        </Download>
                    </div>
                    <div
                        style={{
                            height: '90vh'
                        }}

                    >
                        <Viewer
                            fileUrl="https://sublime-vc.s3.us-west-1.amazonaws.com/ResearchReports_Arcade.pdf"
                            defaultScale={SpecialZoomLevel.PageFit}
                            theme={{
                                theme: 'dark',
                            }}
                            plugins={[fullScreenPluginInstance, zoomPluginInstance]}
                        />
                    </div>
                </Worker>
                {/*<HTMLFlipBook*/}
                {/*    width={2481}*/}
                {/*    height={3508}*/}
                {/*    size="stretch"*/}
                {/*    minWidth={315}*/}
                {/*    maxWidth={3508}*/}
                {/*    minHeight={400}*/}
                {/*    maxHeight={3508}*/}
                {/*    maxShadowOpacity={0.5}*/}
                {/*    showCover={true}*/}
                {/*    mobileScrollSupport={true}*/}

                {/*    className="demo-book"*/}

                {/*>*/}

                {/*        {pages.map((el,i) => {*/}
                {/*            return   <Page number={i} key={el}><img src={el}/></Page>*/}



                {/*        })*/}
                {/*        }*/}

                {/*</HTMLFlipBook>*/}


            </div>
        </>


    )
}

//
// <Image
//     src={el}
//     alt={`projectNem_rr_page${1}`}
//     fill
//     sizes="(max-width: 768px) 100vw,
//                                       (max-width: 1200px) 50vw,
//                                       33vw"
// />
