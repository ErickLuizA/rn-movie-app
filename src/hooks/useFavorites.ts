import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { Movie } from '../models/Movie'
import { TvShow } from '../models/TvShow'

type FavoriteMovie = {
  type: 'movie'
  data: Movie
}

type FavoriteTvShow = {
  type: 'tvShow'
  data: TvShow
}

type Favorite = FavoriteTvShow | FavoriteMovie

type Favorites = {
  loading: boolean
  error: string
  data: Favorite[]
}

interface IUseFavoritesReturn {
  favorites: Favorites
  retryGetFavorites: () => Promise<void>
}

export default function useFavorites(): IUseFavoritesReturn {
  const [favorites, setFavorites] = useState<Favorites>({
    loading: true,
    error: '',
    data: [],
  })

  useEffect(() => {
    getFavorites()
  }, [])

  async function getFavorites() {
    try {
      const storagedFavs = await AsyncStorage.getItem('@Mas/favorites')

      let favoritesArray: Favorite[] = []

      if (storagedFavs) {
        favoritesArray = JSON.parse(storagedFavs)
      }

      setFavorites({
        data: favoritesArray,
        error: '',
        loading: false,
      })
    } catch (error) {
      setFavorites({
        data: [],
        error: 'Error while getting favorites from storage',
        loading: false,
      })
    }
  }

  async function retryGetFavorites() {
    await getFavorites()
  }

  return { favorites, retryGetFavorites }
}
