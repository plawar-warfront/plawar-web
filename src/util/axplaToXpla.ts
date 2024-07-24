import BigNumber from "bignumber.js"

const axplaToXpla = (axpla: string, fix?: number) => {
    return new BigNumber(axpla).dividedBy(10 ** 18).toFixed(fix || 2);
}


export default axplaToXpla