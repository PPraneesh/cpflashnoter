import Code from "./Code";
import { useState } from "react";
import Question from "./Question";

export default function Home() {
    const [question,setQuestion] = useState("Paste your question here...");
    const [code,setCode] = useState("// type your code...");
    return (<>
        <div>
        <h1>Home</h1>
        <p>Welcome to the Home page!</p>
        </div>
        <Question question={question} setQuestion={setQuestion}/>   
        <Code code={code} setCode={setCode}/>

        </>
    );
    }