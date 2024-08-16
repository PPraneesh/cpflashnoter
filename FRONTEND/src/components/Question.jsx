/* eslint-disable react/prop-types */
export default function Question(props) {
  return (
    <>
      <div>
        <h2>Question</h2>
        <p>Paste your question</p>
        <textarea name="" id="" onChange={(value)=>{
            props.setQuestion(value.target.value)
        }} ></textarea>
      </div>
    </>
  );
}