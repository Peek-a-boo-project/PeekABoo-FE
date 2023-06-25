import Lottie from "lottie-react";
import LoadingLottie from "./LoadingLottie.json"
export default function LoadingScreen(){
    return ( 
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <Lottie animationData = {LoadingLottie}/>
        </div>
    )
}