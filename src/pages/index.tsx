import { useEffect, useState } from "react"
import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar } from "@nextui-org/react";
import { Card, CardHeader, CardBody, CardFooter, Button } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import Router from "next/router";
import Page1 from "@/component/page1";
import Page2 from "@/component/page2";
import Page3 from "@/component/page3";
import Page4 from "@/component/page4";
import Page5 from "@/component/page5";



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
  initalPayout: number
  secondPayout: number
  creditCardDue: number
  loanDue: number
}


const Settings = () => {

  const [page, setPage] = useState<number>(1)
  useEffect(() => {
    init()
  }, [])
  const init = async () => {

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
          <p className="font-bold text-inherit">Budget Genius </p>
        </NavbarBrand>
      </Navbar>
      <div className="w-full h-screen bg-white">
        <div className="w-full flex justify-center mx-9 px-8 py-5 text-black">
          <div className="w-2/3 rounded-md shadow-lg px-6 py-4 my-8">
          <h1 className="text-2xl font-semibold py-4">Budget Genius — The Economic Allocation Simulation</h1>
            {page === 1 && (
              <Page1 setPage={(page: number) => { setPage(page) }} />
            )}
             {page === 2 && (
              <Page2 setPage={(page: number) => { setPage(page) }} />
            )}
             {page === 3 && (
              <Page3 setPage={(page: number) => { setPage(page) }} />
            )}
             {page === 4 && (
              <Page4 setPage={(page: number) => { setPage(page) }} />
            )}
            {page === 5 && (
              <Page5 setPage={(page: number) => { setPage(page) }} />
            )}
          </div>
        </div>

      </div>
    </>
  )


}
export default Settings