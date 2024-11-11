import { useState } from "react"

function App() {

  const [color, setColor] = useState("pink")

  return (
    <>
    <div className="justify-center flex py-10 font-bold text-xl">
      BackGround Color Changer
    </div>
      <div className="h-screen w-full duration-200" 
            style={{backgroundColor: color}}
            >
        <div className=" fixed bottom-12 inset-x-0 px-2 left-10 right-10 py-10 bg-amber-200 rounded-3xl justify-center flex flex-wrap gap-11">
          <button className=" text-lg p-4 bg-red-500 text-cyan-50 rounded-full outline-red-500" onClick={() => setColor('red')}>
            Red
          </button>
          <button className=" text-lg p-4 bg-green-500 text-cyan-50 rounded-full outline-red-500" onClick={() => setColor('green')}>
            Green
          </button>
          <button className=" text-lg p-4 bg-blue-500 text-cyan-50 rounded-full outline-red-500" onClick={() => setColor('Blue')}>
            Blue
          </button>
          <button className=" text-lg p-4 bg-yellow-500 text-cyan-50 rounded-full outline-red-500" onClick={() => setColor('Yellow')}>
            Yellow
          </button>
          <button className=" text-lg p-4 bg-purple-500 text-cyan-50 rounded-full outline-red-500" onClick={() => setColor('Purple')}>
            Purple
          </button>
          <button className=" text-lg p-4 bg-orange-500 text-cyan-50 rounded-full outline-red-500" onClick={() => setColor('orange')}>
            Orange
          </button>
          <button className=" text-lg p-4 bg-gray-500 text-cyan-50 rounded-full outline-red-500" onClick={() => setColor('Gray')}>
            Gray
          </button>
        </div>
      </div>
    </>
  )
}

export default App
