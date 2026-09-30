import { apiUrl } from "@/constant";
import apiFetch from "@/utils/api";

export default async function getCurrentUser() {
    const response = await apiFetch(`${apiUrl}/me`);

    const data = await response.json();

    if (!response.ok) {
        throw new Error("Error");
    }

    return data;
}
