import commandExists from 'command-exists'

test('environment variable was set correctly', () => {
  const token = process.env.FIREBASE_TOKEN

  expect(token).not.toBeUndefined()
  expect(token).not.toBeNull()
  expect(token).toBe('banana')
})

test('firebase tools cli is installed', async () => {
  expect(await commandExists('firebase')).toBe('firebase')
})
