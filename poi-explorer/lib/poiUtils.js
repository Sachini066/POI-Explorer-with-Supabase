import { supabase } from './supabaseClient'

export async function savePoi(poi, userId) {
  const formattedPoi = {
    id: poi.place_id || poi.id || `poi-${Date.now()}`,
    user_id: userId,
    name: poi.display_name || poi.name,
    latitude: parseFloat(poi.lat || poi.latitude),
    longitude: parseFloat(poi.lon || poi.longitude),
    category: poi.category || 'custom',
  }

  const { data, error } = await supabase.from('pois').upsert(formattedPoi)

  if (error) {
    console.error('Failed to save POI to Supabase:', error)
    throw error
  }

  return data
}
