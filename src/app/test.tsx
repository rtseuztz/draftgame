'use client'
import { use } from "react";

export default function Test() {
    let res;
    res = use(fetch("http://localhost:3000/api/hello"))
    return (
        <div>hello</div>
    )
}