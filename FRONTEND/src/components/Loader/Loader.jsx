import "./Loader.css";

const Loader = () => {
  return (
  <div className="w-full h-full flex justify-center items-center">
      <div className="loader">
    <div className="square" ></div>
    <div className="square"></div>
    <div className="square last"></div>
    <div className="square clear"></div>
    <div className="square"></div>
    <div className="square last"></div>
    <div className="square clear"></div>
    <div className="square "></div>
    <div className="square last"></div>
    </div>
  </div>
  );
};

export default Loader;
