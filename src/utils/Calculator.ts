const Calculator = {
    calculateInterest: (due: number, percentage: number, numberOfDays: number) => {
        return Math.round(due*numberOfDays*(0.22/365) * 100)/100
    },
    calculateMonth(play: number): number{
        if(play%2 == 0){
            return play/2;
        }else{
            return Math.ceil(play/2)
        }
    }
}

export default Calculator;