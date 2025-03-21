import { FinanceDatum, MasterInformation, Transaction, UserTransaction } from "@/models/Transaction";
import Calculator from "@/utils/Calculator";
import { GlobalDataService } from "./globalDataService";

class Service{

    masterData?: MasterInformation = {}

    userTransactions?: UserTransaction[] = []

    isGraceEnabled = Math.round(Math.random()) == 0 ? false : true

    constructor(){
        if(this.isGraceEnabled){
            console.log("You are a grace candidate.")
        }else{
            console.log("You are non-grace candidate.")
        }
    }

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

    getPreviousMonthLoanInterest(month: number, forCalculation: boolean = true): number {
        const pmt = this.getPreviousMonthTransaction(month)
        const pmfd = this.getPreviousFinanceData(month)

        let interest = this.masterData?.loanAPR
        let penaltyApr = this.masterData?.loanPenaltyAPR
        let apr = this.masterData?.loanAPR
        // No grace period on loan
        // if((month == 6) && this.isGraceEnabled && forCalculation){
        //     interest = 0
        //     return 0;
        // }

        if((pmt?.loanAllocation ?? 0) < (pmfd?.loanMinDue ?? 0))
            return Calculator.calculateInterest(
                this.getPreviousMonthTransaction(month)?.loanDue ?? 0,
                penaltyApr ?? 0,
                15
            )
        else if(((pmt?.loanAllocation ?? 0) < (this.getPreviousMonthTransaction(month)?.loanDue ?? 0) && month%2 != 0))
            return Calculator.calculateInterest(
                (this.getPreviousMonthTransaction(month)?.loanDue ?? 0) - (pmt?.loanAllocation ?? 0),
                apr ?? 0,
                15
            )
        return Calculator.calculateInterest(
            this.getPreviousMonthTransaction(month)?.loanDue ?? 0,
            interest ?? 0,
            15
        )
    }

    getPreviousMonthCreditCardInterest(month: number, forCalculation: boolean = true): number {
        const pmt = this.getPreviousMonthTransaction(month)
        const pmfd = this.getPreviousFinanceData(month)

        let interest = this.masterData?.creditCardAPR
        let penaltyApr = this.masterData?.creditCardPenaltyAPR
        let apr = this.masterData?.creditCardAPR
        if((month == 6) && this.isGraceEnabled && forCalculation){
            interest = 0
            return 0;
        }

        if((pmt?.creditCardAllocation ?? 0) < (pmfd?.creditCardMinDue ?? 0))
            return Calculator.calculateInterest(
                this.getPreviousMonthTransaction(month)?.creditCardDue ?? 0,
                penaltyApr ?? 0,
                15
            )
        else if(((pmt?.creditCardAllocation ?? 0) < (this.getPreviousMonthTransaction(month)?.creditCardDue ?? 0) && month%2 != 0))
            return Calculator.calculateInterest(
                (this.getPreviousMonthTransaction(month)?.creditCardDue ?? 0) - (pmt?.creditCardAllocation ?? 0),
                apr ?? 0,
                15
            )
        return Calculator.calculateInterest(
            this.getPreviousMonthTransaction(month)?.creditCardDue ?? 0,
            interest ?? 0,
            15
        )
    }

    getPreviousMonthCreditCardLateFee(month: number, forCalculation: boolean = true): number {
        const pmt = this.getPreviousMonthTransaction(month)
        const pmfd = this.getPreviousFinanceData(month)

        if((month == 6) && this.isGraceEnabled && forCalculation){
            return 0;
        }

        if((pmt?.creditCardAllocation ?? 0) < (pmfd?.creditCardMinDue ?? 0))
            return this.masterData?.creditCardLateFee ?? 0
        return 0
    }

    getPreviousMonthLoanLateFee(month: number, forCalculation: boolean = true): number {
        const pmt = this.getPreviousMonthTransaction(month)
        const pmfd = this.getPreviousFinanceData(month)

        // No grace on loan
        // if((month == 6) && this.isGraceEnabled && forCalculation){
        //     return 0;
        // }

        if((pmt?.loanAllocation ?? 0) < (pmfd?.loanMinDue ?? 0))
            return this.masterData?.loanLateFee ?? 0
        return 0
    }

    setCurrentMonthTransaction(data: UserTransaction){
        this.userTransactions?.push(data)
        console.log(this.userTransactions)
    }

    getPreviousMonthTotalBalanceDue(month: number): number {
        return Math.round(((this.getPreviousMonthTransaction(month)?.creditCardDue ?? 0) + 
        (CacheService.getPreviousMonthTransaction(month)?.loanDue ?? 0) +
        this.getPreviousMonthLoanInterest(month) + 
        this.getPreviousMonthCreditCardInterest(month)+
        this.getPreviousMonthCreditCardLateFee(month)+
        this.getPreviousMonthLoanLateFee(month))*100)/100
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