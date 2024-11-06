export class BalanceManager {
    private currentGameCoinBalance: number = 0;
    private currentGameFlashBalance: number = 0;
    private globalCoinBalance!:number;
    private globalFlashBalance!:number;
    public isCashout:boolean = false;

    constructor(initialGlobalCoins:number, initialGlobalFlashes:number){
        this.globalCoinBalance = initialGlobalCoins;
        this.globalFlashBalance = initialGlobalFlashes;
    }

    public setCashout() {
        this.isCashout = true;
    }

    public resetCashout() {
        this.isCashout = false;
    }

    getCoinBalance() {
        return this.currentGameCoinBalance;
    }

    getFlashBalance() {
        return this.currentGameFlashBalance;
    }

    getGlobalCoinBalance() {
        return this.globalCoinBalance;
    }

    getGlobalFlashBalance() {
        return this.globalFlashBalance;
    }

    addToGlobalCoinBalance(amount: number) {
        this.globalCoinBalance += amount;
    }

    addToGlobalFlashBalance(amount: number) {
        this.globalFlashBalance += amount;
    }

    updateGameCoinBalance(amount: number) {
        this.currentGameCoinBalance += amount;
    }

    updateGameFlashBalance(amount: number) {
        this.currentGameFlashBalance += amount;
    }

    updateGlobalCoinBalance(amount: number) {
        this.globalCoinBalance += amount;
    }

    updateGlobalFlashBalance(amount: number) {
        this.globalFlashBalance += amount;
    }

    resetCurrentGameBalances() {
        this.currentGameCoinBalance = 0;
        this.currentGameFlashBalance = 0;
        console.log(this.currentGameCoinBalance)
    }
}
