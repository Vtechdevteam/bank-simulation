import Router from "next/router"

const Page1 = ({ setPage = async (page: number) => { } }: { setPage: any }) => {
    return (
        <div className="">
            <p className="py-2">
            Welcome to “Budget Genius”, an online financial simulation designed to engage your financial management skills. In this simulation, you will be asked to distribute your available funds across various accounts in a dynamic economic environment.
            </p>
            <p className="py-2">
            Please click the “Start” below to begin the simulation.
            </p>
            <div className="flex justify-end">
                <div role="button" className="font-semibold text-blue-600 cursor-pointer" onClick={() => {
                    Router.push("/play/1")
                    window.scrollTo(0, 0)

                }} >{`Start ->`}</div>
            </div>
        </div>

    )



}
export default Page1