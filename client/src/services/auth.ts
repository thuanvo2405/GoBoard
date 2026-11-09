import { apiUrl } from "@/constant";
import apiFetch from "@/utils/api";

type UserPayload = {
    name: string;
    email: string;
    password: string;
};

export type SignUpPayload = UserPayload;

export type SignInPayload = Pick<UserPayload, "email" | "password">;

export async function postSignUp(payload: SignUpPayload) {
    const response = await apiFetch(`${apiUrl}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error.email || "Failed to create account");
    }

    return data;
}

export async function postSignIn(payload: SignInPayload) {
    const response = await apiFetch(`${apiUrl}/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log(response);

    if (!response.ok) {
        if (response.status == 401) {
            throw new Error("Your password or email is incorrect");
        } else {
            throw new Error("Something went wrong trying to later");
        }
    }

    return data;
}

export async function postLogout() {
    const response = await apiFetch(`${apiUrl}/logout`, {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error("Something went wrong trying to logout");
    }
}
