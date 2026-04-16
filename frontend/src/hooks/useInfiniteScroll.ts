import { useRef, useCallback } from "react";

interface UseInfiniteScrollProps {
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
}

export const useInfiniteScroll = ({
    isLoading,
    hasMore,
    onLoadMore,
}: UseInfiniteScrollProps) => {
    const observer = useRef<IntersectionObserver | null>(null);

    const lastElementRef = useCallback(
        (node: HTMLElement | null) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMore) {
                        onLoadMore();
                    }
                },
                {
                    rootMargin: "150px",
                },
            );

            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore, onLoadMore],
    );

    return lastElementRef;
};
