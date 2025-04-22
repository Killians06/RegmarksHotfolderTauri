"use client";

import { useEffect, useRef } from "react";

interface LogBoxProps {
    logs: string[];
}

export default function LogBox({ logs }: LogBoxProps) {
    const logBoxRef = useRef<HTMLDivElement>(null);

    // Faire défiler automatiquement la logbox vers le bas lorsque les logs changent
    useEffect(() => {
        if (logBoxRef.current) {
            logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div
            ref={logBoxRef}
            className="absolute bottom-0 left-0 w-full h-1/2 mx-auto bg-gray-100 border-t border-gray-300 overflow-y-auto p-4 rounded-lg shadow-lg"
        >
            <h2 className="text-lg font-bold mb-2 text-black">Logs</h2>
            <div className="space-y-2">
                {logs.map((log, index) => (
                    <p key={index} className="text-sm text-gray-700 whitespace-pre-wrap">
                        {log}
                    </p>
                ))}
            </div>
        </div>
    );
}