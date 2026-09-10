import api from "./axios"

export const logoutMutation = {
  mutationFn: async () => {
    await api.post('auth/logout')
  },
};

export const createAccountMutation = {
  mutationFn: async (accountData: { name: string, currency: string }) => {
    const res = await api.post('/accounts', accountData)
    return res.data
  } 
}