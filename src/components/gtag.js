import Script from 'next/script'

function Gtag() {
    return (
        <>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-YLE2QWDVSQ"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-YLE2QWDVSQ');
        `}
            </Script>
        </>
    )
}

export default Gtag
