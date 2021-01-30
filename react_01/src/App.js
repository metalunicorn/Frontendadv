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

const Timer = ({sec}) => {
const [counter, setCounter] = useState(sec) 
const [pause,setPause] = useState(true) 

const padTime = time => {
  return String(time).length === 1 ? `0${time}` : `${time}`;
};

const format = time => {
  
  const seconds = time % 60;
  const minutes = (Math.floor(time / 60)) % 60;
  const hours = Math.floor(time/(60*60))
  return `${hours}:${minutes}:${padTime(seconds)}`;
};


// let minutes = Math.floor(sec /60);
// let hours = Math.floor(minutes /60);

const tick = () => {
  if(!pause && counter !== 0){
          setCounter(counter-1)
  }
}     
setTimeout(tick, 1000)

  return(
    <>
    <div>{format(counter)}</div>
    <button onClick = {()=>setPause(!pause) }>{(!pause && "Stop" )|| "Go"}</button>
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
      <Timer sec = {3600}/>
    </>
  )
}
export default App;
