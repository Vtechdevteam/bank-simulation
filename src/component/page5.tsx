
const Page5 = ({ setPage = async (page: number) => { } }: { setPage: any }) => {
    return (
        <div className="">
            <h2 className="font-semibold text-xl mb-2">Summary</h2>
            <div>
                <h2 className="py-2 font-semibold text-lg">1. Income Flow</h2>
                <div className="flex justify-center">
                    <img alt="income flow" src='/summary-images/income-flow.png' />
                </div>
            </div>
            <div>
                <h2 className="py-2 font-semibold text-lg">2. Due dates</h2>
                <div className="flex justify-center">
                    <img alt="income flow" src='/summary-images/due-dates.png' />
                </div>
            </div>
            <div>
                <h2 className="py-2 font-semibold text-lg">3. Allocation timing</h2>
                <div className="flex justify-center">
                    <img alt="income flow" src='/summary-images/allocation-timing.png' />
                </div>
            </div>
            <div>
                <h2 className="py-2 font-semibold text-lg">4.Timing of charging interest and fees</h2>
                <div className="flex justify-center">
                    <img alt="income flow" src='/summary-images/timing-of-charging-interest.png' />
                </div>
            </div>
            <div>
                <h2 className="py-2 font-semibold text-lg">5. New purchases</h2>
                <div className="flex justify-center">
                    <img alt="income flow" src='/summary-images/new-purchases.png' />
                </div>
            </div>
            <p className="font-bold text-center">Remember your task is to distribute your funds wisely among these accounts to achieve optimal financial outcomes (i.e., minimize the total debt).
            </p>
            <div className="flex justify-end mt-4">
                <div role="button" className="font-semibold text-blue-600 cursor-pointer px-2" onClick={() => {
                    setPage(4)
                    window.scrollTo(0, 0)

                }} >{`<- Previous`}</div>
                <div role="button" className="font-semibold text-blue-600 cursor-pointer px-2" onClick={() => {
                    setPage(1)
                    window.scrollTo(0, 0)


                }} >{`Next ->`}</div>

            </div>
        </div>

    )



}
export default Page5