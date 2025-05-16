
// 'use client'

// import { useEffect, useState } from 'react'

// let dbInstance = null

// export async function initDatabase() {
//   if (typeof window === 'undefined') return null // SSR protection
//   if (dbInstance) return dbInstance

//   try {
//     const initSqlJs = (await import('sql.js')).default

//     const SQL = await initSqlJs({
//       locateFile: file => `https://sql.js.org/dist/${file}`
//     })

//     dbInstance = new SQL.Database()

//     dbInstance.run(`
//       CREATE TABLE IF NOT EXISTS pois (
//         id TEXT PRIMARY KEY,
//         user_id TEXT,
//         name TEXT,
//         latitude REAL,
//         longitude REAL,
//         category TEXT,
//         created_at TEXT DEFAULT CURRENT_TIMESTAMP
//       );
//     `)

//     return dbInstance
//   } catch (err) {
//     console.error('Failed to init DB:', err)
//     throw err
//   }
// }


// // Helper functions for common database operations
// export const dbOperations = {
//   // Get all POIs
//   getAllPois: (db) => {
//     if (!db) throw new Error('Database not initialized')
    
//     try {
//       const results = db.exec('SELECT * FROM pois ORDER BY created_at DESC')
//       if (results.length === 0) return []
      
//       const poiData = results[0].values.map(row => {
//         const columns = results[0].columns
//         return columns.reduce((obj, column, index) => {
//           obj[column] = row[index]
//           return obj
//         }, {})
//       })
      
//       return poiData
//     } catch (error) {
//       console.error('Error getting POIs:', error)
//       throw error
//     }
//   },
  
//   // Get POI by ID
//   getPoiById: (db, id) => {
//     if (!db) throw new Error('Database not initialized')
    
//     try {
//       const stmt = db.prepare('SELECT * FROM pois WHERE id = ?')
//       stmt.bind([id])
      
//       const result = stmt.getAsObject()
//       stmt.free()
      
//       return Object.keys(result).length > 0 ? result : null
//     } catch (error) {
//       console.error('Error getting POI by ID:', error)
//       throw error
//     }
//   },
  
//   // Add a new POI
//   addPoi: (db, poi) => {
//     if (!db) throw new Error('Database not initialized')
    
//     try {
//       const stmt = db.prepare(`
//         INSERT INTO pois (id, user_id, name, latitude, longitude, category) 
//         VALUES (?, ?, ?, ?, ?, ?)
//       `)
      
//       stmt.run([
//         poi.id, 
//         poi.user_id, 
//         poi.name, 
//         poi.latitude, 
//         poi.longitude, 
//         poi.category
//       ])
      
//       stmt.free()
//       return true
//     } catch (error) {
//       console.error('Error adding POI:', error)
//       throw error
//     }
//   },
  
//   // Update an existing POI
//   updatePoi: (db, poi) => {
//     if (!db) throw new Error('Database not initialized')
    
//     try {
//       const stmt = db.prepare(`
//         UPDATE pois 
//         SET name = ?, latitude = ?, longitude = ?, category = ? 
//         WHERE id = ?
//       `)
      
//       stmt.run([
//         poi.name, 
//         poi.latitude, 
//         poi.longitude, 
//         poi.category, 
//         poi.id
//       ])
      
//       stmt.free()
//       return true
//     } catch (error) {
//       console.error('Error updating POI:', error)
//       throw error
//     }
//   },
  
//   // Delete a POI
//   deletePoi: (db, id) => {
//     if (!db) throw new Error('Database not initialized')
    
//     try {
//       const stmt = db.prepare('DELETE FROM pois WHERE id = ?')
//       stmt.run([id])
//       stmt.free()
//       return true
//     } catch (error) {
//       console.error('Error deleting POI:', error)
//       throw error
//     }
//   },
  
//   // Get POIs by user ID
//   getPoisByUserId: (db, userId) => {
//     if (!db) throw new Error('Database not initialized')
    
//     try {
//       const stmt = db.prepare('SELECT * FROM pois WHERE user_id = ? ORDER BY created_at DESC')
//       stmt.bind([userId])
      
//       const results = []
//       while(stmt.step()) {
//         results.push(stmt.getAsObject())
//       }
      
//       stmt.free()
//       return results
//     } catch (error) {
//       console.error('Error getting POIs by user ID:', error)
//       throw error
//     }
//   },
  
//   // Search POIs by name or category
//   searchPois: (db, searchTerm) => {
//     if (!db) throw new Error('Database not initialized')
    
//     try {
//       const stmt = db.prepare(`
//         SELECT * FROM pois 
//         WHERE name LIKE ? OR category LIKE ? 
//         ORDER BY created_at DESC
//       `)
      
//       const searchPattern = `%${searchTerm}%`
//       stmt.bind([searchPattern, searchPattern])
      
//       const results = []
//       while(stmt.step()) {
//         results.push(stmt.getAsObject())
//       }
      
//       stmt.free()
//       return results
//     } catch (error) {
//       console.error('Error searching POIs:', error)
//       throw error
//     }
//   },
  
//   // Export database to SQL
//   exportToSql: (db) => {
//     if (!db) throw new Error('Database not initialized')
    
//     try {
//       // Get the SQL commands to recreate the database
//       return db.exec("SELECT sql FROM sqlite_master WHERE sql NOT NULL;")
//     } catch (error) {
//       console.error('Error exporting database:', error)
//       throw error
//     }
//   },
  
//   // Export database to binary
//   exportToBinary: (db) => {
//     if (!db) throw new Error('Database not initialized')
    
//     try {
//       return db.export()
//     } catch (error) {
//       console.error('Error exporting database to binary:', error)
//       throw error
//     }
//   }
// }

// // Custom hook for database operations
// export function useDatabase() {
//   const [db, setDb] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
  
//   useEffect(() => {
//     // Initialize database on client-side only
//     const loadDb = async () => {
//       try {
//         const database = await initDatabase()
//         setDb(database)
//         setLoading(false)
//       } catch (err) {
//         console.error('Error loading database:', err)
//         setError(err)
//         setLoading(false)
//       }
//     }
    
//     loadDb()
//   }, [])
  
//   return { 
//     db, 
//     loading, 
//     error,
//     ...Object.keys(dbOperations).reduce((acc, key) => {
//       acc[key] = (...args) => dbOperations[key](db, ...args)
//       return acc
//     }, {})
//   }
// }