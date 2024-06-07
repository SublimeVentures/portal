import React, { createContext, useState, useMemo, useCallback } from "react";
import ErrorModal from "@/components/SignupFlow/ErrorModal";

export const ErrorModalContext = createContext("ErrorModalContext");

export default function ErrorProvider({ children }) {
    const [errorModal, setErrorModal] = useState("");
    const value = useMemo(() => ({ setErrorModal }), [setErrorModal]);

    const isOpen = errorModal !== "";
    const closeModal = useCallback(() => setErrorModal(""), []);

    return (
        <ErrorModalContext.Provider value={value}>
            {children}
            <ErrorModal isOpen={isOpen} closeModal={closeModal} error={errorModal} />
        </ErrorModalContext.Provider>
    );
}
