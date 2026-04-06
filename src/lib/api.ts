const API = import.meta.env.VITE_API_URL;

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const getMe = async (token: string) => {
  const res = await fetch(`${API}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};