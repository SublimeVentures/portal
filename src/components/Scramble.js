import { useState, useEffect } from "react";

const ALPHABET = [
    " ",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
];
const delay = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
};

export default function Scramble({ text, isUnderline, trigger }) {
    const [display, setDisplay] = useState("");

    const build = async () => {
        let animated = text.split("");
        for (let i = 0; i < animated.length; i++) {
            for (let j = 0; j < ALPHABET.length; j++) {
                animated[i] = ALPHABET[j];

                let k = i + 1;
                for (k; k < animated.length; k++) {
                    animated[k] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
                }

                setDisplay(animated.join(""));
                if (text[i] === ALPHABET[j]) {
                    break;
                } else {
                    await delay(1);
                }
            }
        }
    };

    useEffect(() => {
        if (trigger) {
            build();
        }
    }, [trigger]);

    useEffect(() => {
        setDisplay(text);
    }, []);

    return <span className={isUnderline ? "underlineHover" : ""}>{display}</span>;
}
