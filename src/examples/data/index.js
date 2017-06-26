export const basicItems = Array.from(Array(100).keys()).map((num) => {
  return {
    id: num,
    text: `Row ${num}`
  }
})
