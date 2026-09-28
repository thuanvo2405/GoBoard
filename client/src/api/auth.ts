import { apiUrl } from "@/constant";

export type SignUpPayload = {
  email: string;
  password: string;
};

export async function postSignUp(payload: SignUpPayload) {
  console.log(`${apiUrl}/users`);
  const response = await fetch(`${apiUrl}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to create account");
  }

  return response.json();
}
