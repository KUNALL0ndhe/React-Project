import { useCallback, useEffect, useState ,useRef } from 'react'


function App() {

  const [length, setLength] = useState(8)
  const [includeNumber , setIncludeNumber] = useState(false);
  const [includesChar, setIncludesChar] = useState(false);
  const [password, setPassword ] = useState("");

  //use ref
  const passwordRef = useRef( null );

  const passwordGenerator = useCallback(() => {
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if (includeNumber) {
      str += "0123456789"
    };
    if (includesChar) {
      str += "!@#$%^&*-_+=[]{}~`"      
    };

   
  //  let passsec = '';
  //  for (let i = 1; i <= length; i++) {
  //   let randomIndex = window.crypto.randomInt(8, str.length);
  //   passsec += str.charAt(randomIndex);
    
  //  }
  // setPassword(passsec);
  
  let pass = '';
  for (let i = 1; i <= length; i++) {
      let char = Math.floor((Math.random() * str.length + 1))
      pass += str.charAt(char);
    }
    setPassword(pass);

  },[length, includeNumber, includesChar, setPassword] )

  const copyToClipboard = useCallback(()=> {
    passwordRef.current?.select()
    passwordRef.current?.setSelectionRange(3,9)
    window.navigator.clipboard.writeText(password)
  }, [password])

  useEffect(() => {
    passwordGenerator()
  }, [length, includeNumber, includesChar,passwordGenerator])
  return (
    <>
    <div className='text-white bg-gray-700 p-16 text-center text-4xl mt-8 m-5 rounded-md'>
      Password Generator
      </div>
      <div className='bg-orange-900 p-7 justify-center flex mx-8 rounded-lg mt-5'>
      <input 
      type='text'
      value={password}
      className='outline-none rounded-xl p-1 mr-2 w-full py-8 text-4xl text-center'
      placeholder='Password'
      readOnly
      ref={passwordRef}
      />
      <button 
      onClick={copyToClipboard}
      className='outline-none bg-blue-700 rounded-xl text-white px-9 py-0.9 shrink-0 hover:bg-blue-500 hover:text-2xl hover:duration-100 hover:text-gray-600'>
        Copy
      </button>

      <div className='flex text-sm gap-x-2'>
      <div className='flex items-center gap-x-1'>
        </div>
        <div>
      <input
        type='range'
        min={8}
        max={100}
        value={length}
        className='cursor-pointer '
        onChange={(e)=> {setLength(e.target.value)}}
        />
        <label className='text-2xl'>
          Length: {length}
        </label>
      </div>
      <div className='flex items-start '>
        <input type='checkbox'
        defaultChecked={includeNumber}
        id='includeNumber' 
        onChange={() => { setIncludeNumber((prev)=>  !prev)}}
        />
        <label htmlFor='includeNumber' className='text-2xl'>
          Number
        </label>
      </div>
      <div className='flex items-start '>
        <input type="checkbox"
        defaultChecked = {includesChar}
        id='IncludeChar'
        onChange={() => {setIncludesChar((prev) => !prev)}} />
        <label htmlFor="includechar" className='text-2xl'>
          Characteristic
        </label>

      </div>
      </div>
      
    </div>
    
    </>
  )
}

export default App
