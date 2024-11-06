export function playerLost(): boolean {
    const rand = Math.random();
    if(rand > 0.9999){
        console.log("lose")

    }
    return rand > 0.9999;
}