import HeroBg from "@/components/Home/HeroBg";


export default function InvestmentsPublic() {
    const investments = [];
    const renderList = () => {
        return (
            <ul className="masonry-list flex flex-wrap justify-center mx-auto sinvest:ml-0 sinvest:mr-0 ">
                {investments.map(el => {
                    return (<li className="tile-case" id={el.name}>
                        <a href="#">
                            <div className="tile-primary-content bgFit"
                                 style={{backgroundImage: 'url(' + el.d_image + ')'}}></div>
                            <div className="tile-secondary-content">
                                <h2>{el.d_type}</h2>
                                <p>{el.b_name}</p>
                            </div>
                        </a>
                    </li>)
                })
                }
            </ul>)
    }

    return (
        <>
            <HeroBg subtitle={'who we support'} title={'previous deals'}/>
        </>
    )
}
