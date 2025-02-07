import { DatabaseContext } from "@/contexts/database"
import BaseModal from "./base"
import { useCallback, useContext, useReducer } from "react"


const AddNewTeamModal = ({ visible, close, hackathon }: any) => {

    const { addTeam }: any = useContext(DatabaseContext)

    const [values, dispatch] = useReducer(
        (curVal: any, newVal: any) => ({ ...curVal, ...newVal }),
        {
            name: undefined,
            description: undefined
        }
    )

    const { name, description } = values

    const onAdd = useCallback(async () => {

        if (!name && name.length > 5) {
            alert("Invalid name")
            return
        }
        if (!description && description.length > 5) {
            alert("Invalid description")
            return
        }

        try {

            const { data } = await hackathon.teams() 

            const maxTeamId = data.reduce((result:number, item:any) => {
                if ( item.onchainId > result ) {
                    result = item.onchainId
                }   
                return result
            }, 0)

            const teamId = maxTeamId+1 
            const hackathonId = hackathon.id
            
            await addTeam( {
                hackathonId,
                teamId,
                name,
                description
            })

        } catch (e) {
            console.log(e)
        }

        dispatch({
            name: undefined,
            description: undefined
        })
        close()

    }, [name, description, hackathon])

    return (
        <BaseModal
            visible={visible}
            close={close}
            title="Add New Team"
            maxWidth="max-w-xl"
        >

            <div className="py-2 pt-4">
                <h2 className="mb-2">Name:</h2>
                <input type="text" value={name} onChange={(e) => dispatch({ name: e.target.value })} id="title" placeholder="Ex. Slatan BTC" className={`block w-full p-2  rounded-lg text-base bg-[#141F32] border border-neutral-600 placeholder-gray text-white focus:outline-none`} />
                <h2 className="my-2">Description:</h2>
                <textarea rows={3} value={description} onChange={(e) => dispatch({ description: e.target.value })} id="description" placeholder="Provide a short description for further review by the AI agent" className={`block w-full p-2  rounded-lg text-base bg-[#141F32] border border-neutral-600 placeholder-gray text-white focus:outline-none`} />
                <p className="text-gray mt-2 px-0.5 text-base">In the hackathon version, anyone can freely add a team and its details. However, we may remove entries that appear suspicious.</p>
            </div>

            <div className="mt-2 flex   flex-row">
                <button onClick={onAdd} type="button" className="btn ml-auto mr-1 rounded-lg  py-2.5 px-8  cursor-pointer   bg-purple-600 hover:bg-purple-500 text-white flex flex-row">
                    Save
                </button>
                <button onClick={() => {
                    dispatch({
                        name: undefined,
                        description: undefined
                    })
                    close()
                }} type="button" className="btn mr-auto ml-1 rounded-lg  py-2.5 px-8  cursor-pointer   bg-purple-600 hover:bg-purple-500 text-white flex flex-row">
                    Cancel
                </button>
            </div>

        </BaseModal>
    )
}

export default AddNewTeamModal