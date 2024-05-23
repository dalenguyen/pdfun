export const getNextDays = (currentDate = new Date(), daysToAdd = 1) => {
    const nextDate = new Date(currentDate)
    nextDate.setDate(currentDate.getDate() + daysToAdd)
    return nextDate
}