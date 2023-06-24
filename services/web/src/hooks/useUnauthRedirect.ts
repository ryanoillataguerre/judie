import { useRouter } from "next/router"
import { useEffect } from "react"
import useAuth from "./useAuth"

const REDIRECT_FROM_PATHS = ["/signin", "/signup"]
export default () => {
    const router = useRouter()
    const auth = useAuth()
    useEffect(() => {
        if (auth.userData && REDIRECT_FROM_PATHS.includes(router.pathname)) {
            router.push("/chat")
        }
        if (router.pathname === "/") {
            if (!auth.userData && !auth.isLoading) {
                router.push("/signin")
            }
            if (auth.userData) {
                router.push("/chat")
            }
        }
        if (["/signin", "/signup"].includes(router.pathname)) {
            if (auth.userData) {
                router.push("/chat")
            }
        }
    }, [auth, router]);
}