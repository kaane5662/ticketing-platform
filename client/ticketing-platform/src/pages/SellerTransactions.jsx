import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function SellerTransactions(){
    const navigate = useNavigate()
    const [Transactions, setTransactions] = useState([
        { date: '2024-02-20', email: 'kaane0169@gmail.com', amount: '$1000', name: '1094230' },
        { date: '2024-02-21', email: 'ree@gmail.com', amount: '$500', name: '4095430' },
        // Add more transactions here
    ]   )

    const getTransactions = ()=>{
        axios.get(`${import.meta.env.VITE_SERVER}/seller/transactions`,{withCredentials: true}).then((response)=>{
            console.log(response.data)
            setTransactions(response.data || [])
        }).catch((error)=>{
            if( error.response.status == 401 || error.response.status == 403) navigate("/login", {replace:true})
            console.log(error)
        })
    }

    useEffect(()=>{
        getTransactions()
    },[])


    return(
        <main className="h-screen bg-primary justify-center flex text-secondary font-poppins">
            <div className=" flex flex-col gap-8 p-24 w-[70%]  ">
                <h1 className="text-5xl font-bold">Transactions</h1>
                {Transactions ?
                <table className="">
                    <thead>
                        <tr>
                            <th className="p-4  border-gray-200">Transaction Id</th>
                            <th className="p-4  border-gray-200">Purchase Date</th>
                            <th className="p-4  border-gray-200">Email</th>
                            <th className="p-4  border-gray-200">Ticket Id</th>
                            <th className="p-4  border-gray-200">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="rounded-lg text-center ">
                        {Transactions.map((transaction, index) => (
                            <tr key={index}>
                                <td className="p-4 border-y border-y-secondary border-opacity-25"> {transaction._id}</td>
                                <td className="p-4 border-y border-y-secondary border-opacity-25"> { new Date(transaction.order_date).toDateString()}</td>
                                <td className="p-4 border-y border-y-secondary border-opacity-25">{transaction.email}</td>
                                <td className="p-4 border-y border-y-secondary border-opacity-25">{transaction.ticket_id}</td>
                                <td className="p-4 border-y border-y-secondary border-opacity-25">${transaction.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>: <FontAwesomeIcon spin className="h-10 my-20" icon={faSpinner}></FontAwesomeIcon>
                }
            </div>
        </main>
    )
}