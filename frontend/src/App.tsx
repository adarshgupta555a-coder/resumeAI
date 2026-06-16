import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import HomePage from './pages/HomePage';


function App() {

  return (
    <>
      <header className='w-full p-2 bg-white border-b-2 fixed flex justify-between px-2'>
        <img src="/android-chrome-512x512.png" className='h-10' alt="logo" />
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>       
      </header>
      <br/>

      <HomePage/>

    </>
  )
}

export default App