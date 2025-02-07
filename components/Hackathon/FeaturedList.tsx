import { DatabaseContext } from "@/contexts/database"
import { useContext } from "react" 
import PreviewCard from "./PreviewCard"

const FeaturedList = () => {

    const { hackathons }: any = useContext(DatabaseContext)

    return (
        <section className="bg-gray-950 text-white py-12 text-center">
            <div className="max-w-4xl mx-auto mb-[40px]">
                <h2 className="text-4xl font-bold text-purple-400">
                    Featured Hackathons
                </h2>
            </div>

            <div className="grid max-w-screen-xl  mx-auto  grid-cols-1 sm:grid-cols-2 gap-6">

                {hackathons.map((item: any, index: number) => { 

                    if (index > 1) {
                        return
                    }

                    return (
                        <PreviewCard
                            item={item}
                            index={index}
                        />
                    )
                })}

            </div>

        </section>
    )
}

export default FeaturedList