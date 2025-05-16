// // lib/sync.js (or wherever you put your sync logic)
// import { initDatabase, dbOperations } from './localDb'
// import { supabase } from './supabaseClient'

// export async function syncPoisToBackend() {
//   try {
//     const db = await initDatabase()
//     if (!db) {
//       console.warn('No database available for syncing.')
//       return
//     }

//     const pois = dbOperations.getAllPois(db)

//     for (const poi of pois) {
//       const { error } = await supabase.from('pois').upsert(poi, {
//         onConflict: 'id',
//       })

//       if (error) {
//         console.error('❌ Failed to sync POI:', poi.id, error)
//       } else {
//         console.log('✅ Synced POI:', poi.id)
//       }
//     }
//   } catch (err) {
//     console.error('💥 Error syncing POIs to backend:', err)
//   }
// }
