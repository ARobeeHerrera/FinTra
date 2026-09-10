import api from "./axios"

export const meQueryOptions = {
  queryKey: ['me'],
  queryFn: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  retry: false
};

export const accountQueryOptions = {
  queryKey: ['accounts'],
  queryFn: async () => {
    const res = await api.get('/accounts/me')
    return res.data 
  },
  retry: false
}
