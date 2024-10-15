import dynamic from "next/dynamic";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { cn } from "@/lib/cn";
import useResearchAssets from "@/v2/hooks/useResearchAssets";

const Flipbook = dynamic(() => import("@/v2/components/Flipbook/Flipbook"), {
    ssr: false,
});

export default function Report({ className }) {
    const router = useRouter();
    const { slug } = router.query;
    const { getResearchReportMeta, getResearchReportPages } = useResearchAssets();
    const getResearchReportPage = useMemo(() => getResearchReportPages(slug), [slug, getResearchReportPages]);
    const [amount, setAmount] = useState(0);

    const parsePages = useMemo(() => {
        let pages = [];
        for (let i = 1; i < amount; i++) {
            const paddedNumber = String(i).padStart(4, "0");
            pages.push(getResearchReportPage(paddedNumber));
        }
        return pages;
    }, [amount, slug]);

    const fetchMeta = async () => {
        const response = await fetch(getResearchReportMeta(slug));
        const data = await response.json();
        if (data) {
            setAmount(Number(data.pages));
        }
    };

    useEffect(() => {
        setAmount(0);
        fetchMeta();
    }, [slug]);
    return (
        <div className={cn("rounded bg-alt border-alt", className)}>
            {parsePages.length > 0 && amount > 0 && <Flipbook pages={parsePages} startPage={1} zooms={[1, 1.5, 2]} />}
        </div>
    );
}
