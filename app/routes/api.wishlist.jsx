import { json } from "@remix-run/react";

export async function loader () {
 return json({
    status: 200
 })   
} 