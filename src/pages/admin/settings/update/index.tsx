import { useEffect, useState } from "react"
import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Input, Accordion, AccordionItem, Button, Spinner } from "@nextui-org/react";
import { FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import { GlobalDataService } from "@/services/globalDataService";
import Router from "next/router";
import { FinanceDatum, MasterInformation } from "@/models/Transaction";


const AddUpdateSettings = () => {

    const [data, setData] = useState<MasterInformation>()
    const [isAdd, setIsAdd] = useState<boolean>(false)
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
    const [id, setId] = useState<string>('')
    const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
    const [initialValues, setInitialValues] = useState<MasterInformation>({
        numberOfMonths: undefined,
        creditCardLateFee: undefined,
        creditCardAPR: undefined,
        creditCardPenaltyAPR: undefined,
        loanLateFee: undefined,
        loanAPR: undefined,
        loanPenaltyAPR: undefined,
        financeData: []
    })
    const validationSchema = Yup.object({
        numberOfMonths: Yup.number()
            .required("This field is required!"),
        creditCardLateFee: Yup.number()
            .required("This field is required!"),
        creditCardAPR: Yup.number()
            .required("This field is required!"),
        creditCardPenaltyAPR: Yup.number()
            .required("This field is required!"),
        loanLateFee: Yup.number()
            .required("This field is required!"),
        loanAPR: Yup.number()
            .required("This field is required!"),
        loanPenaltyAPR: Yup.number()
            .required("This field is required!"),
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
            const res: any = await GlobalDataService?.getGlobalDataData()
            console.log('Data', res?.data)
            setId(res?.id)
            console.log('res?.data', res)
            if (res !== null) {
                setData(res?.data)
                setInitialValues(res?.data)
            }
            else {
                setInitialValues({
                    numberOfMonths: undefined,
                    creditCardLateFee: undefined,
                    creditCardAPR: undefined,
                    creditCardPenaltyAPR: undefined,
                    loanLateFee: undefined,
                    loanAPR: undefined,
                    loanPenaltyAPR: undefined,
                    financeData: []
                })
            }



        }
        catch (e) {
            console.log(e)
        }
        setIsPageLoading(false)
    }

    const submitData = async (values: MasterInformation) => {
        setIsButtonLoading(true)
        try {
            const formatedFinanceData: FinanceDatum[] = []

            for (var fd of values.financeData ?? []){
                const firstSequence = (fd.sequenceNumber ?? 0) + ((fd.sequenceNumber ?? 0) - 1)
                const secondSequence = firstSequence + 1

                const firstElement: FinanceDatum = {
                    sequenceNumber: firstSequence,
                    initialPayout:   fd?.initialPayout ?? 0,
                    creditCardDue:  fd?.creditCardDue ?? 0,
                    loanDue:        fd?.loanDue ?? 0,
                    creditCardMinDue: fd?.creditCardMinDue ?? 0,
                }

                const secondElement: FinanceDatum = {
                    sequenceNumber: secondSequence,
                    initialPayout:   fd?.initialPayout ?? 0,
                    creditCardDue:  0,
                    loanDue:        0,
                    creditCardMinDue: 0,
                }

                formatedFinanceData.push(firstElement, secondElement)
            } 

            values.financeData = formatedFinanceData

            console.log(values)


            await GlobalDataService?.addGlobalData(values)
            Router?.push('/admin/settings')

        }
        catch (e) {
            console.log(e)
        }
        setIsButtonLoading(false)
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

                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem >
                        <Link color="foreground" href="#">
                            Home
                        </Link>
                    </NavbarItem>
                    <NavbarItem isActive>
                        <Link color="foreground" href="#">
                            Settings
                        </Link>
                    </NavbarItem>
                    <NavbarItem >
                        <Link href="#" color="foreground" aria-current="page">
                            Users
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" href="#">
                            Integrations
                        </Link>
                    </NavbarItem>
                </NavbarContent>

                <NavbarContent as="div" justify="end">
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                color="secondary"
                                name="Jason Hughes"
                                size="sm"
                                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">zoey@example.com</p>
                            </DropdownItem>
                            <DropdownItem key="settings">My Settings</DropdownItem>
                            <DropdownItem key="team_settings">Team Settings</DropdownItem>
                            <DropdownItem key="analytics">Analytics</DropdownItem>
                            <DropdownItem key="system">System</DropdownItem>
                            <DropdownItem key="configurations">Configurations</DropdownItem>
                            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                            <DropdownItem key="logout" color="danger">
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
            </Navbar>



            <div className="w-full h-screen mb-6 bg-white">
                <div className="lg:flex lg:items-center lg:justify-between border border-b-1 shadow-md py-4">
                    <div className="min-w-0 flex-1">
                        <h2 className="py-2 pl-9 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Add/Update        </h2>

                    </div>

                </div>

                <div className="mx-9 my-4 text-black">
                    {isPageLoading ? (
                        <div className="flex justify-center mt-8">
                            <Spinner label="Loading..." color="primary" />
                        </div>
                    ) : (
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={(values: MasterInformation) => {
                                submitData(values)
                            }}
                        >
                            {(formik) => {
                                const isFormFieldValid = (name: any) => ((formik as any).errors[name]);

                                const getFormErrorMessage = (name: any) => {
                                    return (formik as any).errors[name]
                                };
                                return (
                                    <Form onSubmit={formik.handleSubmit}>
                                        <>
                                            <div className="w-full px-6 grid grid-cols-1 md:grid-cols-5 gap-4">
                                                <Input className="" name='numberOfMonths' label="No. of months" variant="bordered"
                                                    type="number"
                                                    value={String(formik?.values?.numberOfMonths)}
                                                    onChange={(e) => {
                                                        formik?.setFieldValue('numberOfMonths', Number(e.target.value))
                                                        let dataArr = []
                                                        let months = e.target.value

                                                        for (let i = 0; i < Number(months); i++) {
                                                            let obj: FinanceDatum = {
                                                                sequenceNumber: i + 1,
                                                                initialPayout: undefined,
                                                                secondPayout: undefined,
                                                                loanDue: undefined,
                                                                creditCardDue: undefined,
                                                                creditCardMinDue: undefined
                                                            }
                                                            dataArr.push(obj)
                                                        }
                                                        formik.setFieldValue('financeData', dataArr)
                                                    }
                                                    }
                                                    endContent={
                                                        <div className="pointer-events-none flex items-center">
                                                            <span className="text-default-400 text-small">months</span>
                                                        </div>
                                                    }
                                                    isInvalid={isFormFieldValid('numberOfMonths')}
                                                    color={isFormFieldValid('numberOfMonths') ? "danger" : "success"}
                                                    errorMessage={getFormErrorMessage('numberOfMonths')}
                                                />
                                                <Input className="col-span-1" name='creditCardLateFee' label="Credit Card late fee" variant="bordered"
                                                    type="number" value={String(formik?.values?.creditCardLateFee)}
                                                    onChange={formik.handleChange}
                                                    startContent={
                                                        <div className="pointer-events-none flex items-center">
                                                            <span className="text-default-400 text-small">$</span>
                                                        </div>
                                                    }
                                                    isInvalid={isFormFieldValid('creditCardLateFee')}
                                                    color={isFormFieldValid('creditCardLateFee') ? "danger" : "success"}
                                                    errorMessage={getFormErrorMessage('creditCardLateFee')}
                                                />
                                                <Input className="col-span-1" name='creditCardAPR' label="Credit Card APR (%)" variant="bordered"
                                                    type="number" value={String(formik?.values?.creditCardAPR)}
                                                    onChange={formik.handleChange}
                                                    endContent={
                                                        <div className="pointer-events-none flex items-center">
                                                            <span className="text-default-400 text-small">%</span>
                                                        </div>
                                                    }
                                                    isInvalid={isFormFieldValid('creditCardAPR')}
                                                    color={isFormFieldValid('creditCardAPR') ? "danger" : "success"}
                                                    errorMessage={getFormErrorMessage('creditCardAPR')}
                                                />
                                                <Input className="col-span-1" name='creditCardPenaltyAPR' label="Credit Card Penalty APR (%)" variant="bordered"
                                                    type="number" value={String(formik?.values?.creditCardPenaltyAPR)}
                                                    onChange={formik.handleChange}
                                                    endContent={
                                                        <div className="pointer-events-none flex items-center">
                                                            <span className="text-default-400 text-small">%</span>
                                                        </div>
                                                    }
                                                    isInvalid={isFormFieldValid('creditCardPenaltyAPR')}
                                                    color={isFormFieldValid('creditCardPenaltyAPR') ? "danger" : "success"}
                                                    errorMessage={getFormErrorMessage('creditCardPenaltyAPR')}
                                                />
                                                <Input className="col-span-1" name='loanLateFee' label="Loan late fee" variant="bordered"
                                                    type="number" value={String(formik?.values?.loanLateFee)}
                                                    onChange={formik.handleChange}
                                                    startContent={
                                                        <div className="pointer-events-none flex items-center">
                                                            <span className="text-default-400 text-small">$</span>
                                                        </div>
                                                    }
                                                    isInvalid={isFormFieldValid('loanLateFee')}
                                                    color={isFormFieldValid('loanLateFee') ? "danger" : "success"}
                                                    errorMessage={getFormErrorMessage('loanLateFee')}
                                                />
                                                <Input className="col-span-1" name='loanAPR' label="Loan APR (%)" variant="bordered"
                                                    type="number" value={String(formik?.values?.loanAPR)}
                                                    onChange={formik.handleChange}
                                                    endContent={
                                                        <div className="pointer-events-none flex items-center">
                                                            <span className="text-default-400 text-small">%</span>
                                                        </div>
                                                    }
                                                    isInvalid={isFormFieldValid('loanAPR')}
                                                    color={isFormFieldValid('loanAPR') ? "danger" : "success"}
                                                    errorMessage={getFormErrorMessage('loanAPR')}
                                                />
                                                <Input className="col-span-1" name='loanPenaltyAPR' label="Loan Penalty APR (%)" variant="bordered"
                                                    type="number" value={String(formik?.values?.loanPenaltyAPR)}
                                                    onChange={formik.handleChange}
                                                    endContent={
                                                        <div className="pointer-events-none flex items-center">
                                                            <span className="text-default-400 text-small">%</span>
                                                        </div>
                                                    }
                                                    isInvalid={isFormFieldValid('loanPenaltyAPR')}
                                                    color={isFormFieldValid('loanPenaltyAPR') ? "danger" : "success"}
                                                    errorMessage={getFormErrorMessage('loanPenaltyAPR')}
                                                />



                                            </div>
                                            {(formik?.values?.financeData?.length ?? 0) > 0 && (
                                                <h4 className="px-6 py-4 text-2xl font-semibold">
                                                    Finance Data
                                                </h4>
                                            )}
                                            <FieldArray name={"financeData"}>
                                                {({ push, remove }) => {
                                                    return (
                                                        <div className="">
                                                            <Accordion variant="splitted" defaultExpandedKeys={["1"]}>

                                                                {formik?.values?.financeData?.map((each, i) => {
                                                                    return (
                                                                        <AccordionItem key={each?.sequenceNumber} aria-label={`Month-${each?.sequenceNumber}`} title={`Month-${each?.sequenceNumber}`}>
                                                                            <div className="w-full px-2 md:px-6 grid grid-cols-1 md:grid-cols-5 gap-4 py-3">
                                                                                <Input className="col-span-1"
                                                                                    name={`financeData[${i}].initialPayout`}
                                                                                    label="Initial Salary" variant="bordered"
                                                                                    type="number" value={String(formik?.values?.financeData[i]?.initialPayout)}
                                                                                    onChange={formik.handleChange}
                                                                                    startContent={
                                                                                        <div className="pointer-events-none flex items-center">
                                                                                            <span className="text-default-400 text-small">$</span>
                                                                                        </div>
                                                                                    }
                                                                                    isInvalid={isFormFieldValid(`financeData[${i}].initialPayout`)}
                                                                                    color={isFormFieldValid(`financeData[${i}].initialPayout`) ? "danger" : "success"}
                                                                                    errorMessage={getFormErrorMessage(`financeData[${i}].initialPayout`)}
                                                                                />
                                                                                <Input className="col-span-1"
                                                                                    name={`financeData[${i}].secondPayout`}
                                                                                    label="Mid-month Salary" variant="bordered"
                                                                                    type="number" value={String(formik?.values?.financeData[i]?.secondPayout)}
                                                                                    onChange={formik.handleChange}
                                                                                    startContent={
                                                                                        <div className="pointer-events-none flex items-center">
                                                                                            <span className="text-default-400 text-small">$</span>
                                                                                        </div>
                                                                                    }
                                                                                    isInvalid={isFormFieldValid(`financeData[${i}].secondPayout`)}
                                                                                    color={isFormFieldValid(`financeData[${i}].secondPayout`) ? "danger" : "success"}
                                                                                    errorMessage={getFormErrorMessage(`financeData[${i}].secondPayout`)}
                                                                                />
                                                                                <Input className="col-span-1"
                                                                                    name={`financeData[${i}].creditCardDue`}
                                                                                    label="Credit Card Due" variant="bordered"
                                                                                    type="number" value={String(formik?.values?.financeData[i]?.creditCardDue)}
                                                                                    onChange={formik.handleChange}
                                                                                    startContent={
                                                                                        <div className="pointer-events-none flex items-center">
                                                                                            <span className="text-default-400 text-small">$</span>
                                                                                        </div>
                                                                                    }
                                                                                    isInvalid={isFormFieldValid(`financeData[${i}].creditCardDue`)}
                                                                                    color={isFormFieldValid(`financeData[${i}].creditCardDue`) ? "danger" : "success"}
                                                                                    errorMessage={getFormErrorMessage(`financeData[${i}].creditCardDue`)}
                                                                                />
                                                                                <Input className="col-span-1"
                                                                                    name={`financeData[${i}].loanDue`}
                                                                                    label="Loan Due" variant="bordered"
                                                                                    type="number" value={String(formik?.values?.financeData[i]?.loanDue)}
                                                                                    onChange={formik.handleChange}
                                                                                    startContent={
                                                                                        <div className="pointer-events-none flex items-center">
                                                                                            <span className="text-default-400 text-small">$</span>
                                                                                        </div>
                                                                                    }
                                                                                    isInvalid={isFormFieldValid(`financeData[${i}].loanDue`)}
                                                                                    color={isFormFieldValid(`financeData[${i}].loanDue`) ? "danger" : "success"}
                                                                                    errorMessage={getFormErrorMessage(`financeData[${i}].loanDue`)}
                                                                                />
                                                                                <Input 
                                                                                    className="" 
                                                                                    name={`financeData[${i}].creditCardMinDue`}
                                                                                    label="Credit Card min due" variant="bordered"
                                                                                    type="number" 
                                                                                    value={String(formik?.values?.financeData[i]?.creditCardMinDue)}
                                                                                    onChange={formik.handleChange}
                                                                                    endContent={
                                                                                        <div className="pointer-events-none flex items-center">
                                                                                            <span className="text-default-400 text-small">$</span>
                                                                                        </div>
                                                                                    }
                                                                                    isInvalid={isFormFieldValid('creditCardMinDuePercentage')}
                                                                                    color={isFormFieldValid('creditCardMinDuePercentage') ? "danger" : "success"}
                                                                                    errorMessage={getFormErrorMessage('creditCardMinDuePercentage')}
                                                                                />
                                                                            </div>
                                                                        </AccordionItem>
                                                                    )
                                                                })}
                                                            </Accordion>


                                                        </div>)
                                                }}
                                            </FieldArray>
                                            <div className="w-full flex justify-end py-4 px-8">
                                                <Button type="submit" color="primary" isLoading={isButtonLoading}> Submit</Button>
                                            </div>

                                        </>
                                    </Form>
                                )
                            }}

                        </Formik>
                    )}





                </div>

            </div>
        </>
    )


}
export default AddUpdateSettings