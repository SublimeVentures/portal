import React, { createContext, useState, useMemo, useCallback } from "react";
import ErrorModal from "@/components/SignupFlow/ErrorModal";

export const ErrorModalContext = createContext("ErrorModalContext");

export default function ErrorProvider({ children }) {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const value = useMemo(() => ({ setShow, setMessage }), [setShow, setMessage]);

    const closeModal = useCallback(() => setShow(false), []);

    return (
        <ErrorModalContext.Provider value={value}>
            {children}
            <ErrorModal isOpen={show} closeModal={closeModal} errorMessage={message} />
        </ErrorModalContext.Provider>
    );
}
