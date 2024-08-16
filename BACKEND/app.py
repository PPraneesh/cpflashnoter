from langchain_groq import ChatGroq
from typing_extensions import Annotated, TypedDict
from typing import List
import os

llm = ChatGroq(model="llama-3.1-70b-versatile", groq_api_key="api_key")

class CodeSubunit(TypedDict):
    """Represents a subunit of code."""
    name: Annotated[str, ..., "The name of the subunit"]
    content: Annotated[str, ..., "The actual code content of the subunit"]
    description: Annotated[str, ..., "A detailed description of what this subunit does and how it's related to the question and the overall code"]

class Code(TypedDict):
    """Represents a complete code structure composed of subunits."""
    title: Annotated[str, ..., "The title or name of the complete code"]
    language: Annotated[str, ..., "The programming language used"]
    subunits: Annotated[List[CodeSubunit], ..., "An array of code subunits that together make up the full code"]
    description: Annotated[str, ..., "Overall description of what the code does and how it solves the problem"]

structured_llm = llm.with_structured_output(Code)

small_code = """
#include <bits/stdc++.h>
using namespace std;

bool valid(vector<int> &arr,int n,int w,int mid){
    int par=1;
    int pt =0;
    for(int i=1;i<n;i++){
        if((arr[i]-arr[pt])>=mid){
            par++;
            pt=i;
        }
    }
    return par<w;
}

int mainLogic(vector<int> &arr,int n,int w,int ma,int mi){
    int ans =INT_MIN;
    while(mi<=ma){
        int mid = (ma+mi)/2;
        if(valid(arr,n,w,mid)){
            ma = mid-1;
        }else{
            ans = max(mid,ans);
            mi = mid+1;
        }
    }
    return ans;
}
int main() {
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */ 
    int test;
    cin>>test;
    while(test--){
        int n,w;
        cin>>n>>w;
        vector<int> arr(n);
        int mi =INT_MAX;
        int ma = INT_MIN;
        for(int i=0;i<n;i++){
            cin>>arr[i];
            ma = max(ma,arr[i]);
            mi = min(mi,arr[i]);
        }
        sort(arr.begin(),arr.end());
        int diff =-1;
        for(int i=1;i<n;i++){
            diff = min(arr[i]-arr[i-1],diff);
        }
        cout<<mainLogic(arr,n,w,ma-mi,diff)<<endl;

    }  
    return 0;
}
"""
question = """
Protective Villagers 
In a remote village, there is a new long marketplace with N stalls, all lined up along a straight path at positions x1, x2, x3,..., xN. A group of villagers, represented by C individuals, are highly protective of their personal space and tend to get into disputes when placed too close to one another. To maintain peace, the village leader wants to allocate the villagers to these stalls in a way that maximizes the minimum distance between any two of them.

Input Format:
The first line of input contains T - the number of test cases. It is followed by 2T lines, the first line contains 2 space-separated integers - N and C. The second contains N integers, where ith integer denotes xi, the location of the ith stall.

Output Format:
For each test case, print the largest minimum distance possible, separated by a new line.
"""
prompt = f"""
The following is a question from a competitive programming platform:
{question}

Analyze the following code and provide a structured breakdown:

{small_code}

Please provide the following information:
1. A title for this code snippet
2. Break down the code into logical subunits, providing for each:
   - A name for the subunit
   - The actual code content of the subunit
   - A detailed description of what the subunit does and how it's related to the question and the overall code
3. An overall description of what the entire code does

Format your response to match the Code structure defined earlier.
"""

try:
    response = structured_llm.invoke(prompt)
    print(response)
except Exception as e:
    print(f"An error occurred: {e}")