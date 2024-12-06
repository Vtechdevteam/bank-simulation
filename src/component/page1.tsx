import Router from "next/router"

const Page1 = ({ setPage = async (page: number) => { } }: { setPage: any }) => {
    return (
        <div className="">
            <p className="py-2">
                Welcome to “Budget Genius”, an online economic simulation that challenges your financial skills.
                In this simulation, you will be asked to strategically distribute your available funds across various accounts in a dynamic economic environment.

            </p>
            <p className="py-2">
                Your objective in this simulation is to minimize your total debt as you would in real life.
                The top 10% of players achieving the lowest debt levels will be awarded an additional 1 credit as a reward.
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