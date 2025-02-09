
import { useEffect, useState } from "react"
import BaseModal from "./base"
import ReactMarkdown from 'react-markdown'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

const TeamInfoModal = ({ visible, close, currentTeam }: any) => {

    const [reviews, setReviews] = useState<any>(undefined)

    useEffect(() => {
        if (currentTeam) {
            (async () => {

                const { data } = await currentTeam.comments()

                data && data[0] && setReviews(data[0].feedback)
            })()
        }
    }, [currentTeam])

    return (
        <BaseModal
            visible={visible}
            close={close}
            title={currentTeam ? currentTeam.name : ""}
        >
            {currentTeam && (
                <>
                    <TabGroup>
                        <TabList className="flex mt-3 gap-4">
                            {["Description", `Reviews (${ reviews ? 1: 0})`].map((name) => (
                                <Tab
                                    key={name}
                                    className="rounded-full cursor-pointer py-2 px-6 text-base  text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                                >
                                    {name}
                                </Tab>
                            ))}
                        </TabList>
                        <TabPanels className="mt-3">

                            <TabPanel className="rounded-xl bg-white/5 p-3 ">
                                {/* <p className="text-gray-400  my-1">{currentTeam.description}</p> */}
                                <div className="text-gray-400 max-h-[200px] my-1 overflow-y-auto">
                                    <ReactMarkdown>
                                        {currentTeam.description}
                                    </ReactMarkdown>

                                </div>
                            </TabPanel>
                            <TabPanel className="rounded-xl bg-white/5 p-3 min-h-[100px]">
                                {/* <p className="text-gray-400  my-1">{reviews}</p> */}
                                {reviews && (
                                    <div className="text-gray-400  my-1">
                                        <ReactMarkdown>{reviews}
                                        </ReactMarkdown>
                                    </div>
                                )

                                }
                                {!reviews && (
                                    <div className="text-gray-400 mt-[25px] text-center my-1">
                                       No reviews
                                    </div>
                                )

                                }
                            </TabPanel>

                        </TabPanels>
                    </TabGroup>



                    <div className="mt-3 flex flex-row">

                        <button onClick={() => {
                            close()
                        }} type="button" className="btn mx-auto ml-1 rounded-lg  py-2.5 px-8  cursor-pointer   bg-purple-600 hover:bg-purple-500 text-white flex flex-row">
                            Close
                        </button>
                    </div>

                </>
            )}
        </BaseModal>

    )
}

export default TeamInfoModal
