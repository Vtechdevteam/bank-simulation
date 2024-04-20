import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Spinner, Button, Divider, Input } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import store from "store"
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

const Page1 = () => {
    const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
    const [data, setData] = useState<Settings>()
    const [error, setError] = useState<string>('')
    const [initialValues, setInitialValues] = useState({
        initialPayout: 0,
        savings: 0,
        creditCardDue: 0,
        loanDue: 0,
        careditCardAllocation: 0,
        personalLoanAllocation: 0,
        nextMonthSavings:0
    })
   
    useEffect(() => {
        init()
    }, [])
    const init = async () => {
        await getSettingsData()
    }
    const getSettingsData = async () => {
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
            const initValue = {...initialValues}
            initValue['initialPayout'] = +month1?.initialPayout
            initValue['creditCardDue'] = +month1?.creditCardDue
            initValue['loanDue'] = +month1?.loanDue
            setInitialValues(initValue)
        }
        catch (e) {
            console.log(e)
        }
        setIsPageLoading(false)
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema: Yup.object({
            careditCardAllocation: Yup.number()
                .required("This field is required!"),
            personalLoanAllocation: Yup.number()
                .required("This field is required!"),
        }),
        onSubmit: (values) => {
            console.log('Values', values)
            submit(values)
        }
    })

    const submit=(values:any)=>{
        const savings = +getSavings(getTotalAvlBalance(values?.initialPayout,values?.savings),getTotalAllocation(values?.careditCardAllocation, values?.personalLoanAllocation)).toFixed(2)
        const creditCardDue = getCreditCardRemainingBln(values?.creditCardDue,values?.careditCardAllocation).toFixed(2)
       const loanDue =  getLoanRemainingBln(formik?.values?.loanDue,formik?.values?.personalLoanAllocation).toFixed(2)
        if(savings < 0){
            alert('The total amount allocated should equal your total available funds.')
            setError('The total amount allocated should equal your total available funds.')
        }
        else{
            store.set('savings',savings)
            Router?.push({
                pathname:'/month1/mid',
                query:{
                    savings:savings,
                    creditCardDue:creditCardDue,
                    loanDue:loanDue

                }
            })
        }
    }
    const isFormFieldValid = (name: any) => ((formik as any).errors[name]);

    const getFormErrorMessage = (name: any) => {
        return (formik as any).errors[name]
    };
    const getMinimumPaymentDue = () => {
        console.log('getMinimumPaymentDue', data?.financeData?.filter(e => e.sequenceNumber === 1)[0].initialPayout, data?.creditCardMinDuePercentage)
        const t: any = Number((Number(data?.financeData?.filter(e => e.sequenceNumber === 1)[0].initialPayout).toFixed(2) * Number(data?.creditCardMinDuePercentage).toFixed(2)) / 100).toFixed(2)
        return t
    }
    const getTotalDeptBalance = (creditCardDue:number,loanDue:number) => {
        return +creditCardDue + +loanDue
    }
    const getTotalAvlBalance = (initialPayout:number, savings:number) => {
        return +initialPayout+ +savings
    }
    const getCreditCardRemainingBln = (creditCardDue:number,allocation:number) => {
        return +creditCardDue - +allocation
    }
    const getLoanRemainingBln = (loanDue:number,allocation:number) => {
        return +loanDue - +allocation
    }
    const getTotalAmntOwed = (creditCardDue:number, loanDue:number) => {
        return +creditCardDue + +loanDue
    }
    const getTotalAllocation = (crdAllocation:number, loanAllocation:number) => {
        return +crdAllocation + +loanAllocation
    }
    const getTotalRemaining = () => {
        const total =getCreditCardRemainingBln(formik?.values?.creditCardDue,formik?.values?.careditCardAllocation) +  getLoanRemainingBln(formik?.values?.loanDue,formik?.values?.personalLoanAllocation)
        return total
    }
    const getSavings = (tatalAvlBln:number,totalallc:number) => {
        //formik?.setFieldValue('nextMonthSavings',tatalAvlBln-totalallc)
        return tatalAvlBln-totalallc
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
                                <h2 className="font-semibold">Begining of Month-1</h2>
                                <p className="">Here is an overview of your current financial situation. Allocate your available funds across the three accounts. Your credit card and personal loan payments are due today.
                                </p>
                            </div>
                            <div className="w-full">
                                <div className="w-1/2">
                                    <div className="my-2">
                                        <label className="font-semibold">Total Available Funds ($):</label>

                                        <div className="mx-4 mt-3 grid grid-cols-2">
                                            <label className="col-span-1"> Disposable income</label>
                                            <label className="col-span-1">{formik?.values?.initialPayout}</label>
                                        </div>
                                        <div className="mx-4 grid grid-cols-2 ">
                                            <label className="col-span-1">Savings</label>
                                            <label className="col-span-1">{formik?.values?.savings}</label>
                                        </div>
                                        <div className="mx-4 font-semibold grid grid-cols-2 ">
                                            <label className="col-span-1">Total available funds</label>
                                            <label className="col-span-1">{getTotalAvlBalance(formik?.values?.initialPayout,formik?.values?.savings).toFixed(2)}</label>
                                        </div>
                                    </div>
                                    <div className="my-4 w-4/5">
                                        <label className="font-semibold">Payment Dues ($):</label>

                                        <div className="mx-4 mt-2 grid grid-cols-5">
                                            <div className="col-span-4">
                                                <label className=""> Credit card balance</label>
                                                <label className="block ml-3"> - minimum payment due: {getMinimumPaymentDue()}</label>
                                                <label className="block ml-3"> - APR: {data?.creditCardAPR}% (applied if not paid in full this time)
                                                </label>
                                                <label className="block ml-3"> - Penalty APR: {data?.creditCardPenaltyAPR}% (applied if not paid on time)
                                                </label>
                                            </div>
                                            <label className="col-span-1 my-auto">{formik?.values?.creditCardDue}</label>
                                        </div>
                                        <div className=" mx-4 mt-3 grid grid-cols-5">
                                            <div className="col-span-4">
                                                <label className="">Personal loan monthly balance</label>
                                                <label className="block ml-3"> - minimum payment due: 100</label>
                                                <label className="block ml-3"> - APR: {data?.loanAPR}% (applied if not paid in full this time)
                                                </label>
                                                <label className="block ml-3"> - Penalty APR: {data?.loanPenaltyAPR}% (applied if not paid on time)
                                                </label>
                                            </div>
                                            <label className="col-span-1 my-auto">{formik?.values?.loanDue}</label>
                                        </div>

                                        <div className="mx-4 mt-3 font-semibold grid grid-cols-5 ">
                                            <label className="col-span-4">Total debt balance</label>
                                            <label className="col-span-1">{getTotalDeptBalance(formik?.values?.creditCardDue,formik?.values?.loanDue)}</label>
                                        </div>


                                    </div>
                                </div>

                            </div>
                            <div className="border">
                            </div>
                            <form onSubmit={formik?.handleSubmit}>
                                <div className="w-4/5 mx-auto my-4 pb-10">
                                    <h2 className="font-semibold text-lg">Make your Allocations</h2>
                                    <div className="grid grid-cols-4 mt-3">
                                        <label className="col-span-1 font-semibold border-2 border-t-3 py-1 px-3 "> Total Available Funds</label>
                                        <label className="col-span-3 text-start border-2 border-t-3 py-1 px-3">{getTotalAvlBalance(formik?.values?.initialPayout,formik?.values?.savings).toFixed(2)}</label>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Payments</label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">Amount owed</label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">Allocation</label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">Remaining balance</label>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Credit card </label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{formik?.values?.creditCardDue}</label>
                                        <div className="col-span-1 text-start border-2 py-1 px-3">
                                            <Input type="number" placeholder="Enter amount" size="sm" variant={"underlined"}
                                                name="careditCardAllocation"
                                                value={String(formik?.values?.careditCardAllocation)}
                                                onChange={(e) => { formik.setFieldValue('careditCardAllocation', +e.target.value) }}
                                                isInvalid={isFormFieldValid('careditCardAllocation')}
                                                color={isFormFieldValid('careditCardAllocation') ? "danger" : "success"}
                                                errorMessage={getFormErrorMessage('careditCardAllocation')}
                                            />
                                        </div>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{getCreditCardRemainingBln(formik?.values?.creditCardDue,formik?.values?.careditCardAllocation).toFixed(2)}</label>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Personal loan </label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{formik?.values?.loanDue}</label>
                                        <div className="col-span-1 text-start border-2 py-1 px-3">
                                            <Input type="number" placeholder="Enter amount" size="sm" variant={"underlined"}
                                                name="personalLoanAllocation"
                                                value={String(formik?.values?.personalLoanAllocation)}
                                                onChange={(e) => { formik.setFieldValue('personalLoanAllocation', +e.target.value) }}
                                                isInvalid={isFormFieldValid('personalLoanAllocation')}
                                                color={isFormFieldValid('personalLoanAllocation') ? "danger" : "success"}
                                                errorMessage={getFormErrorMessage('personalLoanAllocation')}
                                            />
                                        </div>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{getLoanRemainingBln(formik?.values?.loanDue,formik?.values?.personalLoanAllocation).toFixed(2)}</label>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Total </label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{getTotalAmntOwed(formik?.values?.creditCardDue,formik?.values?.loanDue).toFixed(2)}</label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{getTotalAllocation(formik?.values?.careditCardAllocation, formik?.values?.personalLoanAllocation).toFixed(2)}</label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{getTotalRemaining().toFixed(2)}</label>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        <label className="col-span-1 font-semibold border-2 border-b-4 py-1 px-3 ">Savings </label>
                                        <label className="col-span-1 text-start border-2 border-b-4 py-1 px-3"></label>
                                        <label className="col-span-1 text-start border-2 border-b-4 py-1 px-3">{getSavings(getTotalAvlBalance(formik?.values?.initialPayout,formik?.values?.savings),getTotalAllocation(formik?.values?.careditCardAllocation, formik?.values?.personalLoanAllocation)).toFixed(2)}</label>
                                        <label className="col-span-1 text-start border-2 border-b-4 py-1 px-3"></label>
                                    </div>


                                </div>
                                {/* <div className="w-4/5 mx-auto my-4 pb-10">
                                    <h2 className="font-semibold text-lg">Middle of Month-1</h2>
                                    <p>Here is an overview of your current financial situation. Allocate your available funds across these three accounts.
                                    </p>
                                    <div className="grid grid-cols-4 mt-3">
                                        <label className="col-span-1 font-semibold border-2 border-t-3 py-1 px-3 "> Total Available Funds</label>
                                        <label className="col-span-3 text-start border-2 border-t-3 py-1 px-3">Ex. 1500</label>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Payments</label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">Amount owed</label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">Allocation</label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">Remaining balance</label>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Credit card </label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">1700</label>
                                        <div className="col-span-1 text-start border-2 py-1 px-3">
                                            <Input type="number" placeholder="Enter amount" size="sm" variant={"underlined"}
                                                name="midCareditCardAllocation"
                                                value={String(formik?.values?.midCareditCardAllocation)}
                                                onChange={(e) => { formik.setFieldValue('midCareditCardAllocation', Number(e.target.value).toFixed(2)) }}
                                                isInvalid={isFormFieldValid('midCareditCardAllocation')}
                                                color={isFormFieldValid('midCareditCardAllocation') ? "danger" : "success"}
                                                errorMessage={getFormErrorMessage('midCareditCardAllocation')}
                                            />
                                        </div>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">900</label>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Personal loan </label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">1500</label>
                                        <div className="col-span-1 text-start border-2 py-1 px-3">
                                            <Input type="number" placeholder="Enter amount" size="sm" variant={"underlined"}
                                                name="midPersonalLoanAllocation"
                                                value={String(formik?.values?.midPersonalLoanAllocation)}
                                                onChange={(e) => { formik.setFieldValue('midPersonalLoanAllocation', e.target.value) }}
                                                isInvalid={isFormFieldValid('midPersonalLoanAllocation')}
                                                color={isFormFieldValid('midPersonalLoanAllocation') ? "danger" : "success"}
                                                errorMessage={getFormErrorMessage('midPersonalLoanAllocation')}
                                            />
                                        </div>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">900</label>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Total </label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">3200</label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">3200</label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">1800</label>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        <label className="col-span-1 font-semibold border-2 border-b-4 py-1 px-3 ">Savings </label>
                                        <label className="col-span-1 text-start border-2 border-b-4 py-1 px-3"></label>
                                        <label className="col-span-1 text-start border-2 border-b-4 py-1 px-3">100</label>
                                        <label className="col-span-1 text-start border-2 border-b-4 py-1 px-3"></label>
                                    </div>


                                </div>
                                <div className="w-4/5 mx-auto my-4 pb-10">
                                    <h2 className="font-semibold text-lg">End of Month-1</h2>
                                    <p>You made purchases worth $1,600 last month. You also have dues on your personal loan.
                                        Here is an overview of your current financial situation ($):

                                    </p>
                                    <div className="grid grid-cols-2 mt-3">
                                        <label className="col-span-1 border-t-1 border-l-2 py-1 px-3 ">New purchases with credit card</label>
                                        <label className="col-span-1 text-start border-t-1 border-l-2 border-r-2 py-1 px-3">1600</label>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <label className="col-span-1 border-t-2 border-l-2 py-1 px-3 ">Previous credit card balance</label>
                                        <label className="col-span-1 text-start border-t-2 border-l-2 border-r-2 py-1 px-3">1600</label>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <label className="col-span-1 border-t-2 border-l-2 py-1 px-3 ">Interest from credit card balance</label>
                                        <label className="col-span-1 text-start border-t-2 border-l-2 border-r-2 py-1 px-3">1600</label>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <label className="col-span-1 border-t-2 border-l-2 py-1 px-3 ">Fees</label>
                                        <label className="col-span-1 text-start border-t-2 border-l-2 border-r-2 py-1 px-3">1600</label>
                                    </div>
                                    <div className="grid grid-cols-2 font-semibold">
                                        <label className="col-span-1 border-t-2 border-l-2 py-1 px-3 ">Total credit card balance</label>
                                        <label className="col-span-1 text-start border-t-2 border-l-2 border-r-2 py-1 px-3">1600</label>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <label className="col-span-1 border-t-2 border-l-2 py-1 px-3 ">Monthly personal loan</label>
                                        <label className="col-span-1 text-start border-t-2 border-l-2 border-r-2 py-1 px-3">1600</label>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <label className="col-span-1 border-t-2 border-l-2 py-1 px-3 ">Previous personal loan balance</label>
                                        <label className="col-span-1 text-start border-t-2 border-l-2 border-r-2 py-1 px-3">1600</label>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <label className="col-span-1 border-t-2 border-l-2 py-1 px-3 ">Interest from personal loan balance</label>
                                        <label className="col-span-1 text-start border-t-2 border-l-2 border-r-2 py-1 px-3">1600</label>
                                    </div>
                                    <div className="grid grid-cols-2">
                                        <label className="col-span-1 border-t-2 border-l-2 py-1 px-3 ">Fees</label>
                                        <label className="col-span-1 text-start border-t-2 border-l-2 border-r-2 py-1 px-3">1600</label>
                                    </div>
                                    <div className="grid grid-cols-2 font-semibold">
                                        <label className="col-span-1 border-t-2 border-l-2 py-1 px-3 ">Total personal balance</label>
                                        <label className="col-span-1 text-start border-t-2 border-l-2 border-r-2 py-1 px-3">1600</label>
                                    </div>
                                    <div className="grid grid-cols-2 font-semibold">
                                        <label className="col-span-1 border-t-2 border-l-2 py-1 px-3 border-b-2 ">Total debt balance</label>
                                        <label className="col-span-1 text-start border-t-2 border-l-2 border-r-2 border-b-2 py-1 px-3">1600</label>
                                    </div>



                                </div> */}
                                <div className="w-full pb-4 flex justify-end">
                                    <Button type={"submit"} color="primary" >Mid Month Allocation</Button>
                                </div>

                            </form>





                        </>
                    )}
                </div>

            </div>
        </>


    )

}
export default Page1