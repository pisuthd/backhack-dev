import HackathonDetails from "@/components/Hackathon/Details"

const EachHackathonPage = ({ params }: any) => {

    const slug = decodeURIComponent(params.slug)

    return (
        <HackathonDetails slug={slug} />
    )
}

export default EachHackathonPage