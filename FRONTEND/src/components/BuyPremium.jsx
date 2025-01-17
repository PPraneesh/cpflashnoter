import { useContext } from "react"
import { UserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import paymentHandlerOneTime from "../utils/payment"

export default function BuyPremium() {
    const { userData } = useContext(UserContext);
    const navigate = useNavigate();
   return(<>
    {userData.tier !== "premium" && 
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/20 rounded-xl p-6 my-8">
         <div className="flex items-center justify-between">
             <div className="mr-4">
                 <h3 className="text-lg font-medium text-white mb-2">Upgrade to Premium</h3>
                 <p className="text-neutral-300">Get unlimited generations, revisions, and prep sessions for just ₹50/month</p>
             </div>
             <button className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors" onClick={()=>{paymentHandlerOneTime({email:"parshipraneesh8@gmail.com"},navigate)}}>
                 Upgrade Now
             </button>
             </div>
         </div>}
         </>
   ) 
}