import { useEffect, useState } from "react"
import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Spinner } from "@nextui-org/react";
import { Card, CardHeader, CardBody, CardFooter, Button } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import Router from "next/router";
import { GlobalDataService } from "@/services/globalDataService";
import Calculator from "@/utils/Calculator";

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
    creditCardMinDue: number
    loanDue: number
}


const Settings = () => {

    const [data, setData] = useState<Settings>()
    const [isAdd, setIsAdd] = useState<boolean>(false)
    const [isPageLoading, setIsPageLoading] = useState<boolean>(false)

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
            setData(res?.data)


        }
        catch (e) {
            console.log(e)
        }
        setIsPageLoading(false)
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



            <div className="w-full h-screen bg-white">
                <div className="flex items-center justify-between border border-b-1 shadow-md py-4">
                    <div className="min-w-0 flex-1">
                        <h2 className="py-2 pl-9 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Settings        </h2>

                    </div>
                    <div className="mt-5 pr-9 flex lg:ml-4 lg:mt-0">
                        <Button color="primary" size="sm" onClick={() => {
                            Router?.push('/admin/settings/update')
                        }}>
                            + Add/Update
                        </Button>


                    </div>
                </div>
                <div className="mx-9 my-2 text-black">
                    {isPageLoading ? (
                        <div className="flex justify-center mt-8">
                            <Spinner label="Loading..." color="primary" />
                        </div>
                    ) : (
                        <>
                            {data === null ? (
                                <div>
                                    No Data found Please Add...
                                </div>
                            ) : (
                                <>
                                    <div className="md:flex w-full justify-between px-2 md:px-8">
                                        <div className="w-full md:w-1/2">
                                            <div className="grid grid-cols-3 pt-1">
                                                <label className="col-span-2 font-semibold">Credit Card late fee</label>
                                                <label className="col-span-1">{`$ ${data?.creditCardLateFee}`}</label>
                                            </div>
                                            <div className="grid grid-cols-3 pt-1">
                                                <label className="col-span-2 font-semibold">Credit Card APR(%)</label>
                                                <label className="col-span-1">{`${data?.creditCardAPR} %`}</label>
                                            </div>
                                            <div className="grid grid-cols-3 pt-1">
                                                <label className="col-span-2 font-semibold">Credit Card Penalty-APR</label>
                                                <label className="col-span-1">{`$ ${data?.creditCardPenaltyAPR} `}</label>
                                            </div>

                                        </div>
                                        <div className="w-full md:w-1/2">
                                            <div className="grid grid-cols-3 pt-1">
                                                <label className="col-span-2 font-semibold">Loan late fee</label>
                                                <label className="col-span-1">{`$ ${data?.loanLateFee} `}</label>
                                            </div>
                                            <div className="grid grid-cols-3 pt-1">
                                                <label className="col-span-2 font-semibold">Loan APR</label>
                                                <label className="col-span-1">{`$ ${data?.loanAPR}`}</label>
                                            </div>

                                            <div className="grid grid-cols-3 pt-1">
                                                <label className="col-span-2 font-semibold">Loan Penalty-APR</label>
                                                <label className="col-span-1">{`$ ${data?.loanPenaltyAPR} `}</label>
                                            </div>

                                        </div>

                                    </div>
                                    <div className="mx-5 w-full md:w-1/2 mt-4">
                                        <h4 className="px-2 py-4 text-2xl font-semibold">
                                            Finacial Data
                                        </h4>
                                        {data?.financeData?.map((each, index) => {
                                            return (
                                                <Card className="mb-2" key={index} aria-label={`Month-${each?.sequenceNumber}`}>
                                                    <CardHeader>
                                                        {`${each?.sequenceNumber % 2 == 0 ? 'Mid' : 'Begining'} of Month ${Calculator.calculateMonth(each?.sequenceNumber)}`}
                                                    </CardHeader>
                                                    <CardBody>
                                                        <div className="w-full md:w-1/2">
                                                            <div className="grid grid-cols-3 pt-1">
                                                                <label className="col-span-2 font-semibold">Initial Salary</label>
                                                                <label className="col-span-1">{`${each?.initialPayout}`}</label>
                                                            </div>
                                                            <div className="grid grid-cols-3 pt-1">
                                                                <label className="col-span-2 font-semibold">Mid-month Salary</label>
                                                                <label className="col-span-1">{`${each?.secondPayout}`}</label>
                                                            </div>
                                                            <div className="grid grid-cols-3 pt-1">
                                                                <label className="col-span-2 font-semibold">Credit Card Due</label>
                                                                <label className="col-span-1">{`${each?.creditCardDue}`}</label>
                                                            </div>
                                                            <div className="grid grid-cols-3 pt-1">
                                                                <label className="col-span-2 font-semibold">Credit Card Min Due</label>
                                                                <label className="col-span-1">{`${each?.creditCardMinDue} `}</label>
                                                            </div>
                                                            <div className="grid grid-cols-3 pt-1">
                                                                <label className="col-span-2 font-semibold">Loan Due</label>
                                                                <label className="col-span-1">{`${each?.loanDue} `}</label>
                                                            </div>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </>
                            )}
                        </>
                    )}

                </div>

            </div>
        </>
    )


}
export default Settings