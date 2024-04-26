import { FinanceDatum, MasterInformation, Transaction, UserTransaction } from "@/models/Transaction";
import Calculator from "@/utils/Calculator";
import { GlobalDataService } from "./globalDataService";

class Service{

    masterData?: MasterInformation = {}

    userTransactions?: UserTransaction[] = []

    // constructor(){
    //     // this.masterData = {
    //     //     "numberOfMonths": 3,
    //     //     "creditCardLateFee": 10,
    //     //     "creditCardAPR": 10,
    //     //     "creditCardPenaltyAPR": 10,
    //     //     "loanLateFee": 10,
    //     //     "loanAPR": 10,
    //     //     "loanPenaltyAPR": 10,
    //     //     "financeData": [
    //     //         {
    //     //             "sequenceNumber": 1,
    //     //             "initialPayout": 1500,
    //     //             "creditCardDue": 600,
    //     //             "loanDue": 600,
    //     //             "creditCardMinDue": 10
    //     //         },
    //     //         {
    //     //             "sequenceNumber": 2,
    //     //             "initialPayout": 1000,
    //     //             "creditCardDue": 0,
    //     //             "loanDue": 0,
    //     //             "creditCardMinDue": 0
    //     //         },
    //     //         {
    //     //             "sequenceNumber": 3,
    //     //             "initialPayout": 2500,
    //     //             "creditCardDue": 1000,
    //     //             "loanDue": 600,
    //     //             "creditCardMinDue": 10
    //     //         },
    //     //         {
    //     //             "sequenceNumber": 4,
    //     //             "initialPayout": 2000,
    //     //             "creditCardDue": 0,
    //     //             "loanDue": 0,
    //     //             "creditCardMinDue": 0
    //     //         },
    //     //     ]
    //     // }
    //     this.fetch()
    // }

    async fetch(){
        const md = await GlobalDataService.getGlobalDataData();
        this.masterData = md?.data
        console.log("MD", this.masterData)
    }

    getCurrentFinanceData(month: number): FinanceDatum | undefined {
        return this.masterData?.financeData?.find(e => e.sequenceNumber == month)
    }

    getPreviousFinanceData(month: number): FinanceDatum | undefined {
        return this.masterData?.financeData?.find(e => e.sequenceNumber == (month - 1))
    }

    getCurrentMonthTransaction(month: number): UserTransaction | undefined {
        return this.userTransactions?.find(e => e.sequenceNumber == month)
    }

    getPreviousMonthTransaction(month: number): UserTransaction | undefined {
        return this.userTransactions?.find(e => e.sequenceNumber == (month - 1))
    }

    getPreviousMonthLoanInterest(month: number): number {
        return Calculator.calculateInterest(
            this.getPreviousMonthTransaction(month)?.loanDue ?? 0,
            this.masterData?.loanAPR ?? 0,
            15
        )
    }

    getPreviousMonthCreditCardInterest(month: number): number {
        const pmt = this.getPreviousMonthTransaction(month)
        const pmfd = this.getCurrentFinanceData(month)
        if((pmt?.creditCardAllocation ?? 0) < (pmfd?.creditCardMinDue ?? 0))
            return Calculator.calculateInterest(
                this.getPreviousMonthTransaction(month)?.creditCardDue ?? 0,
                this.masterData?.creditCardPenaltyAPR ?? 0,
                15
            )
        return Calculator.calculateInterest(
            this.getPreviousMonthTransaction(month)?.creditCardDue ?? 0,
            this.masterData?.creditCardAPR ?? 0,
            15
        )
    }

    setCurrentMonthTransaction(data: UserTransaction){
        this.userTransactions?.push(data)
        console.log(this.userTransactions)
    }

    getPreviousMonthTotalBalanceDue(month: number): number {
        return Math.round(((this.getPreviousMonthTransaction(month)?.creditCardDue ?? 0) + 
        (CacheService.getPreviousMonthTransaction(month)?.loanDue ?? 0) +
        this.getPreviousMonthLoanInterest(month) + 
        this.getPreviousMonthCreditCardInterest(month))*100)/100
    }

    getCurrentMonthCreditCardAndLoanBalanceDue(month: number) {
        return Math.round((
            (this.getCurrentFinanceData(month)?.loanDue ?? 0) +
            (this.getCurrentFinanceData(month)?.creditCardDue ?? 0)
        )*100)/100
    }
}
const CacheService = new Service()
export default CacheService;