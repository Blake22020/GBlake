function PostSkeleton() {
    return (
        <article className="flex flex-col gap-[30px] bg-bg-contactButton mx-auto my-[25px] p-[20px] rounded-[35px] w-[90%] min-[500px]:w-[400px] min-[600px]:w-[350px] min-[750px]:w-[450px] min-[900px]:w-[550px] min-[1050px]:w-[700px]">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-[15px]">
                    <div className="skeleton w-[32px] h-[32px] rounded-full flex-shrink-0" />
                    <div className="skeleton h-[22px] w-[110px] rounded-[8px]" />
                </div>
                <div className="skeleton h-[16px] w-[65px] rounded-[8px]" />
            </div>
            <div className="flex flex-col gap-[12px]">
                <div className="skeleton h-[28px] w-[60%] rounded-[8px]" />
                <div className="skeleton h-[18px] w-full rounded-[8px]" />
                <div className="skeleton h-[18px] w-[88%] rounded-[8px]" />
                <div className="skeleton h-[18px] w-[72%] rounded-[8px]" />
            </div>
            <div className="skeleton h-[36px] w-[90px] rounded-[25px]" />
        </article>
    );
}

export default PostSkeleton;
