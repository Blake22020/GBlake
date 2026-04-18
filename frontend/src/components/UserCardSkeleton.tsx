function UserCardSkeleton() {
    return (
        <div className="flex justify-between items-center gap-[10px] min-[450px]:gap-[30px] bg-white/5 mx-auto p-[20px] rounded-[65px] w-[90%] xs:w-[80%] min-[700px]:w-[400px] nav:w-[500px] lg:w-[550px] xl:w-[700px]">
            <div className="skeleton rounded-full w-[36px] h-[36px] min-[700px]:w-[48px] min-[700px]:h-[48px] nav:w-[72px] nav:h-[72px] lg:w-[96px] lg:h-[96px] flex-shrink-0" />
            <div className="skeleton h-[20px] flex-1 max-w-[180px] rounded-[8px]" />
            <div className="skeleton h-[36px] w-[110px] lg:h-[46px] lg:w-[140px] rounded-[35px] flex-shrink-0" />
        </div>
    );
}

export default UserCardSkeleton;
