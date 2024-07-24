const getWarTime = (warMin: number, truceMin: number, startTime: string) => {
    const [yearMonthDate, time] = startTime.split(' ');
    const [year, month, date] = yearMonthDate.split('-');
    const [hour, minute, second] = time.split(':');

    const startTimedate = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(date, 10), parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10)));
    const now = new Date();
    const secDiff = ((now.getTime() - startTimedate.getTime()) / (1000));

    const round_min = warMin + truceMin;
    const remainder =  Math.floor(secDiff % (round_min * 60));
    return remainder;
}
export default getWarTime;

