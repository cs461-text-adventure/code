
// components/Logo.tsx
import styles from './logo.module.css';

export default function Logo (){
  return (
    <div className={`${styles.pixel} z-10 rotate-[-5deg] transition-transform duration-300`}>
      <div className="inline-block bg-black text-green-400 border-2 border-green-400 p-2 font-mono">
        <span className="block text-2xl font-bold">TEXT</span>
        <span className="block text-sm">ADVENTURES</span>
      </div>
    </div>
  )
}


