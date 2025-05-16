// 'use client'

// import { useEffect, useState } from 'react'
// import { initDatabase } from '../lib/localDb'

// export default function PoiClientView() {
//   const [loaded, setLoaded] = useState(false)

//   useEffect(() => {
//     const loadDb = async () => {
//       try {
//         const db = await initDatabase()
//         console.log('✅ SQLite DB Ready', db)
//         setLoaded(true)
//       } catch (e) {
//         console.error('💥 DB load failed:', e)
//       }
//     }
//     loadDb()
//   }, [])

//   return loaded ? <p>✅ DB Loaded</p> : <p>Loading DB...</p>
// }
