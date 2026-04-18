import PostSkeleton from "./PostSkeleton";

function UserProfileSkeleton() {
    return (
        <>
            <div className="flex flex-col gap-[40px] md:gap-[100px] px-4 sm:px-8 lg:px-[150px] py-[50px] md:py-[100px] w-full">
                <div className="flex flex-col gap-[50px] md:gap-[100px] items-center">
                    <div className="flex justify-between w-[90%] sm:w-[500px] md:w-[600px] lg:w-[700px] xl:w-[850px] items-center">
                        <div className="flex items-center gap-2 sm:gap-[25px]">
                            <div className="skeleton rounded-full h-[3rem] xs:h-[4rem] sm:h-[5rem] lg:h-[6rem] xl:h-[7rem] w-[3rem] xs:w-[4rem] sm:w-[5rem] lg:w-[6rem] xl:w-[7rem] flex-shrink-0" />
                            <div className="skeleton h-[32px] sm:h-[48px] lg:h-[60px] w-[140px] sm:w-[200px] lg:w-[280px] rounded-[12px]" />
                        </div>
                        <div className="skeleton h-[42px] sm:h-[52px] w-[130px] sm:w-[160px] rounded-[35px]" />
                    </div>
                    <div className="flex flex-col gap-[10px] w-[90%] sm:w-[500px] md:w-[600px] lg:w-[700px]">
                        <div className="skeleton h-[20px] w-full rounded-[8px]" />
                        <div className="skeleton h-[20px] w-[75%] mx-auto rounded-[8px]" />
                    </div>
                </div>
                <div className="flex gap-[20px] sm:gap-[50px] md:gap-[100px] justify-center">
                    <div className="skeleton h-[76px] sm:h-[96px] w-[110px] sm:w-[150px] rounded-[50px]" />
                    <div className="skeleton h-[76px] sm:h-[96px] w-[110px] sm:w-[150px] rounded-[50px]" />
                </div>
            </div>
            <div>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
            </div>
        </>
    );
}

export default UserProfileSkeleton;
