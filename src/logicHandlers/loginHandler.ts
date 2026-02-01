const API_BASE = "https://flexolutions-backend-dev.onrender.com";

export async function loginUser(
  username: string,
  password: string
) {
  const url = new URL(
    `${API_BASE}/users/authenticate_user_endpoint_users_login_post`
  );

  url.searchParams.append("username", username);
  url.searchParams.append("password", password);

  const response = await fetch(url.toString(), {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}