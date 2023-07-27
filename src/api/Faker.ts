export const FakeNetwork = () => {
  return new Promise((res) => {
    setTimeout(res, Math.random() * 1200)
  })
}
