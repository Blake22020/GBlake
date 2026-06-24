function CommentSkeleton() {
    return (
        <div className="flex flex-col gap-[10px] bg-white/5 my-[10px] p-[15px] rounded-[20px]">
            <div className="flex items-center gap-[10px]">
                <div className="skeleton w-[26px] h-[26px] rounded-full flex-shrink-0" />
                <div className="skeleton h-[16px] w-[90px] rounded-[8px]" />
                <div className="skeleton h-[12px] w-[55px] rounded-[8px] ml-auto" />
            </div>
            <div className="skeleton h-[14px] w-full rounded-[8px]" />
            <div className="skeleton h-[14px] w-[70%] rounded-[8px]" />
        </div>
    );
}

export default CommentSkeleton;
