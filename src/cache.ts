import { execSync } from 'child_process'
import * as core from '@actions/core'
import * as cache from '@actions/cache'

export function getCacheFolder() {
  const result = Buffer.from(execSync('npm config get cache').buffer).toString()
  return result
}

export async function saveCache() {
  const cachePath = getCacheFolder()
  const primaryKey = 'FIREBASE_CLI_CACHE_KEY'
  try {
    await cache.saveCache([cachePath], primaryKey)
    core.info(`Cache saved with the key: ${primaryKey}`)
  } catch (error: any) {
    if (error.name === cache.ValidationError.name) {
      throw error
    } else if (error.name === cache.ReserveCacheError.name) {
      core.info(error.message)
    } else {
      core.warning(`${error.message}`)
    }
  }
}

export async function restoreCache() {
  const cachePath = getCacheFolder()
  const primaryKey = 'FIREBASE_CLI_CACHE_KEY'
  const cacheKey = await cache.restoreCache([cachePath], primaryKey)
  core.setOutput('cache-hit', Boolean(cacheKey))

  if (!cacheKey) {
    core.info('Cache is not found')
    return
  }

  core.info(`Cache restored from key: ${cacheKey}`)
}
