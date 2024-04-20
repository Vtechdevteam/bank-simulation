import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Spinner, Button, Divider, Input } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Router from "next/router";

import { useEffect, useState } from "react";
import { GlobalDataService } from "@/services/globalDataService";

export interface Settings {
    numberOfMonths: number
    creditCardMinDuePercentage: number
    creditCardLateFee: number
    creditCardAPR: number
    creditCardPenaltyAPR: number
    loanLateFee: number
    loanAPR: number
    loanPenaltyAPR: number
    financeData: FinanceDaum[]
}

export interface FinanceDaum {
    sequenceNumber: number
    initialPayout: number
    secondPayout: number
    creditCardDue: number
    loanDue: number
    expenses?: number
}

interface AllocationData {
    initialPayout: number | null;
    savings: number | null;
    totalAvailableFunds: number | null;
    creditCardMinDue: number | null;
    creditCardDue: number | null;
    loanDue: number | null;
    totalDebtBalance: number | null;
    creditCardAllocation: number | null;
    loanAllocation: number | null;
    creditCardRemainingBalance: number | null;
    loanRemainingBalance: number | null;
    totalAmountOwed: number | null;
    totalAllocation: number | null;
    totalRemainingBalance: number | null;
    totalSavings: number | null;
}

const End = () => {
    const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
    const [data, setData] = useState<Settings>()
    const [error, setError] = useState<string>('')
    const [initialValues, setInitialValues] = useState({
        newPurchases:1600,
        monthlyPersonalLoan:700,
        savings: 0,
        creditCardDueBeg: 0,
        loanDueBeg: 0,
        creditCardDueMid: 0,
        loanDueMid: 0,
        creditCardFees:0,
        loanFees:0
    })

    useEffect(() => {
        init()
    }, [])
    const init = async () => {
        const windowUrl = window.location.search;
        const params = new URLSearchParams(windowUrl);
        await getSettingsData(
            params.get('savings'),
             params.get('creditCardDueBeg'), 
             params.get('loanDueBeg'),
             params.get('creditCardDueMid'), 
             params.get('loanDueMid')
            )
    }
    const getSettingsData = async (savings: any, creditCardDueBeg: any, loanDueBeg: any,creditCardDueMid: any, loanDueMid: any) => {
        setIsPageLoading(true)
        try {
            //const res: any = await GlobalDataService?.getGlobalDataData()
            //const masterData:Settings=res?.data
            // setData(masterData)
            const masterData: Settings = {
                "numberOfMonths": 3,
                "creditCardMinDuePercentage": 10,
                "creditCardLateFee": 20,
                "creditCardAPR": 22,
                "creditCardPenaltyAPR": 27,
                "loanLateFee": 29,
                "loanAPR": 26,
                "loanPenaltyAPR": 31,
                "financeData": [
                    {
                        "sequenceNumber": 1,
                        "initialPayout": 1500,
                        "secondPayout": 1000,
                        "creditCardDue": 600,
                        "loanDue": 600,
                        "expenses": 0
                    },
                    {
                        "sequenceNumber": 2,
                        "initialPayout": 1500,
                        "secondPayout": 1000,
                        "creditCardDue": 600,
                        "loanDue": 600,
                        "expenses": 1000
                    },
                    {
                        "sequenceNumber": 3,
                        "initialPayout": 1500,
                        "secondPayout": 1000,
                        "creditCardDue": 600,
                        "loanDue": 600,
                        "expenses": 1000
                    }
                ]
            }
            setData(masterData)
            const month1: FinanceDaum = masterData?.financeData?.filter(e => e.sequenceNumber === 1)[0]
            const initValue = { ...initialValues }
            initValue['savings'] = +savings
            initValue['creditCardDueBeg'] = +creditCardDueBeg
            initValue['loanDueBeg'] = +loanDueBeg
            initValue['creditCardDueMid'] = +creditCardDueMid
            initValue['loanDueMid'] = +loanDueMid
            setInitialValues(initValue)
        }
        catch (e) {
            console.log(e)
        }
        setIsPageLoading(false)
    }

    const getInterestFromCreditCardBalance = ()=>{
        return 10.78
    }
    const getInterestFromLoanBalance = ()=>{
        return 12.78
    }
    const getTotalDebtBalance = ()=>{
        return 10.78+12.78
    }
    const getTotalCreditCardBalance=()=>{
        return 2045.80

    }
    const getTotalLoanBalance=()=>{
        return 1098.98
    }



    const submit = (values: any) => {
        const savings = initialValues?.savings
        const creditCardDue = getTotalCreditCardBalance()
        const loanDue = getTotalLoanBalance()
        Router?.push({
            pathname:'/month2',
            query:{
                savings:savings,
                creditCardDue:creditCardDue,
                loanDue:loanDue
            }
        })
    }
   
    return (
        <>
            <Navbar>
                <NavbarBrand className="cursor-pointer">
                    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
                        <path
                            clipRule="evenodd"
                            d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                            fill="currentColor"
                            fillRule="evenodd"
                        />
                    </svg>
                    <p className="font-bold text-inherit">Simalation Game</p>
                </NavbarBrand>
            </Navbar>
            <div className="w-full h-screen bg-white">

                <div className="mx-9 text-black">
                    {isPageLoading ? (
                        <div className="flex justify-center pt-8">
                            <Spinner label="Loading..." color="primary" />
                        </div>
                    ) : (
                        <>
                            <div className="py-4">
                                <h2 className="font-semibold">End of Month-1</h2>
                                <p className="">You made purchases worth $1,600 last month. You also have dues on your personal loan.
                                    Here is an overview of your current financial situation ($):

                                </p>
                            </div>
                           
                            <div className="border">
                            </div>
                            <form>
                                <div className="w-4/5 mx-auto my-4 pb-10">
                                    <div className="grid grid-cols-3 mt-3">
                                        <label className="col-span-1 font-semibold border-2 border-t-3 py-1 px-3 ">New purchases with credit card</label>
                                        <label className="col-span-2 text-start border-2 border-t-3 py-1 px-3">{initialValues?.newPurchases}</label>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Previous credit card balance</label>
                                        <label className="col-span-2 text-start border-2 py-1 px-3">{initialValues?.creditCardDueMid}</label>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Interest from credit card balance</label>
                                        <label className="col-span-2 text-start border-2 py-1 px-3">{getInterestFromCreditCardBalance()}</label>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Fees</label>
                                        <label className="col-span-2 text-start border-2 py-1 px-3">{initialValues?.creditCardFees}</label>
                                    </div>
                                    <div className="grid grid-cols-3 font-bold">
                                        <label className="col-span-1 border-2 py-1 px-3 ">Total credit card balance</label>
                                        <label className="col-span-2 text-start border-2 py-1 px-3">{getTotalCreditCardBalance()}</label>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Monthly personal loan</label>
                                        <label className="col-span-2 text-start border-2 py-1 px-3">{initialValues?.monthlyPersonalLoan}</label>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Previous personal loan balance</label>
                                        <label className="col-span-2 text-start border-2 py-1 px-3">{initialValues?.loanDueMid}</label>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Interest from personal loan balance</label>
                                        <label className="col-span-2 text-start border-2 py-1 px-3">{getInterestFromLoanBalance()}</label>
                                    </div>
                                    <div className="grid grid-cols-3">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Fees</label>
                                        <label className="col-span-2 text-start border-2 py-1 px-3">{initialValues?.loanFees}</label>
                                    </div>
                                    <div className="grid grid-cols-3 font-bold">
                                        <label className="col-span-1 border-2 py-1 px-3 ">Total personal loan balance</label>
                                        <label className="col-span-2 text-start border-2 py-1 px-3">{getTotalLoanBalance()}</label>
                                    </div>
                                    <div className="grid grid-cols-3 font-bold">
                                        <label className="col-span-1 border-2 border-b-3 py-1 px-3 ">Total debt balance</label>
                                        <label className="col-span-2 text-start border-2 border-b-3 py-1 px-3">{getTotalDebtBalance()}</label>
                                    </div>
                                    



                                </div>
                                <div className="w-full pb-4 flex justify-end">
                                    <Button type={"submit"} onClick={()=>{submit(initialValues)}} color="primary" >Next Month</Button>
                                </div>

                            </form>





                        </>
                    )}
                </div>

            </div>
        </>


    )

}
export default End