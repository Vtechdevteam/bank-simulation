const Page2 = ({ setPage = async (page: number) => { } }: { setPage: any }) => {
    return (
        <div className="">
            <h2 className="font-semibold text-xl">Scenario</h2>
            <p>Please imagine yourself in the following scenario:
            </p>
            <p className="py-2">
                You recently moved to a city after graduation to look for a job. In the meantime, you found a part-time job while continuing your search for a stable position.
                This part-time job offers you work temporarily during the company’s busy periods, and you get paid on a bi-weekly basis. Your earnings depend on the total hours you work during this bi-weekly period.

            </p>
            <p className="py-2">
                You obtained a personal loan to facilitate your relocation, borrowing a specific sum of money.
                This loan is being repaid in fixed monthly payments.
            </p>
            <p className="py-2">
                Typically, you are making most of your purchases through a credit card such as rent, utilities, auto insurance, and groceries. Your recent credit card usage has been particularly high due to your relocation.


            </p>
            <p className="py-2">
                Your main goal now is to work on reducing your total debt. Now, decide how much money to allocate to each account carefully. Your decision in one period will have direct consequences in the next period and your overall performance. You will be provided real-time feedback on the impact of your budgeting decisions. The top 10% of players achieving the lowest debt levels will be awarded an additional 1 credit as a reward.
            </p>
            <div className="flex justify-end">
            <div role="button" className="font-semibold text-blue-600 cursor-pointer px-2" onClick={() => {
                    setPage(1)
                    window.scrollTo(0, 0)

                }} >{`<- Previous`}</div>
                <div role="button" className="font-semibold text-blue-600 cursor-pointer px-2" onClick={() => {
                    setPage(3)
                    window.scrollTo(0, 0)


                }} >{`Next ->`}</div>
                
            </div>
        </div>

    )



}
export default Page2