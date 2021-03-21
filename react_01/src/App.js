import secHandIMG from './sec.png';
import minHandIMG from './min.png';
import hourHandIMG from './hour.png';
import tabloIMG from './tablo.png';
import React, { Component, useState, useEffect } from 'react'
import './App.css'
// import Header from './components/Header';
// import Navbar from './components/Navbar';
// import Profile from './components/Profile';

const Input = () => {
  const [value, setValue] = useState('asdf')
  return (
  <>  
     <input value={value} onChange={e => setValue(e.target.value)}/>
     <p>{value.toUpperCase()}</p>
  </>
  )
}

const Spoiler = ({children, header:Header}) => {
  const [show, setShow] = useState(true)
  return (
    <>
      <Header onClick={() => setShow(!show)}/>
      {show && children}
    </>
  )
}


const LoginForm = ({startLogin='', startPassword='', onLogin}) => {
  const [login, setLogin] = useState(startLogin)
  const [password, setPassword] = useState(startPassword)


  return (
      <div className='LoginForm'>
          <input placeholder='Login' value={login} 
                                     onChange={e => setLogin(e.target.value)}/>
          <input placeholder='Password' type='password' value={password} 
                                     onChange={e => setPassword(e.target.value)} />
          <button disabled={!login || !password}
                  onClick={() => onLogin(login, password)}
                  >Login {login && `as ${login}`}</button>
      </div>
  )
}





const RangeInput = ({min=2,max=10}) => {
  const [value, setValue] = useState('')
  function LenghtOfColor(el) {
    if(value.length < min || value.length >= max ){
      el.style.backgroundColor='red'
    }
    else{
      el.style.backgroundColor=''
    }
  }
  return (
  <>  
     <input value={value} onChange={e => {
       LenghtOfColor(e.target)
       setValue(e.target.value)}}/>
     
  </>
  )
}


const PasswordConfirm = ({min=3}) => {
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState("")
  return (
    <>
    <input value={password} type = 'password' placeholder='Password' onChange={e => {
      /\d/.test(password) ? console.log('есть числа') : console.log("нет чисел")
      // password.length <= min ? e.target.style.backgroundColor='red' : e.target.style.backgroundColor=''
      setPassword(e.target.value)}}/>
    <input type='password' placeholder='ConfirmPassword' value = {passwordConfirm} onChange = { e => {setPasswordConfirm(e.target.value)}}/>
    <button disabled = {password !== passwordConfirm || password.length <= min || password.length === "" }>Submit</button>
    <br/>
    <br/>
    </>
  )
}

let stop = true;

const Timer = ({seconds}) => {
// const [counter, setCounter] = useState(sec) 


const padTime = time => {
  return String(time).length === 1 ? `0${time}` : `${time}`;
};

const format = time => {
  
  const seconds = time % 60;
  const minutes = (Math.floor(time / 60)) % 60;
  const hours = Math.floor(time/(60*60))
  return `${hours}:${minutes}:${padTime(seconds)}`;
};



// const tick = () => {
//   if(!pause && counter !== 0){
//           setCounter(counter-1)
//   }
// }     
// setTimeout(tick, 1000)

  return(
    <>
    <div className = {"container-fluid align-items-center  display-1"} >{format(seconds)}</div>
    </>
  )
}

const Watch = ({seconds = 57656}) => {
  const [sec,setSec] = useState((seconds%60)*6)
  const [min,setMin] = useState((Math.floor(seconds / 60)%60)*6)
  const [hour,setHour] = useState((Math.floor(seconds / 3600)%24)*30)
  setTimeout(()=>{
    if(sec === 360){
      setSec(0)

      if(min === 360)
      {
        setMin(0)
        setHour(hour+6)
      }
      else{
        setMin(min+6)
      }
    }
    else{
      setSec(sec + 6)
    }
  },1000)
  return(
    <>
    <div className = {'clock'}>
      <img src = {secHandIMG} style = {{transform: `rotate(${sec}deg)`}}/>
      <img src = {minHandIMG} style = {{transform: `rotate(${min}deg)`}}/>
      <img src = {hourHandIMG} style = {{transform: `rotate(${hour}deg)`}}/>
      <img id = {"tablo"} src = {tabloIMG}/>
    </div>
    </>
  );
}

const SecondsTimer = ({seconds}) => <h2>{seconds}</h2>

const TimerContainer = ({seconds=1800, refresh=1000, render=SecondsTimer}) => {
  const [count,setCount] = useState(seconds);
  const [pause,setPause] = useState(false) 
  const Sec = render
  let timer;
  
  // const tick = () => {
  //   if(count !== 0){
  //       setCount(count-1)
  //   }
  // }     
  useEffect(()=>{
    if(!pause){
    let elapsedTime = refresh;
    
    if (count > 0) {
    let startTime = Date.now();
      function step() {
        elapsedTime = Date.now() - startTime;
        setCount(c=> c-1)
        console.log(elapsedTime)
      }
      timer = setInterval(step,elapsedTime);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }},[count,pause])
    return (
      <>
      <Sec seconds = {count}/>
      <button className = {(!pause && "btn btn-outline-danger")|| "btn btn-outline-success"} onClick = {()=>setPause(!pause) }>{(!pause && "Stop")|| "Go"}</button>
      </>
    )
 }

const ButtonCounter = ({КОГОМАЛЮВАТИ="div"}) => {
  const [counter, setCounter] = useState(0)

  return (
    <>
     <КОГОМАЛЮВАТИ >{counter}</КОГОМАЛЮВАТИ>
     <button onClick = {() => setInterval(setCounter(counter + 1 ), 1000)}> Start</button>
    </>
)
}



function App() {

  return (
    <>

      <Spoiler header={({ ...props }) => <h2 {...props}>Show</h2>}>
        <Input />
        <Input />


        <Spoiler header={({ onClick }) => <button onClick={onClick}>Show</button>}>
          <Input />
          <Input />
        </Spoiler>
      </Spoiler>

      <ButtonCounter КОГОМАЛЮВАТИ="h1"/>
      <RangeInput min={2} max={10} />

      <LoginForm startLogin='vasya'
        startPassword='пороль'
        onLogin={(l, p) => console.log(l, p)} />

      <PasswordConfirm min={2}/>
      <Timer seconds = {3600}/>
      <br/>
      <br/>
      <TimerContainer render = {Timer}/>
      <br/>
      <br/>
      <Watch seconds = {(Date.now()/1000)}/>
    </>
  )
}
export default App;
