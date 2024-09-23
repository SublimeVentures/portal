import { useState } from "react";

export default function useReassign(session) {
    const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
    return {
        getReassignModalProps: () => ({
            isReassignModalOpen,
            onOpenChange: setIsReassignModalOpen,
        }),
    };
}
