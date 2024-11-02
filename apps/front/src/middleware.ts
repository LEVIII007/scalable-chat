export { default } from "next-auth/middleware";

export const config = { matcher: ["/dashboard"] };
// export { auth as middleware } from "@/auth"