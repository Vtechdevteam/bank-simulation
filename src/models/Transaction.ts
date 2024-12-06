export interface Transaction {
    userFirstName?:     string;
    userLastName?:      string;
    userIPAddress?:     string;
    masterInformation?: MasterInformation;
    userTransactions?:  UserTransaction[];
}

export interface MasterInformation {
    numberOfMonths?:             number;
    creditCardLateFee?:          number;
    creditCardAPR?:              number;
    creditCardPenaltyAPR?:       number;
    loanLateFee?:                number;
    loanAPR?:                    number;
    loanPenaltyAPR?:             number;
    financeData?:                FinanceDatum[];
    surveyName?:                 string;
}

export interface FinanceDatum {
    sequenceNumber?: number;
    initialPayout?:   number;
    creditCardDue?:  number;
    loanDue?:        number;
    creditCardMinDue?: number;
    loanMinDue?: number;
    secondPayout? :number
}

export interface UserTransaction {
    sequenceNumber?:       number;
    creditCardAllocation?: number;
    creditCardDue?:        number;
    loanAllocation?:       number;
    loanDue?:              number;
    savings?:              number;
    creditCardAPR?:        number;
    loanAPR?:              number;
    creditCardPenaltyAPR?: number;
    loanPenaltyAPR?:       number;
}
