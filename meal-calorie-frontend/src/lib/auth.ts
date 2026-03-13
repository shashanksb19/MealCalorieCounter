let _token: string | null = null

export const setApiToken = (token: string | null): void => {
  _token = token
}

export const getApiToken = (): string | null => {
  return _token
}

export const clearApiToken = (): void => {
  _token = null
}