import StorageService from "@/services/StorageService"
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react"
import Router from "next/router"
import { useState } from "react"
import VerificationInput from "react-verification-input"
import { ADMIN_AUTH_CODE, USER_AUTH_CODE } from "../../../AppConstatnt"

const Authenticate = () => {

    const [token, setToken] = useState<string>("")

    const authenticate = () => {
        try {
            StorageService.login(token)
            if (token == ADMIN_AUTH_CODE) {
                Router.push("/admin")
            } else if (token == USER_AUTH_CODE) {
                Router.push("/")
            } else {
                alert("Invalid passcode.")
            }
        } catch (error) {
            alert(error)
            setToken("")
        }
    }
    return (
        <div className="flex justify-center my-auto">
            <Card className="mt-32 p-4">
                <CardBody>
                    <CardHeader className="text-center">
                        <div className="flex w-full justify-center">
                            <svg fill="none" height="70" viewBox="0 0 32 32" width="70">
                                <path
                                    clipRule="evenodd"
                                    d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                />
                            </svg>
                            <p className="font-bold text-inherit my-auto text-lg">Budget Genius</p>
                        </div>
                    </CardHeader>
                    <label className="mt-4 text-center">Please enter authentication code</label>
                    <VerificationInput value={token} onChange={setToken} classNames={{ container: "mt-4" }} validChars="0-9" inputProps={{ inputMode: "numeric" }} />
                    <Button onClick={authenticate} className="mt-8" color="primary">Proceed</Button>
                </CardBody>
            </Card>
        </div>
    )
}

export default Authenticate