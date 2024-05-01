import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Spinner, Button, Divider, Input, Select, SelectItem } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import store from "store"
import Router, { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { GlobalDataService } from "@/services/globalDataService";
import Calculator from "@/utils/Calculator";
import CacheService from "@/services/CacheService";

const Page1 = () => {
    const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
    const [savingsError, setSavingsError] = useState<string>('')
    const [month, setMonth] = useState<number>(1)

    const router = useRouter()

    useEffect(() => {
        if (router.isReady) {
            init()
            window.onpopstate = () => {
                alert("Going back will discard all the changes. Please re-login.")
                window.location.reload()
            };
        }
    }, [router.isReady, router.query.month])

    const init = async () => {
        console.log(router.query.month)
        setMonth(Number(router.query.month) ?? 1)
        await CacheService.fetch()
        formik.resetForm()
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: CacheService.getCurrentMonthTransaction(month) ?? {},
        validationSchema: Yup.object({
            "loanAllocation": Yup.number().required("Please allocate some money here.").min(0, "Must be greater than 0.").max(getCurrentLoanDue(), "Must be less than or equal to amount owed."),
            "creditCardAllocation": Yup.number().required("Please allocate some money here.").min(0, "Must be greater than min due.").max(getCurrentCreditCardDue(), "Must be less than or equal to amount owed.")
        }),
        onSubmit: (values) => {
            console.log('Values', values)
            submit(values)
        }
    })

    const checkForSavingErrors = () => {
        if (getSavings() < 0) {
            setSavingsError("Saving cannot be negative. You have allocated funds over and above your total available funds. Please adjust the allocations.")
        } else {
            setSavingsError("")
        }
    }

    const submit = (values: any) => {
        if (getSavings() < 0) {
            checkForSavingErrors()
            return;
        }
        const userTransaction = {
            "sequenceNumber": month,
            "creditCardAllocation": getCreditCardAllocation(),
            "creditCardDue": getCreditCardDue(),
            "loanAllocation": getLoanAllocation(),
            "loanDue": getLoanDue(),
            "savings": getSavings(),
            "creditCardLateFee": 0,
            "creditCardAPR": 0,
            "loanLateFee": 0,
            "loanAPR": 0,
            "creditCardPenaltyAPR": 0,
            "loanPenaltyAPR": 0
        }
        CacheService.setCurrentMonthTransaction(userTransaction)
        router.push("/play/" + (month + 1))
    }
    const isFormFieldValid = (name: any) => ((formik as any).errors[name]);

    const getFormErrorMessage = (name: any) => {
        return (formik as any).errors[name]
    };

    function getCreditCardDue(): number {
        return Math.round((getCurrentCreditCardDue() -
            (formik.values.creditCardAllocation ?? 0)) * 100) / 100
    }

    function getCurrentCreditCardDue(): number {
        return Math.round((
            (CacheService.getCurrentFinanceData(month)?.creditCardDue ?? 0) +
            (CacheService.getPreviousMonthTransaction(month)?.creditCardDue ?? 0) +
            (CacheService.getPreviousMonthCreditCardInterest(month)) +
            (CacheService.getPreviousMonthCreditCardLateFee(month))
        ) * 100) / 100
    }

    function getLoanDue(): number {
        return Math.round((getCurrentLoanDue() -
            Number(formik.values.loanAllocation ?? 0)) * 100) / 100
    }

    function getLoanAllocation(): number {
        return formik.values.loanAllocation ?? 0
    }

    function getCreditCardAllocation(): number {
        return formik.values.creditCardAllocation ?? 0
    }

    function getSavings(): number {
        const savings = Math.round((((CacheService.getCurrentFinanceData(month)?.initialPayout ?? 0) + (CacheService.getPreviousMonthTransaction(month)?.savings ?? 0)) -
            (Number(formik.values.creditCardAllocation ?? 0) +
                Number(formik.values.loanAllocation ?? 0))) * 100) / 100
        return savings
    }

    function getTotalAvailableFunds(): number {
        return Math.round(((CacheService.getCurrentFinanceData(month)?.initialPayout ?? 0) +
            (CacheService.getPreviousMonthTransaction(month)?.savings ?? 0)) * 100) / 100
    }

    function getCurrentLoanDue(): number {
        return Math.round((
            (CacheService.getPreviousMonthTransaction(month)?.loanDue ?? 0) +
            (CacheService.getCurrentFinanceData(month)?.loanDue ?? 0) +
            (CacheService.getPreviousMonthLoanInterest(month))
        ) * 100) / 100
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
                    <p className="font-bold text-inherit">Simulation Game</p>
                </NavbarBrand>
            </Navbar>
            <div className="w-full h-screen bg-white max-w-5xl mx-auto">
                <div className="mx-9 text-black">
                    {isPageLoading ? (
                        <div className="flex justify-center pt-8">
                            <Spinner label="Loading..." color="primary" />
                        </div>
                    ) : (
                        <>
                            <div className="py-4">
                                <h2 className="font-semibold text-xl">{month % 2 == 0 ? 'Mid' : 'Begining'} of Month {Calculator.calculateMonth(month)}</h2>
                                <p className="">Here is an overview of your current financial situation. Allocate your available funds across the three accounts. Your credit card and personal loan payments are due today.</p>
                                {(!CacheService.isGraceEnabled && (month % 2 == 0)) && (
                                    <>
                                        <br />
                                        <p className="text-danger">You missed making your payment. Your credit card company sends you a note
                                            saying that they will apply a {CacheService.masterData?.creditCardLateFee} late fee and {CacheService.getPreviousMonthCreditCardInterest(month, false)} in penalty interest charges on your unpaid
                                            balance.</p>
                                    </>
                                )}
                                {
                                    (CacheService.isGraceEnabled && (month % 2 == 0)) && (
                                        <>
                                            <br />
                                            <p className="text-danger">You missed making your payment. Your credit card company sends you a note
                                                saying that they will apply a {CacheService.masterData?.creditCardLateFee} late fee and {CacheService.getPreviousMonthCreditCardInterest(month, false)} in penalty interest charges on your unpaid
                                                balance. However, they are offering you an additional grace period. If you pay within this
                                                period, you will not incur any penalty interest charges and will not have to pay the late fee.</p>
                                        </>
                                    )
                                }
                            </div>
                            <div className="w-full flex">
                                <div className="w-1/2">
                                    <div className="my-2">
                                        <label className="font-semibold text-xl">Total Available Funds ($):</label>
                                        <div className="mt-3 grid grid-cols-2">
                                            <label className="col-span-1"> Disposable income</label>
                                            <label className="col-span-1">{CacheService.getCurrentFinanceData(month)?.initialPayout}</label>
                                        </div>
                                        <div className="grid grid-cols-2 ">
                                            <label className="col-span-1">Savings</label>
                                            <label className="col-span-1">{CacheService.getPreviousMonthTransaction(month)?.savings ?? 0}</label>
                                        </div>
                                        <Divider className="my-1 w-2/3" />
                                        <div className="grid grid-cols-2 ">
                                            <label className="col-span-1">Total available funds</label>
                                            <label className="col-span-1">{getTotalAvailableFunds()}</label>
                                        </div>
                                    </div>
                                    <div className="" hidden={CacheService.getPreviousMonthTotalBalanceDue(month) == 0}>
                                        <label className="font-semibold text-xl">Previous balance ($):</label>
                                        <div className="mt-3 grid grid-cols-2">
                                            <label className="col-span-1">Credit card balance</label>
                                            <label className="col-span-1">{CacheService.getPreviousMonthTransaction(month)?.creditCardDue}</label>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <label className="col-span-1">Credit card interest</label>
                                            <label className="col-span-1">{CacheService.getPreviousMonthCreditCardInterest(month)}</label>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <label className="col-span-1">Credit card late fee</label>
                                            <label className="col-span-1">{CacheService.getPreviousMonthCreditCardLateFee(month)}</label>
                                        </div>
                                        <div className="grid grid-cols-2 ">
                                            <label className="col-span-1">Loan balance</label>
                                            <label className="col-span-1">{CacheService.getPreviousMonthTransaction(month)?.loanDue}</label>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <label className="col-span-1">Loan interest</label>
                                            <label className="col-span-1">{CacheService.getPreviousMonthLoanInterest(month)}</label>
                                        </div>
                                        <Divider className="my-1 w-2/3" />
                                        <div className="grid grid-cols-2 ">
                                            <label className="col-span-1">Total balance</label>
                                            <label className="col-span-1">{
                                                CacheService.getPreviousMonthTotalBalanceDue(month)
                                            }</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <div className="my-4 w-4/5" hidden={CacheService.getCurrentMonthCreditCardAndLoanBalanceDue(month) == 0}>
                                        <label className="font-semibold text-xl">Payment Dues ($):</label>
                                        <div className="mt-2 grid grid-cols-5">
                                            <div className="col-span-4">
                                                <label className=""> Credit card balance</label>
                                                <label className="block ml-3"> - minimum payment due: {CacheService.getCurrentFinanceData(month)?.creditCardMinDue}</label>
                                                <label className="block ml-3"> - APR: {CacheService.masterData?.creditCardAPR}% (applied if not paid in full this time)
                                                </label>
                                                <label className="block ml-3"> - Penalty APR: {CacheService.masterData?.creditCardPenaltyAPR}% (applied if not paid on time)
                                                </label>
                                            </div>
                                            <label className="col-span-1 my-auto">{CacheService.getCurrentFinanceData(month)?.creditCardDue}</label>
                                        </div>
                                        <div className="mt-3 grid grid-cols-5">
                                            <div className="col-span-4">
                                                <label className="">Personal loan monthly balance</label>
                                                <label className="block ml-3"> - APR: {CacheService.masterData?.loanAPR}% (applied if not paid in full this time)
                                                </label>
                                                <label className="block ml-3"> - Penalty APR: {CacheService.masterData?.loanPenaltyAPR}% (applied if not paid on time)
                                                </label>
                                            </div>
                                            <label className="col-span-1 my-auto">{CacheService.getCurrentFinanceData(month)?.loanDue}</label>
                                        </div>
                                        <Divider className="my-1 mt-2" />
                                        <div className="mt-3 grid grid-cols-5">
                                            <label className="col-span-4">Total debt balance</label>
                                            <label className="col-span-1">{
                                                (getCurrentCreditCardDue() + getCurrentLoanDue())
                                            }</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border">
                            </div>
                            <form onSubmit={formik?.handleSubmit} hidden={CacheService.getCurrentFinanceData(month) ? false : true}>
                                <div className="w-4/5 mx-auto my-4 pb-10">
                                    <h2 className="font-semibold text-xl">Make your Allocations</h2>
                                    <div className="grid grid-cols-4 mt-3">
                                        <label className="col-span-1 font-semibold border-2 border-t-3 py-1 px-3 "> Total Available Funds</label>
                                        <label className="col-span-3 text-start border-2 border-t-3 py-1 px-3">{getTotalAvailableFunds()}</label>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Payments</label>
                                        <label className="col-span-1 font-semibold text-start border-2 py-1 px-3">Amount owed</label>
                                        <label className="col-span-1 font-semibold text-start border-2 py-1 px-3">Allocation</label>
                                        <label className="col-span-1 font-semibold text-start border-2 py-1 px-3">Remaining balance</label>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Credit card </label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{
                                            getCurrentCreditCardDue()
                                        }</label>
                                        <div className="col-span-1 text-start border-2 py-1 px-3">
                                            <Input type="number" placeholder="Enter amount" size="sm" variant={"underlined"}
                                                name="creditCardAllocation"
                                                onChange={(e) => {
                                                    formik.setFieldValue('creditCardAllocation', e.target.value)
                                                    checkForSavingErrors()
                                                }}
                                                isInvalid={isFormFieldValid('creditCardAllocation')}
                                                color={isFormFieldValid('creditCardAllocation') ? "danger" : "success"}
                                                errorMessage={getFormErrorMessage('creditCardAllocation')}
                                                value={String(formik.values.creditCardAllocation)}
                                            // isRequired={true}
                                            />
                                        </div>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{
                                            getCreditCardDue()
                                        }</label>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Personal loan </label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{
                                            getCurrentLoanDue()
                                        }</label>
                                        <div className="col-span-1 text-start border-2 py-1 px-3">
                                            <Input type="number" placeholder="Enter amount" size="sm" variant={"underlined"}
                                                name="loanAllocation"
                                                onChange={(e) => {
                                                    formik.setFieldValue('loanAllocation', +e.target.value)
                                                    checkForSavingErrors()
                                                }}
                                                isInvalid={isFormFieldValid('loanAllocation')}
                                                color={isFormFieldValid('loanAllocation') ? "danger" : "success"}
                                                errorMessage={getFormErrorMessage('loanAllocation')}
                                                value={String(formik.values.loanAllocation)}
                                            // isRequired={true}
                                            />
                                        </div>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{
                                            getLoanDue()
                                        }</label>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        <label className="col-span-1 font-semibold border-2 py-1 px-3 ">Total </label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{
                                            Math.round(((getCurrentCreditCardDue() + getCurrentLoanDue())) * 100) / 100
                                        }</label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{
                                            (Number(formik.values.creditCardAllocation ?? 0)) +
                                            (Number(formik.values.loanAllocation ?? 0))
                                        }</label>
                                        <label className="col-span-1 text-start border-2 py-1 px-3">{
                                            Math.round(((getCurrentCreditCardDue() + getCurrentLoanDue()) -
                                                (Number(formik.values.loanAllocation ?? 0) + Number(formik.values.creditCardAllocation ?? 0))) * 100) / 100
                                        }</label>
                                    </div>
                                    <div className="grid grid-cols-4">
                                        <label className="col-span-1 font-semibold border-2 border-b-4 py-1 px-3 ">Savings </label>
                                        <label className="col-span-3 text-start border-2 border-b-4 py-1 px-3">{getSavings()}
                                            {savingsError && (<label className="block text-tiny text-danger">{savingsError}</label>)}
                                        </label>
                                    </div>
                                </div>
                                <div className="w-full pb-4 flex justify-end">
                                    <Button type={"submit"} color="primary" >Go to Next</Button>
                                </div>
                            </form>
                        </>
                    )}
                    {
                        CacheService.masterData?.financeData?.length == (month - 1) && (
                            <div className="mt-10">
                                <label htmlFor="">Please answer the following questions to proceed:</label>
                                <div className="mt-4">
                                    <label htmlFor="">What is your gender?</label>
                                    <Select
                                        label="Gender"
                                        placeholder="Select your gender"
                                        className="max-w-xs block mt-2">
                                        <SelectItem key={"Male"} value={"Male"}>
                                            {"Male"}
                                        </SelectItem>
                                        <SelectItem key={"Female"} value={"Female"}>
                                            {"Female"}
                                        </SelectItem>
                                        <SelectItem key={"Non-binary/third gender"} value={"Non-binary/third gender"}>
                                            {"Non-binary/third gender"}
                                        </SelectItem>
                                        <SelectItem key={"Prefer not to say"} value={"Prefer not to say"}>
                                            {"Prefer not to say"}
                                        </SelectItem>
                                    </Select>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="">What is your age?</label>
                                    <Input
                                        label="Age"
                                        placeholder="Enter your age"
                                        type="number"
                                        className="max-w-xs block mt-2">
                                    </Input>
                                </div>
                                <Button onClick={() => {
                                    Router.push("/thank-you")
                                }} className="mt-4" color="primary">Submit</Button>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )

}
export default Page1