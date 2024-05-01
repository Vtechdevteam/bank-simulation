import CacheService from "@/services/CacheService";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";


const Page4 = ({ setPage = async (page: number) => { } }: { setPage: any }) => {

    const [isDataLoading, setIsDataLoading] = useState<boolean>(false)

    useEffect(() => {
        init()
    }, [])

    const init = async () => {
        setIsDataLoading(true)
        await CacheService.fetch()
        setIsDataLoading(false)
    }

    const columns = [
        {
            key: "name",
            label: "",
        },
        {
            key: "card",
            label: "Credit Card",
        },
        {
            key: "loan",
            label: "Personal Loan",
        },
    ];

    return (
        <div className="">
            <h2 className="font-semibold text-xl">Simulation game mechanics (2)</h2>
            <ul className="my-4 list-disc list-inside">
                <li className="my-2">
                    <h4 className="font-semibold underline">1. Credit card balance:</h4>
                    <ol className="list-decimal list-inside">
                        <li className="my-1">a. Purchases made are due to be repaid at the beginning of the following month.</li>
                        <li className="my-1">b. If the entire balance is not paid off by the due date, interest will be applied on the remaining amount in the subsequent month.
                        </li>

                        <li className="my-1">c. There is a required minimum payment — if you pay less than the minimum amount due on your credit card, it is regarded as a failure to make a payment, resulting in a late fee and higher penalty APR. </li>

                    </ol>


                </li>
                <li className="my-2">
                    <h4 className="font-semibold underline">2. Personal loan balance:</h4>
                    <ol className="list-decimal list-inside">
                        <li className="my-1">a. You have taken out a personal loan, where a total amount of money was borrowed. You are repaying it through fixed monthly payments. </li>
                        <li className="my-1">b. If the fixed monthly amount is not paid off by the beginning of the following month, interest will be applied to the remaining amount in the subsequent month.
                        </li>

                        <li className="my-1">c. There is a required minimum payment — if you pay less than the minimum amount due on your personal loan, it is regarded as a failure to make a payment, resulting in a late fee and higher penalty APR. And this will also extend the duration required to entirely pay off the total balance.
                        </li>

                    </ol>


                </li>
                <li className="my-2">
                    <p>
                        <span className="font-semibold underline">3. Saving account: </span>
                        You have a saving account where you deposit a portion of your funds, if you wish to, in preparation for unexpected and unforeseen circumstances.

                    </p>

                    <ol className="list-decimal list-inside">
                        <li className="my-1">a. You can always use the money in the saving account to pay back your debt on your credit card and personal loan.
                        </li>
                    </ol>
                    <p className="my-2">
                        Refer to the following table to understand how late fees and interest (calculated based on the Annual Percentage Rate, APR) will be applied on your credit card and personal loan.
                    </p>


                </li>
            </ul>

            {
                isDataLoading ? (
                    <Spinner />
                ) : (
                    <Table aria-label="Example table with dynamic content">
                        <TableHeader columns={columns}>
                            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                        </TableHeader>
                        <TableBody>
                            <TableRow key={"1"}>
                                <TableCell>{"Late fee"}</TableCell>
                                <TableCell>{CacheService.masterData?.creditCardLateFee}</TableCell>
                                <TableCell>{CacheService.masterData?.loanLateFee}</TableCell>
                            </TableRow>
                            <TableRow key={"2"}>
                                <TableCell>{"APR"}</TableCell>
                                <TableCell>{CacheService.masterData?.creditCardAPR}%</TableCell>
                                <TableCell>{CacheService.masterData?.loanAPR}%</TableCell>
                            </TableRow>
                            <TableRow key={"3"}>
                                <TableCell>{"Penalty APR"}</TableCell>
                                <TableCell>{CacheService.masterData?.creditCardPenaltyAPR}%</TableCell>
                                <TableCell>{CacheService.masterData?.loanPenaltyAPR}%</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                )
            }



            <div className="flex justify-end mt-4">
                <div role="button" className="font-semibold text-blue-600 cursor-pointer px-2" onClick={() => {
                    setPage(3)
                    window.scrollTo(0, 0)

                }} >{`<- Previous`}</div>
                <div role="button" className="font-semibold text-blue-600 cursor-pointer px-2" onClick={() => {
                    setPage(5)
                    window.scrollTo(0, 0)


                }} >{`Next ->`}</div>

            </div>
        </div>

    )



}
export default Page4