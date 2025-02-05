const {ChatAnthropic} = require('@langchain/anthropic')

const model = new ChatAnthropic(
    api_key = process.env.ANTHROPIC_API_KEY,
    model = "Claude-3.5-Sonnet-20241022"
)

const codeFlowAgent = async(question,code) => {
    const prompt = ``` You are an expert DSA tutor and Competetive Programmer. You are expert in tracing a code and helping students to understand how the code works step by step. You are explaining the control flow through a code. Now, your task is to help the student understand the control flow of the following:
    <Question>
    ${question}
    </Question>
    <Code>
    ${code}
    </Code>    
```
    const response = await model.generate(prompt)
    return response
}

const conceptExplainerAgent = async(question,code) => {
    const prompt = ``` You are an expert DSA tutor and Competetive Programmer. You are expert in explaining how the DSA concepts used in the code are applied to solve the question. You are explaining the application concept of the following:
    <Question>
    ${question}
    </Question>
    <Code>
    ${code}
    </Code>
```
    const response = await model.generate(prompt)
    return response
}

const misclleanousAgent = async(question,code) => {
    
}