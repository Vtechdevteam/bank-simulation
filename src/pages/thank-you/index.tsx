import StorageService from "@/services/StorageService"
import { Button } from "@nextui-org/react"
import Router, { useRouter } from "next/router"

const ThankYou = () => {

    const router = useRouter();

    return (
        <div className="max-w-5xl mx-auto justify-center pt-10">
            <label className="text-2xl block text-center" htmlFor="">Thank you for your efforts over the three periods.</label>
            <label className="block text-center text-lg mt-4" htmlFor="">Your completion code is <label className="text-5xl font-semibold" htmlFor="">{router?.query?.cc}</label></label>
            <div className="text-center mt-10">
                <Button onClick={() => {
                    StorageService.logout()
                    window.location.reload()
                }} className="" color="danger">Exit</Button>
            </div>
        </div>
    )
}

export default ThankYou