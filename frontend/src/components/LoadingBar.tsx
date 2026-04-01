import React from "react";
import { useLoading } from "../context/LoadingContext";

const LoadingBar = () => {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div className="fixed bottom-0 right-0 w-full z-[9999] h-[3px] overflow-hidden bg-transparent">
            <div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 animate-loading-bar shadow-[0_0_10px_#8b5cf6]" />
        </div>
    );
};

export default LoadingBar;
