import MainNavbarHeader from "../layouts/mainNavbarHeader";
import Post from "../components/Post";
import '../styles/pages/main.css'

function MainPage() {
    return (
        <div className="main">
            <MainNavbarHeader />
            <main>
                <Post _id='wsf' author={{
                    _id: 'fs',
                    avatar: 'fdfdad',
                    name: 'blake',
                }} likes={123} text={"Firstly what this is about:  Arch linux will frustrate newcomers.  If you're looking to escape the Microsoft world, do yourself a favour  and try at least one or two other distros first.  There are a million  posts a day on these forums about what distro/flavor to choose, and  that's great, but there are some good pinned resource all over these  subs.\n" +
                    "\n" +
                    "Secondly ... There's something that bothers me, something that  doesn't add up.  PewDiePie does a bunch of things, on Arch, that many  old timers would have trouble reproducing.  Sure, given time and a bit  of effort, all of those things are possible, but quite a few of the  things he did in the video are NOT beginner things, and certainly not  just 5 minutes of googling.  The thing that doesn't add up is him  calling himself \"not a technical guy\" and then going ahead with a  notoriously hard distro and doing a bunch of things that are arguably  things that takes effort.\n" +
                    "\n" +
                    "Lastly, I do fear that he did the Linux community a disfavor by  basically promoting Arch linux, despite his disclaimers and explanation  that it is a difficult to use distro, to non-technical people.....  Hmmmm, hopefully I'm wrong.\n" +
                    "\n" +
                    " TL:DR - try some other distros before you jump into Arch."} title='Please do NOT try Arch linux just because PewDiePie did' createdAt={new Date(Date.now() - 5 * 60 * 1000)}/>
                <Post _id='fdfdf' author={{
                    _id: 'fs',
                    avatar: 'fdfdad',
                    name: 'blake',
                }} likes={123} text={"Firstly what this is about:  Arch linux will frustrate newcomers.  If you're looking to escape the Microsoft world, do yourself a favour  and try at least one or two other distros first.  There are a million  posts a day on these forums about what distro/flavor to choose, and  that's great, but there are some good pinned resource all over these  subs.\n" +
                    ""} title='Please do NOT try Arch linux just because PewDiePie did' createdAt={new Date(Date.now() - 5 * 60 * 1000)}/>
            </main>
        </div>
    )
}

export default MainPage;
