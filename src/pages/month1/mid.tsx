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

const Mod = () => {
    const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
    const [data, setData] = useState<Settings>()
    const [error, setError] = useState<string>('')
    const [initialValues, setInitialValues] = useState({
        initialPayout: 0,
        savings: 0,
        creditCardDueBeg: 0,
        loanDueBeg: 0,
        creditCardDueMid: 0,
        loanDueMid: 0,
        careditCardAllocation: 0,
        personalLoanAllocation: 0,
        nextMonthSavings:0
    })
   
    useEffect(() => {
        init()
    }, [])
    const init = async () => {
        const windowUrl = window.location.search;
        const params = new URLSearchParams(windowUrl);
        await getSettingsData(params.get('savings'),params.get('creditCardDue'),params.get('loanDue'))
    }
    const getSettingsData = async (savings:any,creditCardDue:any,loanDue:any) => {
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
            initValue['savings'] = +savings
            initValue['initialPayout'] = +month1?.secondPayout
            initValue['creditCardDueBeg'] = +creditCardDue
            initValue['loanDueBeg'] = +loanDue
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
        const creditCardDueBeg = values?.creditCardDueBeg
        const creditCardDueMid = getCreditCardRemainingBln(values?.creditCardDueBeg,values?.careditCardAllocation).toFixed(2)
        const loanDueBeg = values?.loanDueBeg
        const loanDueMid =  getLoanRemainingBln(formik?.values?.loanDueBeg,formik?.values?.personalLoanAllocation).toFixed(2)
        console.log('Test',creditCardDueBeg,creditCardDueMid,loanDueBeg,loanDueMid)
        if(savings < 0){
            alert('The total amount allocated should equal your total available funds.')
            setError('The total amount allocated should equal your total available funds.')
        }
        else{
            Router?.push({
                pathname:'/month1/end',
                query:{
                    savings:savings,
                    creditCardDueBeg:creditCardDueBeg,
                    loanDueBeg:loanDueBeg,
                    creditCardDueMid:creditCardDueMid,
                    loanDueMid:loanDueMid

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
        const total =getCreditCardRemainingBln(formik?.values?.creditCardDueBeg,formik?.values?.careditCardAllocation) +  getLoanRemainingBln(formik?.values?.loanDueBeg,formik?.values?.personalLoanAllocation)
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
                                    <div className="my-2">
                                        <label className="font-semibold">Payment Dues ($):</label>

                                        <div className="mx-4 mt-3 grid grid-cols-2">
                                            <label className="col-span-1"> Credit card balance</label>
                                            <label className="col-span-1">{formik?.values?.creditCardDueBeg}</label>
                                        </div>
                                        <div className="mx-4 grid grid-cols-2 ">
                                            <label className="col-span-1">Personal loan monthly balance</label>
                                            <label className="col-span-1">{formik?.values?.loanDueBeg}</label>
                                        </div>
                                        <div className="mx-4 font-semibold grid grid-cols-2 ">
                                            <label className="col-span-1">Total debt balance</label>
                                            <label className="col-span-1">{getTotalDeptBalance(formik?.values?.creditCardDueBeg,formik?.values?.loanDueBeg).toFixed(2)}</label>
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
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{formik?.values?.creditCardDueBeg}</label>
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
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{getCreditCardRemainingBln(formik?.values?.creditCardDueBeg,formik?.values?.careditCardAllocation).toFixed(2)}</label>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Personal loan </label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{formik?.values?.loanDueBeg}</label>
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
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{getLoanRemainingBln(formik?.values?.loanDueBeg,formik?.values?.personalLoanAllocation).toFixed(2)}</label>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Total </label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{getTotalAmntOwed(formik?.values?.creditCardDueBeg,formik?.values?.loanDueBeg).toFixed(2)}</label>
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
                                <div className="w-full pb-4 flex justify-end">
                                    <Button type={"submit"} color="primary" >End of Month1</Button>
                                </div>

                            </form>





                        </>
                    )}
                </div>

            </div>
        </>


    )

}
export default Mod