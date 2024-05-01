const Calculator = {
    calculateInterest: (due: number, percentage: number, numberOfDays: number) => {
        const interest = due*numberOfDays*(percentage*0.01/365)
        return Math.round(interest * 100)/100
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