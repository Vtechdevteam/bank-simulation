const Page3 = ({ setPage = async (page: number) => { } }: { setPage: any }) => {
    return (
        <div className="">
            <h2 className="font-semibold text-xl">Simulation mechanics (1)</h2>
            <p>Your task is to manage your financial budget for the next four months.
:
            </p>
            <p className="py-2">
                <span className="font-bold">Rule-1: </span>You will be presented with the total available funds, which you must use ALL of them. You can use this to make contributions to one of three accounts — your credit card balance, your personal loan balance, and into a savings account. You cannot proceed to the next page without completing the budgeting process. 
            </p>
            <p className="py-2">
                <span className="font-bold">Rule-2: </span>You recently moved to a city after graduation to look for a job. In the meantime, you found a part-time job while continuing your search for a stable position.
                This part-time job offers you work temporarily during the company’s busy periods, and you get paid on a bi-weekly basis. Your earnings depend on the total hours you work during this bi-weekly period.

            </p>
            <p className="py-2">
                <span className="font-bold">Rule-3: </span>Your credit card and personal loan payments are due at the beginning of each month. 
See the next page for more details about each account.


            </p>
           
            <div className="flex justify-end">
            <div role="button" className="font-semibold text-blue-600 cursor-pointer px-2" onClick={() => {
                    setPage(2)
                    window.scrollTo(0, 0)

                }} >{`<- Previous`}</div>
                <div role="button" className="font-semibold text-blue-600 cursor-pointer px-2" onClick={() => {
                    setPage(4)
                    window.scrollTo(0, 0)


                }} >{`Next ->`}</div>
                
            </div>
        </div>

    )



}
export default Page3